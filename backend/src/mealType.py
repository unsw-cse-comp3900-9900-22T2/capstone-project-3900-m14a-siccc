from src.recipe import recipeMatch


def getMealType(meal, ingredientsList, blacklist):
    """ Select the meal type after the recipe match. 

            Parameters:
                meal (str): the name of meal type
                ingredientsList (str): the list of ingredientsList
                blackList (list): the list of blacklist
        
            Returns:
                recipleTypeList (list): list of all recipes ingredients
    """
    recipeList = recipeMatch(ingredientsList, blacklist)
    recipeTypeList = []
    for recipe in recipeList:
        if meal is None:
            recipeTypeList.append(recipe)
        elif recipe["mealType"] == meal:
            recipeTypeList.append(recipe)

    return recipeTypeList
