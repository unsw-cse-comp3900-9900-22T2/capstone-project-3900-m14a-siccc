#from backend.src.helper import retrieveRecipeList
import psycopg2
from src.recipe import ingredientsSuggestions
from src.recipeContributor import insertRecipe
from src.config import host, user, password, dbname
import pytest

# def makeRecipeHelper(IngredientsList):
#     """
#     Helper Function for making a recipe in database given an ingredientslist 
#     Used for testing ingredient suggestions hopefully 
#     Will put in random photo, calories, names, etc.

#     Parameters - IngredientsList(list): list of ingredients 

#     """
#     ingredientString = IngredientsList.join(',')

#     db = psycopg2.connect(f"host={host} dbname={dbname} user={user} password={password}")
#     recipeList = retrieveRecipeList(db)
#     noOfRecipes = len(recipeList)
#     recipeID = noOfRecipes + 1

#     RandomRecipeDetails = {
#         'recipeID': recipeID,
#         'title': 'a',
#         'servings': 1,
#         'timeToCook': 1,
#         'mealType': 'breakfast', 
#         'photo': "invalidUrl",
#         'calories': 1,
#         'cookingSteps': 'alksjdhldf',
#         'ingredients': ingredientString,
#     }
#     insertRecipe(RandomRecipeDetails)




def test_simple_ingredientsSuggestions_test_noIngredientSelected():
    ingredientsList = []
    results = ingredientsSuggestions(ingredientsList)
    assert results == []

    # answer = []
    # match = True
    # for i in range(len(answer)):
    #     if answer[i] != results[i]:
    #         match = False
    # assert match is True

def test_ingredientSuggestion_CurrentDatabaseBaconEgg():
    ingredientsList = ["bacon", "egg"]
    results = ingredientsSuggestions(ingredientsList)
    answer = ["olive oil", "avocado", "flour", "thyme", ]
    assert results == answer

