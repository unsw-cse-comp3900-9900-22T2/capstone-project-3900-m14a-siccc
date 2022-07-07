#from src.mealType import getMealType
from src.mealType import getMealType
import pytest

def test_simple_match():
    ingredients = ['olive oil', 'bacon', 'eggs']
    meal= "breakfast"
    assert len(getMealType(meal, ingredients)) == 1
    
def test_no_match():
    ingredients = ['bacon', 'eggs', 'milk']
    meal= "breakfast"
    assert len(getMealType(meal, ingredients)) == 0
    
def test_minimal_match():
    ingredients = ['bacon']
    meal= "breakfast"
    assert len(getMealType(meal, ingredients)) == 0
    
def test_multiple_match():
    ingredients = ['bacon', 'eggs', 'flour', 'olive oil', 'thyme', 'avocado']
    meal= "breakfast"
    assert len(getMealType(meal, ingredients)) == 2

"""
def test_details():
    info = {
        'recipeID': 1,
        'title': 'bacon and eggs',
        'servings': 2,
        'timeToCook': 30,
        'mealType': 'breakfast',
        'photo': None,
        'calories': 723,
        'cookingSteps':'Step 1: Heat a frying pan over medium heat. Once hot pour the olive oil into the pan.\nStep 2: Place the bacon and eggs onto the frying pan\nStep 3: Cook the bacon and eggs until satisfied.',
        'ingredients': '3g olive oil, 100g of bacon, 2 eggs'
    }
    meal= "breakfast"
    assert getMealType(1) == info

"""