import json
import psycopg2
from src.helper import retrieveIngredientNames, retrieveRecipe, retrieveRecipeList

def IngredientsViewAll():
    db = psycopg2.connect("host=database-1.c0xbbloavtwb.ap-southeast-2.rds.amazonaws.com dbname=comp3900db user=postgres password=hello123")
    info = retrieveIngredientNames(db)
    list = []
    for ingredient in info: 
        list.append(ingredient[0])
    return sorted(list)

