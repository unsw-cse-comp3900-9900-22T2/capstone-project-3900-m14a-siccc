from recipe import recipeMatch


def getMealType(meal, ingredientsList):
    """ Select the meal type after the recipe match. 

            Parameters:
                meal: the name of meal type
                ingredientsList: the list of ingredientsList
        
            Returns:
                info: list of all recipes ingredients
    """
    recipeList = recipeMatch(ingredientsList)

    recipeTypeList = []

    for i in recipeList:
        if i["mealType"] == meal:
            recipeTypeList.append(i)

    return recipeTypeList



