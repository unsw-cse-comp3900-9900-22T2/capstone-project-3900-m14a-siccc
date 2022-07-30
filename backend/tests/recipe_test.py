from backend.src.helper import retrieveRecipeList
from src.recipe import recipeDetails, recipeMatch
import pytest

def test_simple_match():
    ingredients = ['olive oil', 'bacon', 'eggs']
    assert len(recipeMatch(ingredients)) == 1
    
def test_no_match():
    ingredients = ['bacon', 'eggs', 'milk']
    assert len(recipeMatch(ingredients)) == 0
    
def test_minimal_match():
    ingredients = ['bacon']
    assert len(recipeMatch(ingredients)) == 0
    
def test_multiple_match():
    ingredients = ['bacon', 'eggs', 'cinnamon', 'flour', 'olive oil']
    assert len(recipeMatch(ingredients)) == 2

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
        'ingredients': '3g olive oil, 100g bacon, 2 eggs'
    }
    assert recipeDetails(1) == info
