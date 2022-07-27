import json
from lib2to3.pytree import convert
import psycopg2
from src.helper import retrieveRecipe, retrieveRecipeList
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
    # [[relevent percetage, recipe information], ...,
    # [relevent percetage, recipe information]]
    recipeList = []
    userIngrLen = len(ingredientsList)
    db = psycopg2.connect(
        f"host={host} dbname={dbname} user={user} password={password}")
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
    """ Helper function for recipeMatch 
    Parameters:
        recipes(list): list of all existing recipes 
        blacklist (list): list of blacklisted ingredients user selected
    Return:
        recipeList (list): list of recipes without ingredients from blacklist
"""
    filteredRecipeList = []
    for recipe in recipes:
        ingredientString = recipe[8]
        ingredients = ingredientString.split(',')
        if RecipeHasBlacklist(ingredients, blacklist) is False:
            filteredRecipeList.append(recipe)
    return filteredRecipeList


def RecipeHasBlacklist(recipe, blacklist):
    """
    Helper function for getFilteredRecipes
    Parameters:
        recipe(list): list of ingredients in recipe 
        blacklist (list): list of blacklisted ingredients user selected
    Return:
        recipeList (boolean): true if recipe contains any blacklisted ingredient, false otherwise 
    """
    for ingredient in recipe:
        for unwanted in blacklist:
            if unwanted in ingredient:
                return True
    return False

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
    db = psycopg2.connect(
        f"host={host} dbname={dbname} user={user} password={password}")
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
            igdsSuggestions (list): list of ingredients are satisfying the ingredients
    """
    num_select = len(ingredientsList)
    if num_select < 1:
        return []
    db = psycopg2.connect(
        f"host={host} dbname={dbname} user={user} password={password}")
    info = retrieveRecipeList(db)
    igdsSuggestions = []
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
                if len(igds_frequency) > 0:
                    if igds_frequency.get(miss) is not None:
                        print(f"\t{miss} = {igds_frequency[miss]}\n")
                        new_frequency = igds_frequency[miss] + 1
                        igds_frequency[miss] = new_frequency
                    else:
                        igds_frequency[miss] = 1
                else:
                    igds_frequency[miss] = 1

    if len(igds_frequency) <= 5:
        igdsSuggestions = sorted(igds_frequency.keys())
    else:
        igds_frequency_sort = sorted(igds_frequency.items(), 
                        key=lambda kv: kv[1], reverse=True)
        tmp_igds = []  
        pre_frequency = len(info)
        full = False      
        for igds, fqy in igds_frequency_sort:
            if full or len(igdsSuggestions) >= 5:
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
                        if len(igdsSuggestions) < 5 and full is False:
                            igdsSuggestions.append(item)
                        else:
                            full = True
                            break
                    tmp_igds = [igds]
                    pre_frequency = fqy
        if len(igdsSuggestions) < 5:
            tmp_igds_sort = sorted(tmp_igds)
            for i in tmp_igds_sort:
                if len(igdsSuggestions) < 5:
                    igdsSuggestions.append(i)
                else:
                    break
                    
    return igdsSuggestions

    """
    if len(ingredientsList) < 1:
        return []
    ingredientsSuggestions = []
    ingredients_matching_rate = []
    ingredients_matching_recipes_num = []
    recipeLists = recipeMatch(ingredientsList)

    for recipe in recipeLists:
        ingredients = recipe["ingredients"]
        if len(ingredients) < 1:
            continue
        tmp_ingredients = []
        tmp_matching = 0
        for igd in ingredients:
            if igd not in ingredientsList:
                if len(ingredients_matching_recipes_num) == 0 or ingredients_matching_recipes_num[igd] is None:
                    ingredients_matching_recipes_num.append({igd: 1})
                else:
                    tmp_num = ingredients_matching_recipes_num[igd]
                    ingredients_matching_recipes_num[igd] = tmp_num + 1
                tmp_ingredients.append(igd)
            else:
                tmp_matching += 1
        tmp_matching_rate = tmp_matching / len(ingredients)
        for item in tmp_ingredients:
            if len(ingredients_matching_rate) > 0:
                ingredients_matching_rate[item] = tmp_matching_rate
            elif ingredients_matching_rate[item] is not None:
                tmp_rate = ingredients_matching_rate[item]
                if tmp_rate < tmp_matching_rate:
                    ingredients_matching_rate[item] = tmp_matching_rate
            else:
                tmp_matching_dict = {item: tmp_matching_rate}
                ingredients_matching_rate.append(tmp_matching_dict)
    
    if len(ingredients_matching_recipes_num) == 0:
        return ingredientsSuggestions

    ingredients_matching_recipes_num = sorted(
                        ingredients_matching_recipes_num.items(), 
                        key=lambda kv: kv[1], 
                        reverse=True)
    tmp_same_num_igd = []
    for key, value in ingredients_matching_recipes_num:
        if len(tmp_ingredients) != 0:
            if ingredients_matching_recipes_num(tmp_same_num_igd[len(tmp_same_num_igd) - 1]) == value:
                tmp_ingredients.append(key)
                continue
            else:
                i = 0
                while i < len(tmp_ingredients):
                    for j in range(i+1, len(tmp_ingredients)):
                        tmp_matching_rate = ingredients_matching_rate[tmp_ingredients[i]]    
                        tmp_cmp_rate = ingredients_matching_rate[tmp_ingredients[j]]
                        tmp_igd = tmp_ingredients[j]
                        if tmp_matching_rate > tmp_cmp_rate:
                            tmp_ingredients[j] = tmp_ingredients[i]
                            tmp_ingredients[i] = tmp_igd
                        elif tmp_matching_rate == tmp_cmp_rate:
                            if tmp_igd > tmp_ingredients[i]:
                                tmp_ingredients[j] = tmp_ingredients[i]
                                tmp_ingredients[i] = tmp_igd    
                    i += 1
                for item in tmp_ingredients:
                    ingredientsSuggestions.append(item)
                tmp_ingredients = []

        if len(ingredientsSuggestions) == 0:
            ingredientsSuggestions.append(key)
        elif ingredients_matching_recipes_num(ingredientsSuggestions[len(ingredientsSuggestions) - 1]) == value:
            tmp_ingredients.append(ingredientsSuggestions[len(ingredientsSuggestions) - 1])
            tmp_ingredients.append(key)
            ingredientsSuggestions.pop()
        else:
            ingredientsSuggestions.append(key)

    if len(ingredientsSuggestions) > 5:
        return ingredientsSuggestions[0:5]
    return ingredientsSuggestions
    """