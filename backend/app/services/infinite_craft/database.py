import sqlite3


class CombinationDb:
    def __init__(self):
        self.db_name = "infinite_craft.db"
        self.connection = sqlite3.connect(self.db_name, check_same_thread=False)
        self.cursor = self.connection.cursor()

        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS combinations (
                pair_key TEXT PRIMARY KEY,
                result TEXT NOT NULL,
                emoji TEXT NOT NULL
            )
        """)

        self.connection.commit()

    def save_combination(self, item1, item2, result, emoji):
        sorted_items = sorted([item1.strip().title(), item2.strip().title()])
        pair_key = sorted_items[0] + " + " + sorted_items[1]

        self.cursor.execute(
            "INSERT OR REPLACE INTO combinations (pair_key, result, emoji) VALUES (?, ?, ?)",
            (pair_key, result, emoji),
        )
        self.connection.commit()

    def get_combination(self, item1, item2):
        sorted_items = sorted([item1.strip().title(), item2.strip().title()])
        pair_key = sorted_items[0] + " + " + sorted_items[1]

        self.cursor.execute(
            "SELECT result, emoji FROM combinations WHERE pair_key = ?", (pair_key,)
        )
        row = self.cursor.fetchone()

        if row:
            return {"name": row[0], "emoji": row[1]}
        return None
