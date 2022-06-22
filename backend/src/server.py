from json import dumps
from flask import Flask, request
from flask_cors import CORS
from src.error import InputError
from src.recipe import recipeMatch, recipeDetails

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
    ingredients = request.args.get("ingredients")
    return dumps({
        'recipes': recipeMatch(ingredients)
    })

@APP.route("/recipe/details/<page_id>", methods=['GET'])
def recipeDetailsFlask(page_id):
    info = recipeDetails(page_id)
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
    
if __name__ == "__main__":
    APP.run(port=5005)

