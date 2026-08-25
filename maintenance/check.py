"""
  This is a maintenance script that does the following tasks:
    - Checks for any faulty data in public/synths.db
    - Checks for any misaligned categories between public/synths.db and Vocaloid Lyrics Wiki
"""

import os
from dotenv import load_dotenv
import argparse
import time

from utils import console, get_db_connection, retry_request

from dataclasses import dataclass
from enum import Enum, auto

from typing import List, Tuple, Literal, get_args

load_dotenv()

VOCALOID_LYRICS_WIKI_API_ENTRYPOINT = os.getenv("VOCALOID_LYRICS_WIKI_API_ENTRYPOINT")
assert(VOCALOID_LYRICS_WIKI_API_ENTRYPOINT is not None)

@dataclass
class Synth:
  id: int
  orig_name: str
  engine: str
  basecat: str
  wikicat: str

@dataclass
class MisalignedSynth:
  engine: str
  wikicat: str
  reason: Literal["CATEGORY_NOT_FOUND", "ENGINE_MISMATCH"]

def log_synths(data: List[Tuple[int, str, str, str, str]]):
  row_format = "{:<10} {:<30} {:<20} {:<30} {:<30}"
  console.print(row_format.format("DB ID", "ORIGINAL NAME", "ENGINE", "BASE NAME", "CATEGORY NAME"))
  console.print("-" * 124)
  for (id, orig_name, engine, basecat, wikicat) in data:
    console.print(row_format.format(
      id, 
      orig_name, 
      engine, 
      basecat, 
      wikicat
    ))

def log_misaligned(data: List[MisalignedSynth]):
  row_format = "{:<30} {:<20} {:<20}"
  console.print(row_format.format("WIKI CATEGORY", "ENGINE", "REASON"))
  console.print("-" * 75)
  for o in data:
    console.print(row_format.format(
      o.wikicat,
      o.engine,
      o.reason,
    ))

def check_faulty_data():
  """
    Task to log any synths that may be added to synths.db incorrectly.
  """
  db = get_db_connection()
  
  q = f"""
    WITH synths_with_more_than_one_engine AS (
      SELECT wikicat_name FROM synths s 
      GROUP BY wikicat_name 
      HAVING COUNT(DISTINCT engine_id) > 1
    ) 
    SELECT 
      s.id, s.original_name, e.name AS engine, s.basevb_name, s.wikicat_name 
    FROM synths s 
    LEFT JOIN engines e
    ON s.engine_id = e.id 
    WHERE s.wikicat_name IN synths_with_more_than_one_engine;
  """
  ll = db.execute(q).fetchall()
  if len(ll) > 0:
    console.print(f"There are {len(ll)} rows whose wiki category is mapped to more than one engine", style="red")
    log_synths(ll)

  q = f"""
    SELECT 
      s.id, s.original_name, e.name AS engine, s.basevb_name, s.wikicat_name 
    FROM synths s 
    LEFT JOIN engines e
    ON s.engine_id = e.id 
    WHERE 
      s.wikicat_name LIKE '%(%)' AND
      s.wikicat_name NOT LIKE '%(' || engine ||')'
    ;
  """
  lm = db.execute(q).fetchall()
  if len(lm) > 0:
    console.print(f"There are {len(lm)} rows whose wiki category may be misaligned to its engine", style="red")
    log_synths(lm)

def check_misaligned_data(batch_size: int = 100):
  """
    Task to log any misaligned category between public/synths.db and Vocaloid Lyrics Wiki
  """
  import requests

  assert(VOCALOID_LYRICS_WIKI_API_ENTRYPOINT is not None)

  db = get_db_connection()

  misaligned: List[MisalignedSynth] = []

  q = """
    SELECT COUNT(DISTINCT wikicat_name) FROM synths s ;
  """
  n, = db.execute(q).fetchone()
  assert(type(n) == int)

  with requests.Session() as session:
    
    vlw_headers = {
      "User-Agent": os.getenv("BOT_UA", "")
    }

    login_token = None

    if os.getenv('BOT_USERNAME') is not None and os.getenv('BOT_PASSWORD') is not None:
      req_params_token = {
        'action':"query",
        'meta':"tokens",
        'type':"login",
        'format':"json"
      }
      with retry_request(
        session=session, 
        url=VOCALOID_LYRICS_WIKI_API_ENTRYPOINT, 
        method='GET', 
        params=req_params_token,
        headers=vlw_headers,
      ) as res:
        data = res.json()
        login_token = data['query']['tokens']['logintoken']
      req_params_login = {
        'action': "login",
        'lgname': os.getenv('BOT_USERNAME'),
        'lgpassword': os.getenv('BOT_PASSWORD'),
        'lgtoken': login_token,
        'format': "json"
      }
      with retry_request(
        session=session, 
        url=VOCALOID_LYRICS_WIKI_API_ENTRYPOINT, 
        method='POST', 
        body=req_params_login,
        headers=vlw_headers,
      ) as res:
        data = res.json()
        if data.get('login', {}).get('result', None) != 'Success':
          console.log(f"Unsuccessful login: Got response: {str(data)}", style="red")
          raise Exception()
        console.log(f"Successfully logged in as {str(data.get("login", {}).get("lgusername", None))}", style="green")

    else:
      batch_size = min(batch_size, 50)

    n_batches = n // batch_size
    if n % batch_size > 0:
      n_batches += 1

    vlw_req_params = {
      'action':'query',
      'format': 'json',
      'prop': 'categories',
      'cllimit': 'max',
    }
    CAT_PREFIX = "Category:Songs featuring "

    for i in range(n_batches):
      q = """
        SELECT DISTINCT 
          e.name AS engine, s.wikicat_name 
        FROM synths s 
        LEFT JOIN engines e
        ON s.engine_id = e.id
        ORDER BY engine_id ASC, wikicat_name ASC
        LIMIT ? OFFSET ?
        ;
      """
      synths: List[Tuple[str, str]] = db.execute(q, (batch_size, i * batch_size)).fetchall()
      dict_synths = { s.replace("_", " "): e for e, s in synths }
      vlw_req_params['titles'] = "|".join(map(lambda s: f"{CAT_PREFIX}{s[1]}", synths))
      with retry_request(
        session=session, 
        url=VOCALOID_LYRICS_WIKI_API_ENTRYPOINT, 
        method='GET', 
        params=vlw_req_params,
        headers=vlw_headers,
      ) as res:
        json = res.json()
        pages = json.get("query", {}).get("pages", {})
        for _pageid, page in pages.items():
          title = page.get("title", CAT_PREFIX)[len(CAT_PREFIX):]
          engine = dict_synths.get(title, "")
          if page.get("missing", None) is not None:
            misaligned.append(MisalignedSynth(
              engine=engine,
              wikicat=title,
              reason="CATEGORY_NOT_FOUND"
            ))
            continue
          pagecats = [o.get("title", None) for o in page.get("categories", [])]
          pagecats = [cat[len('Category:'):-1*len(" song categories")] for cat in pagecats if cat is not None]
          if engine not in pagecats:
            misaligned.append(MisalignedSynth(
              engine=engine,
              wikicat=title,
              reason="ENGINE_MISMATCH"
            ))

  if len(misaligned) > 0:
    console.print(f"There are {len(misaligned)} data points whose wiki category may be misaligned with the live wiki", style="red")
    log_misaligned(misaligned)

def init_argparse() -> argparse.ArgumentParser:
  parser = argparse.ArgumentParser(
    usage="uv run check.py [--n INT] [--fetch INT] [--sql]",
    description="Maintenance scripts to check data in synths.db",
    formatter_class=argparse.ArgumentDefaultsHelpFormatter
  )

  parser.add_argument(
    "mode",
    type=str,
    choices=["db", "vlw"],
    help="db = Check synths.db. vlw = Do a check of categories against the live wiki."
  )

  parser.add_argument(
    "--n",
    type=int,
    default=100,
    help="Number of category pages to check at a time",
  )

  return parser

if __name__ == "__main__":  
  parser = init_argparse()
  args = parser.parse_args()
  if args.mode == 'db':
    check_faulty_data()
  else:
    check_misaligned_data(batch_size=args.n)