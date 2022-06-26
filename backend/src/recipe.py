import json
import psycopg2
from src.helper import retrieveIngredientNames, retrieveRecipe, retrieveRecipeList

def recipeMatch(ingredientsList):
    """ Sends front end a list of recipes that satisfy the list 
        of ingredients that the user selected by alphabetically.

        Parameters:
            ingredientsList (str): list of ingredients user selected
        
        Return:
            recipeList (list): list of recipes id's satisfying the ingredients
    """
    # [[relevent percetage, recipe information], ..., 
    # [relevent percetage, recipe information]]
    recipeList = []
    matches = len(ingredientsList)
    db = psycopg2.connect("host=database-1.c0xbbloavtwb.ap-southeast-2.rds.amazonaws.com dbname=comp3900db user=postgres password=hello123")
    info = retrieveRecipeList(db)
    for recipe in info:
        ingredientString = recipe[8]
        ingredients = ingredientString.split(',')
        matching = 0
        for i in ingredientsList:
            for j in ingredients:
                if i in j:
                    matching += 1
                    continue
        if matching == matches:
            ingDict = {
                "recipeID": recipe[0],
                "title": recipe[7],
                "servings": recipe[1],
                "timeToCook": recipe[2],
                "mealType": recipe[3],
                "photo": recipe[4],
                "calories": recipe[5],
                "cookingSteps": recipe[6],
                "ingredients": recipe[8]
            }
            recipeList.append(ingDict)
            
    return recipeList

def recipeDetails(recipeID):
    """ Retrieves recipe details given a recipe id
    
            Parameters:
                recipeID (int): recipe id as an integer
                
            Returns:
                recipeID (int): id of recipe
                title (str): title of recipe
                servings (int): serving size of recipe
                timeToCook (int): cooking time
                mealType (str): meal type
                photo (binary): photo of meal
                calories (int): calories of meal
                cookingSteps (str): cooking steps of recipe
                ingredients (str): ingredients of recipe
    """
    db = psycopg2.connect("host=database-1.c0xbbloavtwb.ap-southeast-2.rds.amazonaws.com dbname=comp3900db user=postgres password=hello123")
    info = retrieveRecipe(db, recipeID)

    return {
        "recipeID": info[0],
        "title": info[7],
        "servings": info[1],
        "timeToCook": info[2],
        "mealType": info[3],
        "photo": info[4],
        "calories": info[5],
        "cookingSteps": info[6],
        "ingredients": info[8]
    }

