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

    """
    ingredientsList = ["bacon", "egg"]
    results = ingredientsSuggestions(ingredientsList)
    answer = ["olive oil", "flour", "thyme", "avocado"]
    assert results == answer