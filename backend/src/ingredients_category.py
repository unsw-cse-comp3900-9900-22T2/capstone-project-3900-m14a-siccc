

""" Sorts list of categories alphabetically and 
    sends data to front end
"""

def sortingCategories(db):
    """ Sorting categories function to sort the list of categories 
        by alphabetically.

            Parameters:
                db: database

            Returns:
                categories (list): the list of categories after sorting
    """

    cur = db.cursor()
    qry = """
    select * 
    from categories
    order by name;
    """
    cur.execute(qry)
    info = cur.fetchone()
    cur.close()

    if not info:
        return None
    else:
        return info 


def sortingAllIngredients(db):
    """ Sorting ingredients function to sort the list of ingredients
        in all categories by alphabetically.

            Parameters:
                db: database

            Returns:
                ingredients (list): the list of ingredients after sorting
    """

    # cate = sortingCategories(db)

    cur = db.cursor()
    qry = """
    select * 
    from ingredients
    order by categories, name;
    """
    cur.execute(qry)
    info = cur.fetchone()
    cur.close()

    if not info:
        return None
    else:
        return info 


def sortingIngredients(db, cate):
    """ Sorting ingredients function to sort the list of ingredients
        in one category by alphabetically.

            Parameters:
                db: database
                cate: the name of the categories

            Returns:
                ingredients (list): the list of ingredients after sorting
    """

    cur = db.cursor()
    qry = f"""
    select * 
    from ingredients
    where category = {cate}
    order by name;
    """
    cur.execute(qry)
    info = cur.fetchone()
    cur.close()

    if not info:
        return None
    else:
        return info 

