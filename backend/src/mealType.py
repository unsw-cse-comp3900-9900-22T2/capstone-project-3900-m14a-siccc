from recipe import recipeMatch


def getMealType(meal, ingredientsList):
    """ Select the meal type after the recipe match. 

            Parameters:
                meal: the name of meal type
                ingredientsList: the list of ingredientsList
        
            Returns:
                recipleTypeList: list of all recipes ingredients
    """
    recipeList = recipeMatch(ingredientsList)

    recipeTypeList = []

    for recipe in recipeList:
        if recipe["mealType"] == meal:
            recipeTypeList.append(recipe)

    return recipeTypeList



