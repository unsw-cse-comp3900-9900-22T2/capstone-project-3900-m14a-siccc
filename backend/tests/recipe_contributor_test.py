from src.recipeContributor import getNoRecipeMatchList
import pytest

def test_frequency():
    ingredients = ['thyme', 'eggs']
    noMatch = getNoRecipeMatchList()
    assert noMatch[0] == ingredients