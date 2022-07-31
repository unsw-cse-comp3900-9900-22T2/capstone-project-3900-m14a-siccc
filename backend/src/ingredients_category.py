from src.helper import dbConnection


def sortingCategories():
    """ Sorting categories function to sort the list of categories 
        by alphabetically.
        
            Returns:
                categories (list): the list of categories after sorting
    """
    db = dbConnection()
    cur = db.cursor()
    qry = """
    select * 
    from categories
    order by name;
    """
    cur.execute(qry)
    info = cur.fetchall()
    cur.close()
    
    result = []
    for cate in info:
        cat, = cate 
        result.append(cat)

    return result


def sortingAllIngredients():
    """ Sorting ingredients function to sort the list of ingredients
        in all categories by alphabetically.

            Returns:
                ingredients (list): the list of ingredients after sorting
    """
    db = dbConnection()
    cur = db.cursor()
    qry = """
    select * 
    from ingredients
    order by categories, name;
    """
    cur.execute(qry)
    info = cur.fetchall()
    cur.close()
    
    result = []
    for ing in info:
        ingredient, = ing
        result.append(ingredient)

    return result


def sortingIngredients(cate):
    """ Sorting ingredients function to sort the list of ingredients
        in one category by alphabetically.

            Parameters:
                cate (str): the name of the categories

            Returns:
                ingredients (list): the list of ingredients after sorting
    """
    db = dbConnection()
    cur = db.cursor()
    qry = f"""
    select * 
    from ingredients
    where categories = %s
    order by name;
    """
    cur.execute(qry, [cate])
    info = cur.fetchall()
    cur.close()
    
    result = []
    for ing in info:
        veg, _, _, _ = ing 
        result.append(veg)
    
    return result
    
def sortIngredientsInCategories():
    """ Sorts all categories and ingredients in the categories and 
        returns a dictionary
        
            Returns:
                result (dict) : dictionary of all ingredients and 
                        categories sorted
    """
    result = {}
    listOfCategories = sortingCategories()
    for cate in listOfCategories:
        listOfIngredients = sortingIngredients(cate)
        result[cate] = listOfIngredients
    return result
