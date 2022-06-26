import json
import psycopg2
from src.ingredients_category import sortingCategories, sortingIngredients
from src.helper import retrieveIngredientNames, retrieveRecipe, retrieveRecipeList

def IngredientsViewAll():
    #OLD VERSION / BEFORE 
    db = psycopg2.connect("host=database-1.c0xbbloavtwb.ap-southeast-2.rds.amazonaws.com dbname=comp3900db user=postgres password=hello123")
    info = retrieveIngredientNames(db)
    list = []
    for ingredient in info: 
        list.append(ingredient[0])
    return sorted(list)

def CategoryViewAll():
    """ View all ingredients by categories

            Parameters:
                None?

            Returns:
                ingredients (list): list of dictionary key-value pairs {ingredient: ___, category: ___}
    """
    #db = psycopg2.connect("host=database-1.c0xbbloavtwb.ap-southeast-2.rds.amazonaws.com dbname=comp3900db user=postgres password=hello123")
    ListCategories = sortingCategories()
    IngredientsListOfDictionaries = []
    for category in ListCategories: 
        Ingredients = sortingIngredients(category)
        for ingredient in Ingredients: 
            DictPair = {"Ingredient": ingredient, "Category": category}
            IngredientsListOfDictionaries.append(DictPair)
    return IngredientsListOfDictionaries 
