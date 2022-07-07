from src.calories_recipes import getCaloriesRecipes, getCaloriesRecipesWithIngredients
import pytest


def test_simple_calories_match():
    calories = 100
    assert len(getCaloriesRecipes(calories)) == 1

def test_simple_calories_ingredients_match():
    ingredients = ['olive oil', 'bacon', 'eggs']
    calories = 100
    assert len(getCaloriesRecipesWithIngredients(calories, ingredients)) == 1
    
def test_no_calories_match():
    ingredients = ['bacon', 'eggs', 'milk']
    calories = 10
    assert len(getCaloriesRecipes(calories)) == 0

def test_no_calories_ingredients_match():
    ingredients = ['bacon', 'eggs', 'milk']
    calories = 10
    assert len(getCaloriesRecipesWithIngredients(calories, ingredients)) == 0

def test_minimal_calories_match():
    calories = 100
    assert len(getCaloriesRecipes(calories)) == 0

def test_minimal_calories_ingredients_match():
    ingredients = ['bacon']
    calories = 100
    assert len(getCaloriesRecipesWithIngredients(calories, ingredients)) == 0
    
def test_multiple_calories_match():
    calories = 10000
    assert len(getCaloriesRecipes(calories)) == 2

def test_multiple_calories_ingredients_match():
    ingredients = ['bacon', 'eggs', 'flour', 'olive oil', 'thyme', 'avocado']
    calories = 100
    assert len(getCaloriesRecipes(calories)) == 2