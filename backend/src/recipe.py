import json
from lib2to3.pytree import convert
import psycopg2
from src.helper import retrieveRecipe, retrieveRecipeList
from src.config import host, user, password, dbname


def recipeMatch(ingredientsList, blacklist):
    """ Sends front end a list of recipes that satisfy the list 
        of ingredients that the user selected by alphabetically.

        Parameters:
            ingredientsList (str): list of ingredients user selected
            blacklist (str): list of blacklisted ingredients user selected

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
        ingredients = ingredientString.split(',')
        matching = 0
        for i in ingredientsList: # i is ingredient user selected 
            for j in ingredients:   # j is ingredient in recipe  
                for k in blacklist: # k is ingredient in blacklist 
                    if i in j and k not in j:
                        matching += 1
                        continue
        if matching == len(ingredients):
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



