from src.recipe import recipeMatch
import pytest

def test_simple():
    ingredients = ['olive oil', 'bacon', 'eggs']
    assert len(recipeMatch(ingredients)) > 0
    
def test_no_match():
    ingredients = ['bacon', 'eggs', 'milk']
    assert len(recipeMatch(ingredients)) == 0
    
def test_minimal_match():
    ingredients = ['bacon']
    assert len(recipeMatch(ingredients)) > 0
    
def test_multiple_match():
    ingredients = ['bacon', 'eggs']
    assert len(recipeMatch(ingredients)) > 1