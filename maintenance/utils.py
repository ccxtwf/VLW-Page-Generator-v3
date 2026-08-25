from pathlib import Path
from rich.console import Console
from sqlite3 import Connection

import time

import requests

from typing import Dict, Literal, Any

console = Console()

def get_db_connection() -> Connection:
  db_path = Path(__file__).resolve().parent.parent / "public" / "synths.db"
  console.print(f"Initializing connection to {db_path}...")
  if not db_path.exists():
    raise FileNotFoundError(f"Unable to find {db_path}")
  db_connection = Connection(db_path)
  console.print(f"Connection established.")
  return db_connection

def retry_request(
    url: str, 
    method: Literal['GET', 'POST', 'PATCH', 'DELETE', 'HEAD'] = 'GET', 
    params: Dict[str, Any] = {},
    headers: Dict[str, Any] = {},
    body: Any = None, 
    max_retries: int = 3,
    session: requests.Session = requests.Session()
  ) -> requests.Response:
  n_retries = 0
  while n_retries < max_retries:
    with session.request(
      method, 
      url, 
      params=params,
      headers=headers,
      data=body
    ) as res:
      try:
        if not res.ok:
          console.print(f"Got unexpected response {res.status_code}: {res.text}", style="red")
          raise Exception()
        return res
      except:
        n_retries += 1
        if n_retries >= max_retries:
          raise ConnectionError()
        delay = 10 * n_retries
        console.print(f"Retrying after {delay} seconds...", style="magenta")
        time.sleep(delay)
  # unreachable code
  raise Exception()