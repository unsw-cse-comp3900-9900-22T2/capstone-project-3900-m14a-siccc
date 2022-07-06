import json
from lib2to3.pytree import convert
import psycopg2
from src.helper import retrieveIngredientNames, retrieveRecipe, retrieveRecipeList, convertCalories, getCalories

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
    db = psycopg2.connect("host=ec2-34-239-241-121.compute-1.amazonaws.com dbname=dbqkcfh5i7ab0f user=fywiddopknmklg password=a6facfdde8aa1a8ad6a8f549aa7169e811e69a1b01ff042836161893b2fd5abc")
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
    db = psycopg2.connect("host=ec2-34-239-241-121.compute-1.amazonaws.com dbname=dbqkcfh5i7ab0f user=fywiddopknmklg password=a6facfdde8aa1a8ad6a8f549aa7169e811e69a1b01ff042836161893b2fd5abc")
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

def calorieCalculation(ingredients):
    """ Retrieves recipe details given a recipe id
    
            Parameters:
                ingredients (String): String containing ingredients
                
            Returns:
                calories (int): total calories of ingredients
    """
    db = psycopg2.connect("host=ec2-34-239-241-121.compute-1.amazonaws.com dbname=dbqkcfh5i7ab0f user=fywiddopknmklg password=a6facfdde8aa1a8ad6a8f549aa7169e811e69a1b01ff042836161893b2fd5abc")
    # info = retrieveRecipe(db, recipeID)
    # _, _, _, _, _, _, _, _, ingredients = info
    ingredientsList = ingredients.split(',')
    
    calories = 0
    for ingredient in ingredientsList:
        ing = ingredient.strip()
        singleIng = ing.split(' ')
        grams = singleIng[0].rpartition('g')[0]
        ingredientName = ' '.join(singleIng[1:])
        if grams == '':
            pass
        else:
            currCalories = getCalories(db, ingredientName)
            caloriesConverted = convertCalories(int(currCalories), int(grams))
            calories += caloriesConverted
    
    print(calories)
    return calories