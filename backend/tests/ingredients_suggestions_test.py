import psycopg2
from src.recipe import ingredientsSuggestions
import pytest


def simple_ingredientsSuggestions_test_noIngredientSelected():
    """
        No any suggestions if user did not select anything.
    """
    ingredientsList = []
    results = ingredientsSuggestions(ingredientsList)
    assert len(results) == 0


def test_ingredientSuggestion_SelectThreeIngredients_noSuggestions():
    ingredientsList = ["olive oil", "flour", "broccoli"]
    results = ingredientsSuggestions(ingredientsList)
    assert len(results) == 0


def test_ingredientSuggestion_SelectOneIngredient_FourSuggestions():
    ingredientsList = ["thyme"]
    results = ingredientsSuggestions(ingredientsList)
    answer = ['avocado', 'bacon', 'egg', 'flour']
    assert len(results) == len(answer)
    match = 0
    for i in range(len(answer)):
        if results[i] != answer[i]:
            break
        match += 1
    assert len(results) == match


def test_ingredientSuggestion_SelectOneIngredient_FiveSuggestions():
    """             freq	
        olive oil 	2	    
        egg         8       
        flour 	    1	    
        thyme 	    1	    
        avo	        4	    
        beef        3          
    """
    ingredientsList = ["bacon"]
    results = ingredientsSuggestions(ingredientsList)
    answer = ["egg", "avocado", "beef", "olive oil", "flour"]
    assert len(answer) == len(results)
    match = 0
    for i in range(len(answer)):
        if results[i] != answer[i]:
            break
        match += 1
    assert len(results) == match


def test_ingredientSuggestion_SelecttwoIngredients_fourSuggestions():
    """             freq	
        olive oil 	2	    
        flour 	    1	    
        thyme 	    1	    
        avo	        1	        
    """
    ingredientsList = ["bacon", "egg"]
    results = ingredientsSuggestions(ingredientsList)
    answer = ["olive oil", "avocado", "flour", "thyme"]
    assert len(results) == len(answer)
    match = 0
    for i in range(len(results)):
        if results[i] != results[i]:
            break
        match += 1
    assert match == len(results)
    

def test_ingredientSuggestion_threeIngredients_twoSuggestions():
    ingredientsList = ["milk", "turkey", "cheese"]
    results = ingredientsSuggestions(ingredientsList)
    answer = ["spinach"]
    assert len(results) == len(answer)
    match = 0
    for i in range(len(results)):
        if results[i] != results[i]:
            break
        match += 1
    assert match == len(results)


def test_ingredientSuggestion_fiveIngredients_noSuggestions():
    ingredientsList = ["bacon", "egg", "flour", "olive oil", "duck"]
    results = ingredientsSuggestions(ingredientsList)
    assert len(results) == 0