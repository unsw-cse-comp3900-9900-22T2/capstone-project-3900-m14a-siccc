"""
A server.py is linked with the frontend. 

Team name: 3900-M14A-SICCC
Project Name: Project 1 - Recipe Recommendation System
Author: Cameron Khuu, Carla Phan, Christopher Tsang, Sylvia Huang, Xin Tian Luo
Date: 31/July/2022
"""
from json import dumps
from flask import Flask, request
from flask_cors import CORS
from src.caloriesRecipes import getCaloriesRecipes
from src.error import InputError
from src.recipe import ingredientsSuggestions, recipeMatch, recipeDetails
from src.ingredients import IngredientsViewAll
from src.ingredientsCategory import sortIngredientsInCategories
from src import config
from src.recipeContributor import insertRecipe, getNoRecipeMatchList
from src.recipeContributor import addFrequency
from src.mealType import getMealType


def defaultHandler(err):
    response = err.get_response()
    print('response', err, err.get_response())
    response.data = dumps({
        "code": err.code,
        "name": "System Error",
        "message": err.get_description(),
    })
    response.content_type = 'application/json'
    return response

APP = Flask(__name__, static_url_path = '/static')
CORS(APP)

@APP.route("/recipe/view", methods=['POST'])
def recipeMatchFlask():
    temp = request.get_json()
    ingredients = temp['ingredients']
    blacklist = temp['blacklist']
    info = recipeMatch(ingredients, blacklist)
    partialMatch = True
    for entry in info:
        if entry['partialMatch'] == False:
            partialMatch = False
            break
    if len(info) == 0 or partialMatch:
        addFrequency(ingredients)
    return dumps({
        'recipes': info
    })


@APP.route("/recipe/details/<page_id>", methods=['GET'])
def recipeDetailsFlask(page_id):
    info = recipeDetails(page_id)
    return dumps(info)
    

@APP.route("/ingredients/view", methods=['GET'])
def IngredientsView():
    info = IngredientsViewAll()
    return dumps(info)


@APP.route("/ingredients/categories", methods=['GET'])
def ingredientsCategories():
    info = sortIngredientsInCategories()
    return dumps(info)


@APP.route("/insert/recipe", methods=['POST'])
def insertRecipeFlask():
    temp = request.get_json()
    recipeDetails = temp['recipe']
    insertRecipe(recipeDetails)
    return dumps(1)


@APP.route("/no/recipe/match", methods=['GET'])
def getNoRecipeMatchFlask():
    return dumps(getNoRecipeMatchList())


@APP.route("/recipe/calorie/view", methods = ['POST'])
def recipeMatchCalorieFlask():
    temp = request.get_json()
    ingredients = temp['ingredients']
    calories = temp['calories']
    blacklist = temp['blacklist']
    info = getCaloriesRecipes(calories, ingredients, "", blacklist)
    return dumps({
        'recipes': info
    })


@APP.route("/recipe/mealtype/view", methods = ['POST'])
def recipeMatchMealTypeFlask():
    temp = request.get_json()
    ingredients = temp['ingredients']
    mealType = temp['mealType']
    blacklist = temp['blacklist']
    info = getMealType(mealType, ingredients, blacklist)
    return dumps({
        'recipes': info
    })
    

@APP.route("/recipe/calorie/mealtype/view", methods = ['POST'])
def recipeMatchMealTypeCalorieFlask():
    temp = request.get_json()
    ingredients = temp['ingredients']
    mealType = temp['mealType']
    calories = temp['calories']
    blacklist = temp['blacklist']
    info = getCaloriesRecipes(calories, ingredients, mealType, blacklist)
    return dumps({
        'recipes': info
    })
    

@APP.route("/recipe/ingredient/suggestions", methods = ['POST'])
def recipeIngredientSuggestionsFlask():
    temp = request.get_json()
    ingredients = temp['ingredients']
    blacklist = temp['blacklist']
    info = ingredientsSuggestions(ingredients, blacklist)
    return dumps({
        'ingredients': info
    })

   
if __name__ == "__main__":
    APP.run(port=config.port)



