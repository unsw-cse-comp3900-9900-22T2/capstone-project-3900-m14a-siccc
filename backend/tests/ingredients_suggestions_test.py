from backend.src.helper import retrieveRecipeList
from src.recipe import ingredientsSuggestions
import pytest

def simple_ingredientsSuggestions_test():
    ingredientsList = []
    results = ingredientsSuggestions(ingredientsList)
    answer = []
    match = True
    for i in range(len(answer)):
        if answer[i] != results[i]:
            match = False
    assert match is True


