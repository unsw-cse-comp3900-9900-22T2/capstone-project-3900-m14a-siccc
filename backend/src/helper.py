def getIngredient(db, name):
    """ Helper function to retrieve row of ingredient  by name

            Parameters
                name (str) : name of ingredient

            Return
                category : category of ingredient
    """
    cur = db.cursor()
    qry = """
    select *
    from ingredients
    where name = %s
    """
    cur.execute(qry, [name])
    info = cur.fetchone()
    cur.close()
    if not info:
        return None 
    else:
        return info

def findIngredientsCategory(db, name):
    """ Helper function to retrieve ingredient category by name

            Parameters
                name (str) : name of ingredient

            Return
                category : category of ingredient
    """
    cur = db.cursor()
    qry = """
    select category
    from ingredients
    where name = %s
    """
    cur.execute(qry, [name])
    info = cur.fetchone()
    cur.close()
    category, = info 
    if not info:
        return None
    else:
        return category

""" Helper function to retrieve ingredient calories by name

"""

""" Helper function to retrieve list of categories

"""

""" Helper function to retrieve recipes based on list of ingredients

"""