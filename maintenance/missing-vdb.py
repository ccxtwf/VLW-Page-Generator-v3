"""
  This is a maintenance script that does the following tasks:
    - Logs new synths added to VocaDB that are not listed in src/assets/synths.db
"""

import argparse
import json

from utils import console, get_db_connection

from dataclasses import dataclass

from typing import Literal, List, get_args

VOCADB_API_ENTRYPOINT = "https://vocadb.net/api/artists"

VocadbArtistType = Literal[
  "Vocaloid", "UTAU", "CeVIO", "SynthesizerV", 
  "ACEVirtualSinger", "AIVOICE", "VOICEVOX", 
  "NEUTRINO", "VoiSona", "NewType", "Voiceroid",
  "OtherVoiceSynthesizer"
]

@dataclass
class UnlistedSynth:
  vdb_id: int
  orig_name: str
  additional_names: str
  artist_type: VocadbArtistType
  vdb_page_status: str    # Draft/ Finished

def list_unlisted_synths(
    for_types: List[VocadbArtistType] = [], 
    max_fetch: int = 100, 
    fetch_page_size: int = 100,
    draft_sql: bool = False,
  ):
  """
    Task to log to console the new synths that may be added to 
    VocaDB but are not yet added to synths.db.

    This task is not responsible for adding the missing synths to 
    synths.db.
  """
  import requests

  results: List[UnlistedSynth] = []

  db = get_db_connection()

  n_requests = max_fetch // fetch_page_size

  default_vdb_params = {
    "allowBaseVoicebanks": True,
    "childTags": False, 
    "maxResults": fetch_page_size,
    "sort": "AdditionDate",
    "fields": "Names,AdditionalNames,BaseVoicebank",
    "lang": "Japanese",
    "getTotalCount": False,
    "preferAccurateMatches": False,
  }
  if len(for_types) > 0:
    default_vdb_params["artistTypes"] = ",".join(for_types)

  try:
    for i in range(n_requests):
      default_vdb_params["start"] = i * fetch_page_size
      with requests.get(
        VOCADB_API_ENTRYPOINT,
        params=default_vdb_params
      ) as res:
        console.print(f"Making a request to {res.request.url}")

        if not res.ok:
          raise Exception(f"Got unexpected response from the VocaDB API:\nSTATUS: {res.status_code}\nBODY: {res.text}")

        jo = res.json()
        items = jo.get("items", [])

        vdb_ids = [item.get("id") for item in items]
        __vdb_ids_in_db = db.execute(
          f"""
            SELECT vdb_id FROM synths s WHERE vdb_id IN ({ ",".join(map(str, vdb_ids)) });
          """
        ).fetchall()
        __vdb_ids_not_in_db = set([id for id, in __vdb_ids_in_db])

        filtered = [
          UnlistedSynth(
            vdb_id=item.get("id", 0),
            orig_name=item.get("name", ""),
            additional_names=item.get("additionalNames", ""),
            artist_type=item.get("artistType", ""),
            vdb_page_status=item.get("status", ""),
          )
          for item in items 
          if item.get("id", 0) not in __vdb_ids_not_in_db
        ]
        results.extend(filtered)

    # Print to console
    console.print("")
    if len(results) == 0:
      console.print(f"== No missing items that needed adding on synths.db ==\n", style="bold green")
    else:
      console.print(f"== Got {len(results)} items on VocaDB that are missing on synths.db ==\n", style="bold green")

      if draft_sql:
        last_id, = db.execute("SELECT MAX(id) FROM synths s ;").fetchone()
        has_other_synth_listed = False
        vdb_engine_mapper = {
          "Vocaloid": 1, 
          "UTAU": 2, 
          "CeVIO": 3, 
          "SynthesizerV": 4, 
          "ACEVirtualSinger": 6, 
          "AIVOICE": 5, 
          "VOICEVOX": 25, 
          "NEUTRINO": 15, 
          "VoiSona": 26, 
          "NewType": 19, 
          "Voiceroid": 24,
          "OtherVoiceSynthesizer": -1
        }
        console.print("INSERT INTO synths (id, engine_id, vdb_id, original_name, basevb_name, wikicat_name)")
        console.print("VALUES")
        for i, row in enumerate(results):
          console.print("  ({}, {}, {}, '{}', '{}', ''),".format(
            last_id+i+1,
            vdb_engine_mapper[row.artist_type],
            row.vdb_id,
            row.orig_name,
            row.additional_names
          ))
          if vdb_engine_mapper[row.artist_type] == -1:
            has_other_synth_listed = True
        if has_other_synth_listed:
          console.print("\nRemember to specify the synth type for OtherVoiceSynthesizer", style="red bold")
      else:
        row_format = "{:<12} {:<25} {:<40} {:<25} {:<10}"
        console.print(row_format.format("VDB ID", "ORIGINAL NAME", "ADDITIONAL NAMES", "TYPE", "STATUS"))
        console.print("-" * 116)
        for row in results:
          console.print(row_format.format(
            row.vdb_id, 
            row.orig_name, 
            row.additional_names, 
            row.artist_type, 
            row.vdb_page_status
          ))

  except Exception:
    db.close()
    raise

def init_argparse() -> argparse.ArgumentParser:
  parser = argparse.ArgumentParser(
    usage="uv run missing-vdb.py [--n INT] [--fetch INT] [--sql]",
    description="Maintenance scripts to maintain synths.json and synthEngines.json",
    formatter_class=argparse.ArgumentDefaultsHelpFormatter
  )

  def artist_type_validation(string: str):
    items = [x.strip() for x in string.split(',')]
    valid_choices = get_args(VocadbArtistType)
    for item in items:
      if not item in valid_choices:
        raise argparse.ArgumentTypeError(
          f"'{item}' is invalid. Choose from: {', '.join(valid_choices)}"
        )
    return items

  parser.add_argument(
    "types",
    type=artist_type_validation,
    help="Comma-separated list of types to check"
  )
  parser.add_argument(
    "--n",
    type=int,
    default=100,
    help="Number of artists to check on VocaDB, from newest to oldest",
  )
  parser.add_argument(
    "--fetch",
    type=int,
    default=100,
    help="Number of items to fetch per VocaDB API request",
  )
  parser.add_argument(
    "--sql",
    action="store_true",
    default=False,
    help="Draft a SQL insert statement",
  )

  return parser

if __name__ == "__main__":
  parser = init_argparse()
  args = parser.parse_args()
  list_unlisted_synths(
    for_types=args.types,
    max_fetch=args.n,
    fetch_page_size=args.fetch,
    draft_sql=args.sql
  )