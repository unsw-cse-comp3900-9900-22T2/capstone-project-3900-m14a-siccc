import psycopg2
from src.recipe import ingredientsSuggestions
import pytest


def test_ingredientsSuggestions_noIngredientBlacklistSelected():
    """
        No any suggestions if user did not select anything.
    """
    ingredientsList = []
    results = ingredientsSuggestions(ingredientsList, [])
    assert len(results) == 0


def test_ingredientsSuggestions_noIngredientSelected_oneBlacklistSelected():
    """
        No any suggestions if user did not select anything.
    """
    ingredientsList = []
    results = ingredientsSuggestions(ingredientsList, ["bacon"])
    assert len(results) == 0


def test_ingredientSuggestion_ThreeIngredients_noSuggestions():
    ingredientsList = ["olive oil", "flour", "broccoli"]
    results = ingredientsSuggestions(ingredientsList, [])
    assert len(results) == 0


def test_ingredientSuggestion_ThreeIngredients_ThreeBlacklists_noSuggestions():
    ingredientsList = ["olive oil", "flour", "broccoli"]
    results = ingredientsSuggestions(ingredientsList, ["egg", "avocado", "flour"])
    assert len(results) == 0


def test_ingredientSuggestion_OneIngredient_noBlacklist_FourSuggestions():
    ingredientsList = ["thyme"]
    results = ingredientsSuggestions(ingredientsList, [])
    answer = ['avocado', 'bacon', 'egg', 'flour']
    assert len(results) == len(answer)
    match = 0
    for i in range(len(answer)):
        if results[i] != answer[i]:
            break
        match += 1
    assert len(results) == match


def test_ingredientSuggestion_OneIngredient_OneBlacklist_noSuggestions():
    ingredientsList = ["thyme"]
    results = ingredientsSuggestions(ingredientsList, ['avocado'])
    assert len(results) == 0


def test_ingredientSuggestion_OneIngredient_OneBlacklist_FourSuggestions():
    ingredientsList = ["thyme"]
    results = ingredientsSuggestions(ingredientsList, ["milk"])
    answer = ['avocado', 'bacon', 'egg', 'flour']
    assert len(results) == len(answer)
    match = 0
    for i in range(len(answer)):
        if results[i] != answer[i]:
            break
        match += 1
    assert len(results) == match


def test_ingredientSuggestion_OneIngredient_TwoBlacklist_FourSuggestions():
    ingredientsList = ["thyme"]
    results = ingredientsSuggestions(ingredientsList, ["milk", "olive oil"])
    answer = ['avocado', 'bacon', 'egg', 'flour']
    assert len(results) == len(answer)
    match = 0
    for i in range(len(answer)):
        if results[i] != answer[i]:
            break
        match += 1
    assert len(results) == match


def test_ingredientSuggestion_OneIngredient_noBlacklist_FiveSuggestions():
    """             freq	
        olive oil 	2	    
        egg         8       
        flour 	    1	    
        thyme 	    1	    
        avo	        4	    
        beef        3          
    """
    ingredientsList = ["bacon"]
    results = ingredientsSuggestions(ingredientsList, [])
    answer = ["egg", "avocado", "beef", "olive oil", "flour"]
    assert len(answer) == len(results)
    match = 0
    for i in range(len(answer)):
        if results[i] != answer[i]:
            break
        match += 1
    assert len(results) == match


def test_ingredientSuggestion_OneIngredient_OneBlacklist_FiveSuggestions():
    """             freq	
        olive oil 	2	    
        egg         8       
        flour 	    1	    
        thyme 	    1	    
        avo	        4	    
        beef        3          
    """
    ingredientsList = ["bacon"]
    results = ingredientsSuggestions(ingredientsList, ["broccoli"])
    answer = ["egg", "avocado", "beef", "olive oil", "flour"]
    assert len(answer) == len(results)
    match = 0
    for i in range(len(answer)):
        if results[i] != answer[i]:
            break
        match += 1
    assert len(results) == match


def test_ingredientSuggestion_OneIngredient_OneBlacklist_twoSuggestions():
    """             freq	   
        avo	        3	    
        beef        3          
    """
    ingredientsList = ["bacon"]
    results = ingredientsSuggestions(ingredientsList, ["egg"])
    answer = ["avocado", "beef"]
    assert len(answer) == len(results)
    match = 0
    for i in range(len(answer)):
        if results[i] != answer[i]:
            break
        match += 1
    assert len(results) == match


def test_ingredientSuggestion_OneIngredient_TwoBlacklist_noSuggestion():
    """             freq	   
        avo	        3	    
        beef        3          
    """
    ingredientsList = ["bacon"]
    results = ingredientsSuggestions(ingredientsList, ["egg", "beef"])
    assert len(results) == 0


def test_ingredientSuggestion_twoIngredients_noBlacklist_fourSuggestions():
    """             freq	
        olive oil 	2	    
        flour 	    1	    
        thyme 	    1	    
        avo	        1	        
    """
    ingredientsList = ["bacon", "egg"]
    results = ingredientsSuggestions(ingredientsList, [])
    answer = ["olive oil", "avocado", "flour", "thyme"]
    assert len(results) == len(answer)
    match = 0
    for i in range(len(results)):
        if results[i] != results[i]:
            break
        match += 1
    assert match == len(results)
    

def test_ingredientSuggestion_twoIngredients_oneBlacklist_fourSuggestions():
    """             freq	
        olive oil 	2	    
        flour 	    1	    
        thyme 	    1	    
        avo	        1	        
    """
    ingredientsList = ["bacon", "egg"]
    results = ingredientsSuggestions(ingredientsList, ["beef"])
    answer = ["olive oil", "avocado", "flour", "thyme"]
    assert len(results) == len(answer)
    match = 0
    for i in range(len(results)):
        if results[i] != results[i]:
            break
        match += 1
    assert match == len(results)


def test_ingredientSuggestion_twoIngredients_oneBlacklist_oneSuggestion():
    """             freq	
        olive oil 	1	        
    """
    ingredientsList = ["bacon", "egg"]
    results = ingredientsSuggestions(ingredientsList, ["avocado"])
    answer = ["olive oil"]
    assert len(results) == len(answer)
    match = 0
    for i in range(len(results)):
        if results[i] != results[i]:
            break
        match += 1
    assert match == len(results)


def test_ingredientSuggestion_twoIngredients_oneBlacklist_threeSuggestions():
    """             freq	    
        flour 	    1	    
        thyme 	    1	    
        avo	        1	        
    """
    ingredientsList = ["bacon", "egg"]
    results = ingredientsSuggestions(ingredientsList, ["olive oil"])
    answer = ["avocado", "flour", "thyme"]
    assert len(results) == len(answer)
    match = 0
    for i in range(len(results)):
        if results[i] != results[i]:
            break
        match += 1
    assert match == len(results)


def test_ingredientSuggestion_twoIngredients_twoBlacklist_noSuggestion():
    """             freq	
        olive oil 	2	    
        flour 	    1	    
        thyme 	    1	    
        avo	        1	        
    """
    ingredientsList = ["bacon", "egg"]
    results = ingredientsSuggestions(ingredientsList, ["olive oil", "avocado"])
    assert len(results) == 0


def test_ingredientSuggestion_threeIngredients_noBlacklist_oneSuggestion():
    ingredientsList = ["milk", "turkey", "cheese"]
    results = ingredientsSuggestions(ingredientsList, [])
    answer = ["spinach"]
    assert len(results) == len(answer)
    match = 0
    for i in range(len(results)):
        if results[i] != results[i]:
            break
        match += 1
    assert match == len(results)


def test_ingredientSuggestion_threeIngredients_oneBlacklist_oneSuggestion():
    ingredientsList = ["milk", "turkey", "cheese"]
    results = ingredientsSuggestions(ingredientsList, ["beef"])
    answer = ["spinach"]
    assert len(results) == len(answer)
    match = 0
    for i in range(len(results)):
        if results[i] != results[i]:
            break
        match += 1
    assert match == len(results)


def test_ingredientSuggestion_threeIngredients_oneBlacklist_noSuggestions():
    ingredientsList = ["milk", "turkey", "cheese"]
    results = ingredientsSuggestions(ingredientsList, ["spinach"])
    assert 0 == len(results)


def test_ingredientSuggestion_fiveIngredients_noBlacklist_noSuggestions():
    ingredientsList = ["bacon", "egg", "flour", "olive oil", "duck"]
    results = ingredientsSuggestions(ingredientsList, [])
    assert len(results) == 0


def test_ingredientSuggestion_fiveIngredients_oneBlacklist_noSuggestions():
    ingredientsList = ["bacon", "egg", "flour", "olive oil", "duck"]
    results = ingredientsSuggestions(ingredientsList, ["milk"])
    assert len(results) == 0