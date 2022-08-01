"""
A mealType.py can return the recipes which are selected the meal type by the
 user.

Team name: 3900-M14A-SICCC
Project Name: Project 1 - Recipe Recommendation System
Author: Cameron Khuu, Carla Phan, Christopher Tsang, Sylvia Huang, Xin Tian Luo
Date: 31/July/2022
"""
from src.helper import dbConnection, retrieveRecipeList
from src.recipe import getFilteredRecipes, recipeMatch


def getMealType(meal, ingredientsList, blacklist):
    """ Select the meal type after the recipe match. 

        User input (meal, ingredientsList, blacklist):
        Note: blacklist is alwasy assumed as an empty list if user did not
              select any ingredients into the blacklist.
        1. If user only input "meal-type", the user can get the recipes with 
           selecting meal-type. The "ingrdientsList" and "blacklist" are an 
           empty string and an empty list, respectively.
        2. If user input "ingredientsList", whatever the user input the 
           "blacklist" or not, the user can get the recipes with selecting 
           ingreidents. This would be as same as "recipeMatch" function. 
        3. If user input input "meal-type", "ingredientsList" and "blacklist",
           the recipes would be filtered by "recipeMatch" function with 
           the "ingredientsList" and the "blacklist".

        Algorithm: linear search. 
        
        The time complexity of "if" statement is O(1) and the time complexity
        of "for" loop is O(n). Thus, O(1+n) = O(n).

        Final Time Complexisty: O(n)

        Parameters:
            meal (str): the name of meal type
            ingredientsList (str): the string of ingredientsList
            blacklist (list): the blacklist of ingredients
        
        Returns:
            recipleTypeList (list): list of all recipes ingredients
    """
    if len(ingredientsList) <= 0 or ingredientsList == "" \
        or ingredientsList is None:
        info= retrieveRecipeList(dbConnection())
        if blacklist != [] or len(blacklist) <= 0:
            info = getFilteredRecipes(info, blacklist) 
        recipeList = []   
        for recipe in info:
            ingDict = {
                    "recipeID": recipe[0],
                    "title": recipe[7],
                    "servings": recipe[1],
                    "timeToCook": recipe[2],
                    "mealType": recipe[3],
                    "photo": recipe[4],
                    "calories": recipe[5],
                    "cookingSteps": recipe[6],
                    "ingredients": recipe[8],
                    "missingIngredient": "",
                    "partialMatch": "",
            }
            recipeList.append(ingDict)
    else:
        recipeList = recipeMatch(ingredientsList, blacklist)
    recipeTypeList = []
    for recipe in recipeList:
        if meal is None or len(meal) == 0 or meal == "":
            recipeTypeList.append(recipe)
        elif recipe["mealType"] == meal:
            recipeTypeList.append(recipe)
    return recipeTypeList
