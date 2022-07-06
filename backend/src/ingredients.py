import json
import psycopg2
from src.ingredients_category import sortingCategories, sortingIngredients
from src.helper import retrieveIngredientNames, retrieveRecipe, retrieveRecipeList
from src.config import host, user, password, dbname

def IngredientsViewAll():
    """
    View all ingredients 

            Parameters:
                None?

            Returns:
                ingredients (list): list of ingredient strings
    """
    #OLD VERSION / BEFORE 
    db = psycopg2.connect(f"host={host} dbname={dbname} user={user} password={password}")
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
    #db = psycopg2.connect("host=ec2-34-239-241-121.compute-1.amazonaws.com dbname=dbqkcfh5i7ab0f user=fywiddopknmklg password=a6facfdde8aa1a8ad6a8f549aa7169e811e69a1b01ff042836161893b2fd5abc")
    ListCategories = sortingCategories()
    IngredientsListOfDictionaries = []
    for category in ListCategories: 
        Ingredients = sortingIngredients(category)
        for ingredient in Ingredients: 
            DictPair = {"Ingredient": ingredient, "Category": category}
            IngredientsListOfDictionaries.append(DictPair)
    return IngredientsListOfDictionaries 
