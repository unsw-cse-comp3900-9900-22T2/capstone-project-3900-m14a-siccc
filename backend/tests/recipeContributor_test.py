from numpy import insert
from src.recipeContributor import insertRecipe, getNoRecipeMatchList
from src.recipe import recipeDetails
import pytest

def test_frequency():
    ingredients = 'thyme, eggs'
    noMatch = getNoRecipeMatchList()
    assert noMatch[0] == ingredients