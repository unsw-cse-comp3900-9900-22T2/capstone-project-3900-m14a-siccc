import sys
import psycopg2
import re

db = None

try:
    db = psycopg2.connect("dbname=recipeMatcherDB user=postgres password=hello123")
    cur = db.cursor()
    qry = """
    select * 
    from ingredients
    """
    cur.execute(qry)
    info = cur.fetchall()
    cur.close()
    print(info)

except Exception as err:
    print("DB error: ", err)
finally:
    if db:
        db.close()