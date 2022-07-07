import json
from lib2to3.pytree import convert
import psycopg2
from src.helper import retrieveIngredients, retrieveRecipe, retrieveRecipeList, convertCalories, getCalories
from src.config import host, user, password, dbname


def recipeMatch(ingredientsList):
    """ Sends front end a list of recipes that satisfy the list 
        of ingredients that the user selected by alphabetically.

        Parameters:
            ingredientsList (str): list of ingredients user selected

        Return:
            recipeList (list): list of recipes id's satisfying the ingredients
    """
    # [[relevent percetage, recipe information], ...,
    # [relevent percetage, recipe information]]
    recipeList = []
    userIngrLen = len(ingredientsList)
    db = psycopg2.connect(
        f"host={host} dbname={dbname} user={user} password={password}")
    info = retrieveRecipeList(db)
    for recipe in info:
        ingredientString = recipe[8]
        ingredients = ingredientString.split(',')
        matching = 0
        for i in ingredientsList:
            for j in ingredients:
                if i in j:
                    matching += 1
                    continue
        if matching == len(ingredients):
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


def recipeDetails(recipeID):
    """ Retrieves recipe details given a recipe id

            Parameters:
                recipeID (int): recipe id as an integer

            Returns:
                recipeID (int): id of recipe
                title (str): title of recipe
                servings (int): serving size of recipe
                timeToCook (int): cooking time
                mealType (str): meal type
                photo (binary): photo of meal
                calories (int): calories of meal
                cookingSteps (str): cooking steps of recipe
                ingredients (str): ingredients of recipe
    """
    db = psycopg2.connect(
        f"host={host} dbname={dbname} user={user} password={password}")
    info = retrieveRecipe(db, recipeID)

    return {
        "recipeID": info[0],
        "title": info[7],
        "servings": info[1],
        "timeToCook": info[2],
        "mealType": info[3],
        "photo": info[4],
        "calories": info[5],
        "cookingSteps": info[6],
        "ingredients": info[8]
    }


def calorieCalculation(ingredients): #recipeID):
    """ Retrieves recipe details given ingredients (recipe id still or nah?)

            Parameters:
                ingredients (String): String containing ingredients

            Returns:
                calories (int): total calories of ingredients
    """
    # db = psycopg2.connect(
    #     f"host={host} dbname={dbname} user={user} password={password}")
    # info = retrieveRecipe(db, recipeID)
    # _, _, _, _, _, _, _, _, ingredients = info
    ingredientFixedGrams = getFixedCGrams()

    ingredientsList = ingredients.split(',')

    calories = 0
    for ingredient in ingredientsList:
        ing = ingredient.strip()
        singleIng = ing.split(' ')
        ingredientName = ' '.join(singleIng[1:])
        grams = 0
        if 'g' in singleIng[0]: # if in grams 
            grams = int(singleIng[0].rpartition('g')[0])
        else: # if in quantity 
            quantity = 0
            if singleIng[0] == 'half': 
                quantity = 0.5
            else:
                quantity = int (singleIng[0])
            
            grams = int (ingredientFixedGrams[ingredientName]) * quantity
            print(quantity)

        currCalories = getCalories(db, ingredientName)
        caloriesConverted = convertCalories(int(currCalories), grams)
        print(ingredientName, grams, int(currCalories)/100, caloriesConverted)
        
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



