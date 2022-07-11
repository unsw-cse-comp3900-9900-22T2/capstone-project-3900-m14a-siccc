import json
import psycopg2
from src.helper import retrieveRecipeList
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
