"""
A ingredients.py return all ingredients in the database. 

Team name: 3900-M14A-SICCC
Project Name: Project 1 - Recipe Recommendation System
Author: Cameron Khuu, Carla Phan, Christopher Tsang, Sylvia Huang, Xin Tian Luo
Date: 31/July/2022
"""
from src.ingredients_category import sortingCategories, sortingIngredients
from src.helper import retrieveIngredientNames, dbConnection


def IngredientsViewAll():
    """View all ingredients from database and sort it by alphabetical. 

        Returns:
            ingredients (list): list of ingredient strings
    """
    db = dbConnection()
    info = retrieveIngredientNames(db)
    list = []
    for ingredient in info: 
        list.append(ingredient[0])
    return sorted(list)


def CategoryViewAll():
    """ View all ingredients by categories.

            Returns:
                ingredients (list): list of dictionary key-value pairs 
                        e.g., {ingredient: ___, category: ___}
    """
    ListCategories = sortingCategories()
    IngredientsListOfDictionaries = []
    for category in ListCategories: 
        Ingredients = sortingIngredients(category)
        for ingredient in Ingredients: 
            DictPair = {"Ingredient": ingredient, "Category": category}
            IngredientsListOfDictionaries.append(DictPair)
    return IngredientsListOfDictionaries 
