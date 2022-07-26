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




def simple_ingredientsSuggestions_test_noIngredientSelected():
    ingredientsList = []
    results = ingredientsSuggestions(ingredientsList)
    answer = []
    match = True
    for i in range(len(answer)):
        if answer[i] != results[i]:
            match = False
    assert match is True

def test_ingredientSuggestion_CurrentDatabaseBaconEgg():
    ingredientsList = ["bacon", "egg"]
    results = ingredientsSuggestions(ingredientsList)
    answer = ["avocado", "bread", "flour", "beef", "olive oil"]
    assert results == answer
    """
    Using current recipes saved in database, worked it out manually 
    
                    freq	match %
        olive oil 	2	    66
        flour 	    3	    40
        thyme 	    1	    40
        avo	        5	    50
        cinnamon 	1	    33
        duck 	    1	    25
        bread	    3	    50
        parsley 	1	    33
        celery  	1	    33
        rice	    1	    33
        beef 	    3	    33
        cheese 	    1	    25

    Expected order 
        avo
        bread
        flour
        beef
        olive oil 
        thyme
        celery 
        cinnamon 
        parsley 
        rice
        cheese 
        duck 

    Hopefully right

    """
def test_ingredientSuggestion_noRecipeIngredientsSelected():
    """
    Clear all recipes

    User selects:
    [bacon, egg]

    Return: 
    []
    """
    makeRecipeHelper(["1 bacon", "1 egg"])

    ingredientsList = []
    results = ingredientsSuggestions(ingredientsList)
    
    assert results == []

def test_ingredientSuggestion_OneRecipeMatch():
    """
    Clear all recipes

    Add recipe:
    [bacon]

    User selects:
    [bacon]

    Return: 
    []
    """
    makeRecipeHelper(["1 bacon"])

    ingredientsList = ["bacon"]
    results = ingredientsSuggestions(ingredientsList)
    
    assert results == []

def test_ingredientSuggestion_OneRecipeNoMatch():
    """
    Clear all recipes

    Add recipe:
    [egg, celery]

    User selects:
    [bacon, bread]

    Return: 
    []
    """
    makeRecipeHelper(["1 egg", "1 celery"])

    ingredientsList = ["bacon", "bread"]
    results = ingredientsSuggestions(ingredientsList)
    
    assert results == []

def test_ingredientSuggestion_OneRecipeOneMatch():
    """
    Clear all recipes

    Add recipe:
    [bacon, egg]

    User selects:
    [bacon]

    Return: 
    [egg]
    """
    makeRecipeHelper(["1 bacon", "1 egg"])

    ingredientsList = ["bacon"]
    results = ingredientsSuggestions(ingredientsList)
    
    assert results == ["egg"]

def test_ingredientSuggestion_DiffFrequency():
    """
    Clear all recipes

    Add recipe:
    [bacon, egg, rice]			
    [bacon, egg, rice, eggplant]					
    [bacon, egg, rice, eggplant, cabbage]	

    User selects:
    [bacon, egg]

    Return: 
    [rice, eggplant, cabbage]			

    """
    makeRecipeHelper(["1 bacon", "1 egg", "1 rice"])
    makeRecipeHelper(["1 bacon", "1 egg", "1 rice", "1 eggplant"])
    makeRecipeHelper(["1 bacon", "1 egg", "1 rice", "1 eggplant", "cabbage"])

    ingredientsList = ["bacon", "egg"]
    results = ingredientsSuggestions(ingredientsList)
    
    assert results == ["rice", "eggplant", "cabbage"]


def test_ingredientSuggestion_DiffMatch():
    """
    Clear all recipes

    Add recipe:
    [bacon, egg, oil, apple]		
    [bacon, egg, avocado]	
    [bacon, orange]		

    User selects:
    [bacon, egg, oil]

    Return: 
    [apple, orange, avocado]			

    """

def test_ingredientSuggestion_Alpha():
    """
    Clear all recipes

    Add recipe:
    [bacon, egg, rice, eggplant, cabbage]						
    [bacon, egg, rice, eggplant, cabbage]	
    [bacon, egg, rice, eggplant, cabbage]						

    User selects:
    [bacon, egg]

    Return: 
    [cabbage, eggplant, rice]			

    """

def test_ingredientSuggestion_DiffFrequencySameMatch():
    """
    Clear all recipes

    Add recipe:
    [bacon, cabbage]
    [bacon, eggplant]
    [bacon, eggplant]
    [bacon, rice]
    [bacon, rice]
    [bacon, rice]

    User selects:
    [bacon]

    Return: 
    [rice, eggplant, cabbage]			

    """

def test_ingredientSuggestion_SameFrequencySameMatchDiffAlpha():
    """
    Clear all recipes

    Add recipe:
    [bacon, cabbage]
    [bacon, eggplant]
    [bacon, rice]
    
    User selects:
    [bacon]

    Return: 
    [rice, eggplant, cabbage]			

    """



def test_ingredientSuggestion_FrequencyMatchAndAlpha():
    """
    Clear all recipes

    Add recipe:
    [bacon, egg, oil, avocado]			
    [egg, rice, eggplant, cabbage]			
    [bacon, egg, rice, cabbage, apple, orange]			

    User selects:
    [bacon, egg]

    Return: 
    [cabbage, rice, avocado, oil, eggplant]			

    """