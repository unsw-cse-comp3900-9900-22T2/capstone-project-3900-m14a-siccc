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
