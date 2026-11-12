
from database import engine

def migrate_database():
    migrations = {
        "filename": "VARCHAR(255)",
        "lab_name": "VARCHAR(150) DEFAULT 'Apex Diagnostics'",
        "date": "VARCHAR(20) DEFAULT ''",
        "status": "VARCHAR(50) DEFAULT 'Analyzed'",
        "verified": "BOOLEAN DEFAULT TRUE",
        "tests": "JSONB DEFAULT '[]'::jsonb",
        "user_id": "INTEGER"
    }

    with engine.begin() as connection:

        columns = {
            row[0]
            for row in connection.exec_driver_sql("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_schema = 'public'
                AND table_name = 'lab_reports'
            """)
        }

        print("Existing columns:", columns)

        for column, definition in migrations.items():
            if column not in columns:
                connection.exec_driver_sql(
                    f'ALTER TABLE public.lab_reports ADD COLUMN "{column}" {definition}'
                )
                print(f"Added column: {column}")
            else:
                print(f"Already exists: {column}")

    print("PostgreSQL migration completed successfully.")


if __name__ == "__main__":
    migrate_database()
