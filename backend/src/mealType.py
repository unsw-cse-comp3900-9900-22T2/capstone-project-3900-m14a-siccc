from src.recipe import recipeMatch


def getMealType(meal, ingredientsList, blacklist):
    """ Select the meal type after the recipe match. 

            Parameters:
                meal (str): the name of meal type
                ingredientsList (list): the list of ingredientsList
        
            Returns:
                recipleTypeList (list): list of all recipes ingredients
    """
    recipeList = recipeMatch(ingredientsList, blacklist)
    recipeTypeList = []
    for recipe in recipeList:
        if recipe["mealType"] == meal:
            recipeTypeList.append(recipe)

    return recipeTypeList
