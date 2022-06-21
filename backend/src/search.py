

def recipeMatch(db, ingredients_list):
    """ Sends front end a list of recipes that satisfy the list 
        of ingredients that the user selected by alphabetically.

        Parameters:
            ingredients_list (str): list of ingredients user selected
        
        Return:
            recipe_list (str): list of recipes satisfying the ingredients
    """
    # [[relevent percetage, recipe information], ..., 
    # [relevent percetage, recipe information]]
    recipes = [] 
    
    cur = db.cursor()
    qry = """
    select * 
    from recipes
    """
    cur.execute(qry)
    info = cur.fetchone()
    for r in info:
        ingredients_meal = r[8]
        matching = 0
        for i in ingredients_meal:
            for j in ingredients_list:
                if i == j:
                    matching += 1
                    continue
        matching_percentage = matching / len(ingredients_list)
        if matching_percentage > 0:
            recipes.append(r)
    cur.close()

    # order from higher percentage to lower percentage
    recipe_list = sorted(recipes, key=lambda x:x[7], reverse=True) 

    if len(recipe_list) < 0:
        return None
    else:
        return recipe_list