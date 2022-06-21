from json import dumps
from flask import Flask, request
from flask_cors import CORS
from src.error import InputError
from src.recipe import IngredientsViewAll, recipeMatch, recipeDetails

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

@APP.route("/recipe/view", methods=['GET'])
def recipeMatchFlask():
    ingredients = request.args.get("ingredients")
    return dumps(recipeMatch(ingredients))

@APP.route("/recipe/details", methods=['GET'])
def recipeDetailsFlask():
    recipeID = request.args.get("recipeID")
    info = recipeDetails(recipeID)
    return dumps({
        'recipeID': info['recipeID'],
        'title': info['title'],
        'servings': info['servings'],
        'timeToCook': info['timeToCook'],
        'mealType': info['mealType'],
        'photo': info['photo'],
        'calories': info['calories'],
        'cookingSteps': info['cookingSteps'],
        'ingredients': info['ingredients']
    })

@APP.route("/ingredients/view", methods=['GET'])
def recipeMatchFlask():
    return dumps(IngredientsViewAll)