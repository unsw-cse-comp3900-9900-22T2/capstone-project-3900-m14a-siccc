from src.calories_recipes import getCaloriesRecipes, getCaloriesRecipesWithIngredients
import pytest


def test_simple_calories_match():
    calories = 360
    assert len(getCaloriesRecipes(calories)) == 3

def test_simple_calories_ingredients_match():
    ingredients = ['olive oil', 'bacon', 'egg']
    calories = 700
    assert len(getCaloriesRecipesWithIngredients(calories, ingredients)) == 1
    
def test_no_calories_match():
    calories = 10
    assert len(getCaloriesRecipes(calories)) == 0

def test_no_calories_ingredients_match():
    ingredients = ['bacon', 'egg', 'milk']
    calories = 10
    assert len(getCaloriesRecipesWithIngredients(calories, ingredients)) == 0

def test_minimal_calories_match():
    calories = 99
    assert len(getCaloriesRecipes(calories)) == 0

def test_minimal_calories_ingredients_match():
    ingredients = ['bacon']
    calories = 99
    assert len(getCaloriesRecipesWithIngredients(calories, ingredients)) == 0
    
def test_multiple_calories_match():
    calories = 10000
    assert len(getCaloriesRecipes(calories)) == 8

def test_multiple_calories_ingredients_match():
    ingredients = ['bacon', 'egg', 'flour', 'olive oil', 'thyme', 'avocado']
    calories = 10000
    assert len(getCaloriesRecipesWithIngredients(calories, ingredients)) == 2