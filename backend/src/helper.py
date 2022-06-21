def getIngredient(db, name):
    """ Helper function to retrieve row of ingredient by name

            Parameters
                db : database
                name (str): name of ingredient

            Return
                category (str): category of ingredient
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
                db : database
                name (str): name of ingredient

            Return
                category (str): category of ingredient
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

def getCalories(db, name):
    """ Helper function to retrieve ingredient calories by name

            Parameters
                db : database
                name (str): name of ingredient
            
            Returns
                calories (int): calories of ingredient per 100g
    """
    cur = db.cursor()
    qry = """
    select calories
    from ingredients
    where name = %s
    """
    cur.execute(qry, [name])
    info = cur.fetchone()
    cur.close()
    calories, = info
    if not info:
        return None
    else:
        return calories

def retrieveCategories(db):
    """ Helper function to retrieve list of categories

            Parameters
                db: database
            
            Returns
                info: list of all tuples of categories
    """
    cur = db.cursor()
    qry = """
    select * 
    from categories
    """
    cur.execute(qry)
    info = cur.fetchall()
    cur.close()
    if not info:
        return None
    else:
        return info

def retrieveIngredientNames(db):
    """ Helper function to retrieve all ingredient names in database

            Parameters
                db : database

            Returns
                info (list): list of all ingredient names
    """
    cur = db.cursor()
    qry = """
    select name 
    from ingredients
    """
    cur.execute(qry)
    info = cur.fetchall()
    cur.close()
    if not info:
        return None
    else:
        return info 

def retrieveIngredients(db):
    """ Helper function to retrieve all ingredient tuples in database

            Parameters
                db : database

            Returns
                info (list): list of all ingredient tuples
    """
    cur = db.cursor()
    qry = """
    select * 
    from ingredients
    """
    cur.execute(qry)
    info = cur.fetchall()
    cur.close()
    if not info:
        return None
    else:
        return info 

def retrieveRecipe(db, id):
    """ Helper function to retrieve recipe information given a 
        recipe id

            Parameters:
                db: database
                id (int): recipe identifier

            Returns:
                recipe (list): list of tuples of ingredient details
    """
    cur = db.cursor()
    qry = """
    select * 
    from recipes
    where id = %s
    """
    cur.execute(qry, [id])
    info = cur.fetchone()
    cur.close()
    if not info:
        return None
    else:
        return info 

def retrieveRecipeList(db):
    """ Helper function to retrieve list of recipes

            Parameters:
                db : database
        
            Returns:
                info: list of all recipes
    """
    cur = db.cursor()
    qry = """
    select *
    from recipes
    """
    cur.execute(qry)
    info = cur.fetchall()
    cur.close()
    if not info:
        return None
    else:
        return info
    
def retrieveRecipeIngredientsList(db):
    """ Helper function to retrieve list of recipe ingredients

            Parameters:
                db : database
        
            Returns:
                info: list of all recipes ingredients
    """
    cur = db.cursor()
    qry = """
    select ingredients
    from recipes
    """
    cur.execute(qry)
    info = cur.fetchall()
    cur.close()
    if not info:
        return None
    else:
        return info

def convertCalories(currCalories, gramToConvert):
    """ Helper function to convert the calories of the ingredients
        to any specified number of grams

            Parameters:
                currCalories (int): the 100g calorie value of ingredient
                gramToConvert (int): the grams required by recipe

            Returns:
                (int): the new calorie value
    """
    return (gramToConvert/100)*currCalories
