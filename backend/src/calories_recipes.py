import json
import psycopg2
from src.helper import retrieveRecipeList, retrieveIngredients, getCalories, convertCalories
from src.recipe import recipeMatch
from src.config import host, user, password, dbname

def getCaloriesRecipes(calories):
    """ Input the number of calories and return the recipes if the 
        calories of this recipe is less than or equal to the input calories.

            Parameters:
                calories: input calories
        
            Returns:
                recipeList: list of all recipes which are less than or equal to the input calories
    """
    
    recipeList = []
    db = psycopg2.connect(f"host={host} dbname={dbname} user={user} password={password}")
    info = retrieveRecipeList(db)
    for recipe in info:
        if recipe[5] <= calories:
            ingDict = {
                "recipeID": recipe[0],
                "title": recipe[7],
                "servings": recipe[1],
                "timeToCook": recipe[2],
                "mealType": recipe[3],
                "photo": recipe[4],
                "calories": recipe[5],
                "cookingSteps": recipe[6],
                "ingredients": recipe[8]
            }
            recipeList.append(ingDict)
            
    return recipeList



def getCaloriesRecipesWithIngredients(calories, ingredientsList):
    """ Input the number of calories and ingtredients, so that return the recipes 
        if the calories of this recipe is less than or equal to the input calories
         and the ingredients are also matching.

            Parameters:
                calories: input calories
                ingredientsList: input ingredients
        
            Returns:
                recipeList: list of all recipes if the recipes are matching the requirements
    """
    recipeList = []
    info = recipeMatch(ingredientsList)
    for recipe in info:
        if recipe["calories"] <= calories:
            recipeList.append(recipe)

    return recipeList

def calorieCalculation(ingredientsDict):
    """ Retrieves recipe details given ingredients (recipe id still or nah?)

            Parameters:
                ingredients (Dictionary): Dictionary containing ingredients {ingredientName: amount}

            Returns:
                calories (int): total calories of ingredients
    """
    db = psycopg2.connect(
        f"host={host} dbname={dbname} user={user} password={password}")
    # info = retrieveRecipe(db, recipeID)
    # _, _, _, _, _, _, _, _, ingredients = info
    ingredientFixedGrams = getFixedCGrams()

    calories = 0
    for ingredientName, amount in ingredientsDict.items():
        grams = 0
        if 'g' in amount:  # if in grams
            grams = int(amount.rpartition('g')[0])
        else:  # if in quantity
            quantity = 0
            if amount == 'half':
                quantity = 0.5
            else:
                quantity = int(amount)

            grams = int(ingredientFixedGrams[ingredientName]) * quantity
            # print(quantity)

        currCalories = getCalories(db, ingredientName)
        caloriesConverted = convertCalories(int(currCalories), grams)
        # print(ingredientName, grams, int(currCalories)/100, caloriesConverted)

        calories += caloriesConverted

    return int(calories)

def getFixedCGrams():
    """ Helper function to get fixed grams for all ingredients

            Parameters:
                None

            Returns:
                (dictionary): dictionary of key-value pairs, ingredient(string): fixed_grams(int)
    """
    db = psycopg2.connect(
        f"host={host} dbname={dbname} user={user} password={password}")
    info = retrieveIngredients(db)
    dict = {}
    for ingredient in info:
        dict[ingredient[0]] = ingredient[3]
    return dict
