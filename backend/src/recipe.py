import json
from lib2to3.pytree import convert
import psycopg2
from src.helper import retrieveRecipe, retrieveRecipeList
from src.config import host, user, password, dbname


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
    userIngrLen = len(ingredientsList)
    db = psycopg2.connect(
        f"host={host} dbname={dbname} user={user} password={password}")
    info = retrieveRecipeList(db)
    for recipe in info:
        ingredientString = recipe[8]
        ingredients = ingredientString.split(', ')
        missingIngList = ingredients.copy()
        matching = 0
        for i in ingredientsList:
            for j in ingredients:
                if i in j:
                    matching += 1
                    missingIngList.remove(j)
        if matching == len(ingredients) or matching == len(ingredients) - 1:
            missingIng = ''
            if matching == len(ingredients) - 1:
                ing = missingIngList.pop()
                ing = ing.split(' ')
                ing.pop(0)
                missingIng = " ".join(ing)
            ingDict = {
                    "recipeID": recipe[0],
                    "title": recipe[7],
                    "servings": recipe[1],
                    "timeToCook": recipe[2],
                    "mealType": recipe[3],
                    "photo": recipe[4],
                    "calories": recipe[5],
                    "cookingSteps": recipe[6],
                    "ingredients": recipe[8],
                    "missingIngredient": missingIng,
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
    db = psycopg2.connect(
        f"host={host} dbname={dbname} user={user} password={password}")
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



