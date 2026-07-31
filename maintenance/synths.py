"""
  This is a maintenance script that does the following tasks:
    - Recreates the file src/constants/synthEngines.json
    - Recreates the file src/constants/synths.json
"""

import argparse
import json
from pathlib import Path

from utils import console, get_db_connection

from collections import namedtuple
from typing import Dict, Tuple, List

def recreate_synth_engines_json():
  """
    Task to recreate the list of synth engines that is used to 
    populate the dropdown boxes on the various forms.
  """

  db = get_db_connection()

  records = db.execute(
    """
      SELECT id, name FROM engines e ;
    """
  ).fetchall()
  db.close()
  console.print(f"Fetched {len(records)} engines", style="magenta")

  _json = json.dumps(
    [{ "id": id, "name": name } for id, name in records], 
    ensure_ascii=False, 
    indent=2
  )

  json_filepath = Path(__file__).resolve().parent.parent / "src" / "constants" / "synthEngines.json"
  with open(json_filepath, mode="w+", encoding="UTF-8") as f:
    f.write(_json)
  console.print(f"Finished writing to {json_filepath}!", style="green")

def recreate_synths_json():
  """
    Task to populate the most frequently used synths into synths.json

    This list will be cached onto the application's memory from startup,
    and the client will not have to make requests to synths.db unless 
    needed.
  """
  db = get_db_connection()

  priority_synths = []
  priority_list_filepath = Path(__file__).resolve().parent / "priority-synths.md"
  with open(priority_list_filepath, mode="r", encoding="UTF-8") as f:
    priority_synths = f.readlines()
    priority_synths = [
      synth.rstrip() for synth in priority_synths 
      # remove comments and whitespace
      if not synth.startswith("#") and 
         not synth == "\n" 
    ]
  console.print(f"Caching results for {len(priority_synths)} synths!", style="magenta")

  q = f"""
    WITH ll(wikicat) AS (
      VALUES { ",".join(map(lambda s: f"('{s}')", priority_synths)) }
    ) 
    SELECT wikicat FROM ll
    WHERE wikicat NOT IN (SELECT DISTINCT wikicat_name FROM synths)
    ;
  """
  ll = db.execute(q).fetchall()
  if len(ll) > 0:
    console.print(f"{len(ll)} synths are missing: {", ".join(map(lambda t : t[0], ll))}", style="red")

  q = f"""
    SELECT DISTINCT 
      wikicat_name, basevb_name, engine_id 
    FROM synths s 
    WHERE wikicat_name IN ({ ",".join(map(lambda s: f"'{s}'", priority_synths)) })
    ;
  """
  ls = db.execute(q).fetchall()
  lt = [{ "base": b, "cat": c, "eng": e } for (c, b, e) in ls]

  dd = { c: idx for idx, (c, b, e) in enumerate(ls) }

  q = f"""
    SELECT 
      vdb_id, wikicat_name 
    FROM synths s 
    WHERE wikicat_name IN ({ ",".join(map(lambda s: f"'{s}'", priority_synths)) })
    ORDER BY lower(wikicat_name) ASC, vdb_id DESC
    ;
  """
  ll = db.execute(q).fetchall()
  console.print(f"Fetched {len(ll)} records", style="magenta")

  de = { id: dd[c] for id, c in ll }

  l = {
    "synths": lt,
    "dict": de
  }

  _json = json.dumps(l, ensure_ascii=False, indent=2)

  json_filepath = Path(__file__).resolve().parent.parent / "src" / "constants" / "synths.json"
  with open(json_filepath, mode="w+", encoding="UTF-8") as f:
    f.write(_json)
  console.print(f"Finished writing to {json_filepath}!", style="green")

def init_argparse() -> argparse.ArgumentParser:
  parser = argparse.ArgumentParser(
    usage="uv run synths.py",
    description="Maintenance scripts to maintain synths.json and synthEngines.json",
    formatter_class=argparse.ArgumentDefaultsHelpFormatter
  )

  parser.add_argument(
    "mode",
    type=str,
    choices=["engines", "synths"],
    help="Recreate synthEngines.json or synths.json"
  )

  return parser

if __name__ == "__main__":
  parser = init_argparse()
  args = parser.parse_args()
  if args.mode == "engines":
    recreate_synth_engines_json()
  else:
    recreate_synths_json()