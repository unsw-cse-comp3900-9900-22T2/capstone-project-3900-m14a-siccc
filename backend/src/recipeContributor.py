import psycopg2
from src.helper import dbConnection, retrieveRecipeList
from src.calories_recipes import calorieCalculation
from src.config import host, user, password, dbname

def insertRecipe(recipeDetails):
    """ Inserts recipe into database when receiving details from
        the recipe contributor

        Parameters:
            recipeDetails (dictionary): Dictionary of the recipe details
        
        Return:
            info (list): The details of recipe
    """
    db = dbConnection()
    recipeList = retrieveRecipeList(db)
    noOfRecipes = len(recipeList)
    recipeID = noOfRecipes + 1
    servings = recipeDetails['servings']
    timeToCook = recipeDetails['timeToCook']
    mealType = recipeDetails['mealType']
    photo = recipeDetails['photo']
    cookingSteps = formatSteps(recipeDetails['cookingSteps'])
    ingredients = recipeDetails['ingredients']
    calories = calorieCalculation(ingredients)
    ing = ''
    ingWithoutGrams = ''
    count = 0
    lengthDict = len(ingredients)
    for entry in ingredients.items():
        ingred, grams = entry
        ing = ing + str(grams) + ' ' + ingred
        ingWithoutGrams = ingWithoutGrams + ingred
        if count != lengthDict - 1:
            ing = ing + ', '
            ingWithoutGrams = ingWithoutGrams + ', '
        count += 1
    title = recipeDetails['title']
    cur = db.cursor()
    qry = """
    insert into recipes
    values (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cur.execute(qry, [recipeID, servings, timeToCook, mealType, photo, 
                calories, cookingSteps, title, ing])
    db.commit()
    info = cur.rowcount
    qry = """
    delete 
    from frequency
    where ingredients = %s
    """
    cur.execute(qry, [ingWithoutGrams])
    db.commit()
    cur.close()
    return info


def getNoRecipeMatchList():
    """ Grabs the list of commonly input ingredients with no recipe match
    
            Return:
                result (list): list of sets of ingredients ordered by most frequent
    """
    db = dbConnection()
    cur = db.cursor()
    qry = """
    select ingredients
    from frequency
    order by count desc
    """
    result = []
    cur.execute(qry)
    info = cur.fetchall()
    for elem in info:
        string, = elem 
        result.append(string)
    
    return result


def addFrequency(ingredients):
    """ Adds the set of ingredients to frequency table if 
        there is no recipe match.
        If the ingredient does not exist in the database,
        we can add an entry. 
        If the ingredient exists in the database, the frequency
        of this ingredient would be plus one. 

            Parameters:
                ingredients (list): set of ingredients
    """
    if len(ingredients) != 0:
        ingredients = ', '.join(ingredients)
        db = dbConnection()
        cur = db.cursor()
        qry = """
        select count
        from frequency
        where ingredients = %s
        """
        cur.execute(qry, [ingredients])
        currCount = cur.fetchone()
        if currCount is None:
            qry = """
            insert into frequency
            values (%s, 1) 
            """
            cur.execute(qry,[ingredients])
            db.commit()
        else:
            currCount, = currCount
            currCount = int(currCount)
            currCount += 1
            qry = """
            update frequency
            set count = %s
            where ingredients = %s
            """
            cur.execute(qry, [currCount, ingredients])
            db.commit()
        cur.close()
    

def formatSteps(cookingSteps):
    """ The details of meal cooking steps would be added. 

            Parameters:
                cookingSteps (list): list of all the cooking steps
                
            Returns:
                result (str): string of all the steps
    """
    result = ''
    counter = 1
    while counter <= len(cookingSteps):
        result = result + f"Step {counter}: {cookingSteps[counter-1]}"
        if counter != len(cookingSteps):
            result = result + '\n'
        counter += 1 
    return result  
