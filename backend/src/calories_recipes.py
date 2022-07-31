"""
A calories_recipes.py can get the recipes by calories and can calculate the 
total calories per recipe. 

If user input calories, ingredients, meal type and blacklist, the user can 
get the recipes as well.

If user wants to know the total calories, the user also can search it.

Team name: 3900-M14A-SICCC
Project Name: Project 1 - Recipe Recommendation System
Author: Cameron Khuu, Carla Phan, Christopher Tsang, Sylvia Huang, Xin Tian Luo
Date: 31/July/2022
"""
from src.mealType import getMealType
from src.helper import retrieveIngredients, getCalories
from src.helper import convertCalories, dbConnection


def getCaloriesRecipes(calories, ingredientsList, mealType, blacklist):
    """ Input the number of calories, ingtredients and meal type, so that 
        return the recipes if the calories of this recipe is less than or 
        equal to the input calories, meal type and the ingredients are 
        also matching.

        Algorithm: linear search. 
        
        The time complexity of "getMealType" is O(n). There is one "for" loop,
        and one "if" statement under this "for" loop. Thus, O(1+n) = O(n).

        Final Time Complexisty: O(n)

            Parameters:
                calories (int): input calories
                ingredientsList (str) : input ingredients
                mealType (str) : meal type
                blackList (list) : list of black ingredients
        
            Returns:
                recipeList (list): list of all recipes if the recipes are 
                matching the requirements
    """
    recipeList = []
    info = getMealType(mealType, ingredientsList, blacklist)
    for recipe in info:
        if int(recipe["calories"]) <= int(calories):
            recipeList.append(recipe)

    return recipeList


def calorieCalculation(ingredientsDict):
    """ Retrieves recipe details given ingredients. 

        Algorithm: linear search. 
        
        The time complexity of "for" loop is O(n). The time complexity of 
        the "getFixedGrams" and "getCalories" are both O(n). The time 
        complexity of s"convertCalories" is O(1). Thus, the time complexity
        should be O(n*n+n*1) = O(n^2).

        Final Time Complexisty: O(n^2).

            Parameters:
                ingredients (Dictionary): Dictionary containing ingredients 
                e.g., {ingredientName: amount}

            Returns:
                calories (int): total calories of ingredients
    """
    db = dbConnection()
    ingredientFixedGrams = getFixedCGrams()
    calories = 0
    for ingredientName, amount in ingredientsDict.items():
        grams = 0
        if isinstance(amount, str): 
            if 'g' in amount:  
                grams = int(amount.rpartition('g')[0])
        else:  
            quantity = 0
            if amount == 'half':
                quantity = 0.5
            else:
                quantity = int(amount)

            grams = int(ingredientFixedGrams[ingredientName]) * quantity

        currCalories = getCalories(db, ingredientName)
        caloriesConverted = convertCalories(int(currCalories), grams)
        calories += caloriesConverted

    return int(calories)


def getFixedCGrams():
    """ Helper function to get fixed grams for all ingredients.

        Algorithm: linear search. 
        
        The time complexity of "for" loop is O(n). The time complexity of
        retrieveIngredients is O(n).

        Final Time Complexisty: O(n)

            Returns:
                (dictionary): dictionary of key-value pairs, 
                              ingredient(string): fixed_grams(int)
    """
    db = dbConnection()
    info = retrieveIngredients(db)
    dict = {}
    for ingredient in info:
        dict[ingredient[0]] = ingredient[3]
    return dict
