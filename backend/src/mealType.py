from src.helper import dbConnection, retrieveRecipeList
from src.recipe import getFilteredRecipes, recipeMatch


def getMealType(meal, ingredientsList, blacklist):
    """ Select the meal type after the recipe match. 

            Parameters:
                meal (str): the name of meal type
                ingredientsList (str): the string of ingredientsList
                blackist (list): the blacklist of ingredients
        
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
