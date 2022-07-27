from src.recipe import getFilteredRecipes, recipeMatch


def getMealType(meal, ingredientsList, blacklist):
    """ Select the meal type after the recipe match. 

            Parameters:
                meal: the name of meal type
                ingredientsList: the list of ingredientsList
        
            Returns:
                recipleTypeList: list of all recipes ingredients
    """
    recipeList = recipeMatch(ingredientsList, blacklist)

    recipeTypeList = []

    for recipe in recipeList:
        if recipe["mealType"] == meal:
            recipeTypeList.append(recipe)

    return recipeTypeList



