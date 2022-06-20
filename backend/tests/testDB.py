import psycopg2

db = None

try:
    db = psycopg2.connect("host=database-1.c0xbbloavtwb.ap-southeast-2.rds.amazonaws.com dbname=comp3900db user=postgres password=hello123")
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