import psycopg2

db = None

try:
    db = psycopg2.connect("host=ec2-34-239-241-121.compute-1.amazonaws.com dbname=dbqkcfh5i7ab0f user=fywiddopknmklg password=a6facfdde8aa1a8ad6a8f549aa7169e811e69a1b01ff042836161893b2fd5abc")
    cur = db.cursor()
    qry = """
    select name 
    from ingredients
    """
    cur.execute(qry)
    info = cur.fetchall()
    cur.close()
    list = []
    for ingredient in info: 
        print(ingredient)
        list.append(ingredient)

except Exception as err:
    print("DB error: ", err)
finally:
    if db:
        db.close()