import psycopg2
from src.helper import retrieveRecipeList

def insertRecipe(recipeDetails):
    """ Inserts recipe into database when receiving details from
        the recipe contributor

    Args:
        recipeDetails (dictionary): Dictionary of the recipe details
    """
    
    db = psycopg2.connect("host=ec2-34-239-241-121.compute-1.amazonaws.com dbname=dbqkcfh5i7ab0f user=fywiddopknmklg password=a6facfdde8aa1a8ad6a8f549aa7169e811e69a1b01ff042836161893b2fd5abc")
    recipeList = retrieveRecipeList(db);
    noOfRecipes = len(recipeList)
    recipeID = noOfRecipes + 1
    servings = recipeDetails['servings']
    timeToCook = recipeDetails['timeToCook']
    mealType = recipeDetails['mealType']
    photo = recipeDetails['photo']
    calories = recipeDetails['calories']
    cookingSteps = recipeDetails['cookingSteps']
    ingredients = recipeDetails['ingredients']
    title = recipeDetails['title']
    cur = db.cursor()
    qry = """
    insert into recipes
    values (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cur.execute(qry, [recipeID, servings, timeToCook, mealType, photo, calories, cookingSteps, title, ingredients])
    db.commit()
    info = cur.rowcount
    cur.close()
    return info