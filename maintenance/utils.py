from pathlib import Path
from rich.console import Console
from sqlite3 import Connection

console = Console()

def get_db_connection() -> Connection:
  db_path = Path(__file__).resolve().parent.parent / "public" / "synths.db"
  console.print(f"Initializing connection to {db_path}...")
  if not db_path.exists():
    raise FileNotFoundError(f"Unable to find {db_path}")
  db_connection = Connection(db_path)
  console.print(f"Connection established.")
  return db_connection