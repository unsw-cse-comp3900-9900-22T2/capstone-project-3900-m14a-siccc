from src.ingredients_category import sortingCategories, sortingIngredients
from src.helper import retrieveIngredientNames, dbConnection


def IngredientsViewAll():
    """View all ingredients from database and sort it by alphabetical. 

        Returns:
            ingredients (list): list of ingredient strings
    """
    db = dbConnection()
    info = retrieveIngredientNames(db)
    list = []
    for ingredient in info: 
        list.append(ingredient[0])
    return sorted(list)


def CategoryViewAll():
    """ View all ingredients by categories.

            Returns:
                ingredients (list): list of dictionary key-value pairs 
                        e.g., {ingredient: ___, category: ___}
    """
    ListCategories = sortingCategories()
    IngredientsListOfDictionaries = []
    for category in ListCategories: 
        Ingredients = sortingIngredients(category)
        for ingredient in Ingredients: 
            DictPair = {"Ingredient": ingredient, "Category": category}
            IngredientsListOfDictionaries.append(DictPair)
    return IngredientsListOfDictionaries 
