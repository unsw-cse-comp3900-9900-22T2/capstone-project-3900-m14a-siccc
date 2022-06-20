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


def sortingIngredients(db):
    """ Sorting ingredients function to sort the list of ingredients
        by alphabetically.

            Parameters:
                db: database

            Returns:
                ingredients (list): the list of categories after sorting
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