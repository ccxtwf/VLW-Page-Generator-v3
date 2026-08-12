"""
  This is a maintenance script that does the following tasks:
    - Checks for any faulty data in src/assets/synths.db
    - Checks for any misaligned categories between src/assets/synths.db and Vocaloid Lyrics Wiki [TODO]
"""

import argparse
import json

from utils import console, get_db_connection

from dataclasses import dataclass

from typing import List, Tuple, get_args

@dataclass
class Synth:
  id: int
  orig_name: str
  engine: str
  basecat: str
  wikicat: str

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

  return parser

if __name__ == "__main__":
  parser = init_argparse()
  args = parser.parse_args()
  if args.mode == 'db':
    check_faulty_data()
  else:
    print("TODO")