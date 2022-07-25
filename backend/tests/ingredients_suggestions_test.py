#from backend.src.helper import retrieveRecipeList
import psycopg2
#from backend.src.helper import retrieveRecipeList
from src.recipe import ingredientsSuggestions
from src.recipeContributor import insertRecipe
from src.config import host, user, password, dbname
import pytest

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
    ingredientsList = ["bacon", "egg"]
    results = ingredientsSuggestions(ingredientsList)
    answer = ["avocado", "bread", "flour", "beef", "olive oil"]
    assert results == answer