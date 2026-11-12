
from database import engine

print("Database type:", engine.dialect.name)

try:
    with engine.connect() as connection:
        result = connection.exec_driver_sql("SELECT version()")
        print("DATABASE CONNECTED SUCCESSFULLY!")
        print(result.scalar())

except Exception as e:
    print("DATABASE CONNECTION FAILED:")
    print(e)
