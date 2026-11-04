import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "safecircle.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    schema_path = BASE_DIR / "schema.sql"

    with open(schema_path, "r", encoding="utf-8") as file:
        schema = file.read()

    conn = get_db()
    conn.executescript(schema)
    conn.commit()
    conn.close()