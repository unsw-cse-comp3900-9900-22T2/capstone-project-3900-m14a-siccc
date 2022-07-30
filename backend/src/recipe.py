import json
from lib2to3.pytree import convert
import psycopg2
from src.helper import dbConnection, retrieveRecipe, retrieveRecipeList
from src.config import host, user, password, dbname

def recipeMatch(ingredientsList, blacklist):
    """ Sends front end a list of recipes that satisfy the list 
        of ingredients that the user selected by alphabetically.

        Parameters:
            ingredientsList (str): list of ingredients user selected
            blacklist (list): list of blacklisted ingredients

        Return:
            recipeList (list): list of recipes id's satisfying the ingredients
    """
    recipeList = []
    db = dbConnection()
    info = retrieveRecipeList(db)
    if blacklist != []:
        info = getFilteredRecipes(info, blacklist)
    for recipe in info:
        ingredientString = recipe[8]
        ingredients = ingredientString.split(', ')
        missingIngList = ingredients.copy()
        matching = 0
        for i in ingredientsList:
            for j in ingredients:
                if i in j:
                    matching += 1
                    missingIngList.remove(j)
        if matching == len(ingredients) or matching == len(ingredients) - 1:
            missingIng = ''
            partialMatch = False
            if matching == len(ingredients) - 1:
                ing = missingIngList.pop()
                ing = ing.split(' ')
                ing.pop(0)
                missingIng = " ".join(ing)
                partialMatch = True
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
                    "missingIngredient": missingIng,
                    "partialMatch": partialMatch,
            }
            recipeList.append(ingDict)

    return recipeList


def getFilteredRecipes(recipes, blacklist):
    """ Helper function for recipeMatch.

        Parameters: 
            recipes (list): list of all existing recipes 
            blacklist (list): list of blacklisted ingredients user selected
    
        Return:
            recipeList (list): list of recipes without ingredients from 
                        blacklist
"""
    filteredRecipeList = []
    for recipe in recipes:
        ingredientString = recipe[8]
        ingredients = ingredientString.split(',')
        if RecipeHasBlacklist(ingredients, blacklist) is False:
            filteredRecipeList.append(recipe)
    return filteredRecipeList


def RecipeHasBlacklist(recipe, blacklist):
    """Helper function for getFilteredRecipes.

        Parameters:
            recipe(list): list of ingredients in recipe 
            blacklist (list): list of blacklisted ingredients user selected
    
        Return:
            recipeList (boolean): true if recipe contains any blacklisted 
                    ingredient, false otherwise 
    """
    for ingredient in recipe:
        for unwanted in blacklist:
            if unwanted in ingredient:
                return True
    return False


def recipeDetails(recipeID):
    """ Retrieves recipe details given a recipe id.

            Parameters:
                recipeID (int): recipe id as an integer

            Returns:
                dict {
                    recipeID (int): id of recipe
                    title (str): title of recipe
                    servings (int): serving size of recipe
                    timeToCook (int): cooking time
                    mealType (str): meal type
                    photo (binary): photo of meal
                    calories (int): calories of meal
                    cookingSteps (str): cooking steps of recipe
                    ingredients (str): ingredients of recipe
                }
    """
    db = dbConnection()
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



def ingredientsSuggestions(ingredientsList):
    """ Sends front end a list of ingredients that satisfy the list 
        of ingredients that the user selected by top five ingredients
        in specific conditions. If the user did not select any ingredients,
        the system will not return any ingredients.

        1. The most frequency ingredients in all recipes which do not include
           the ingredients in the user's selection ingredients list.
        2. If the previous condition is matched and get the same frequency for
           some ingredients, the ingredients will be ordered by alphabetical. 

        Parameters:
            ingredientsList (str): list of ingredients user selected

        Return:
            getIngredientsSuggestions (list): list of ingredients are 
                            satisfying the ingredients from the 
                            getIngredientsSuggestions function
    """
    num_select = len(ingredientsList)
    if num_select < 1:
        return []
    db = dbConnection()
    info = retrieveRecipeList(db)
    igds_frequency = {}
    for recipe in info:
        ingredients = [" ".join(i.split(' ')[1:]) for i in recipe[8].split(', ')]
        match = 0
        missing_igds = []
        for igd in ingredients:
            if igd in ingredientsList:
                match += 1
            else:
                missing_igds.append(igd)
        if match == num_select:
            for miss in missing_igds:
                if len(igds_frequency) > 0 and igds_frequency.get(miss) is not None:
                        igds_frequency[miss] = igds_frequency[miss] + 1
                else:
                    igds_frequency[miss] = 1

    igds_frequency_sort = sorted(igds_frequency.items(), 
                        key=lambda kv: kv[1], reverse=True)
    return getIngredientsSuggestions(igds_frequency_sort, len(info))


def getIngredientsSuggestions(igds_frequency_sort, pre_frequency):
    """Helper function for ingredientsSuggestions. To select the top 5 
       ingredients and return to the frontend.

        Parameters:
            igds_frequency_sort (list): list of suggestion ingredients
            pre_frequency (int): the maximum number of frequency
        
        Return:
            igds_suggestions (list): list of top 5 suggestion ingreidents
    """
    igdsSuggestions = []
    tmp_igds = []  
    for igds, fqy in igds_frequency_sort:
        if len(igdsSuggestions) >= 5:
            break
        if len(tmp_igds) == 0:
            tmp_igds.append(igds)
            pre_frequency = fqy 
        else:
            if pre_frequency == fqy:
                tmp_igds.append(igds)
            else:
                tmp_igds_sort = sorted(tmp_igds)
                for item in tmp_igds_sort:
                    if len(igdsSuggestions) < 5:
                        igdsSuggestions.append(item)
                    else:
                        break
                tmp_igds = [igds]
                pre_frequency = fqy
    
    if len(igdsSuggestions) < 5:
        tmp_igds_sort = sorted(tmp_igds)
        igdsSuggestions = igdsSuggestions + tmp_igds_sort[:5-len(igdsSuggestions)]
    
    return igdsSuggestions