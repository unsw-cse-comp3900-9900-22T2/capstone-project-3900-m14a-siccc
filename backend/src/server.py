from json import dumps
from flask import Flask, request
from flask_cors import CORS
#from matplotlib.pyplot import get
from src.calories_recipes import getCaloriesRecipesWithIngredients, getRecipesWithCaloriesIngredientsMealType
from src.error import InputError
from src.recipe import recipeMatch, recipeDetails
from src.ingredients import IngredientsViewAll
from src.ingredients_category import sortIngredientsInCategories
from src import config
from src.recipeContributor import insertRecipe, getNoRecipeMatchList, addFrequency
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
    info = recipeMatch(ingredients)
    if len(info) == 0:
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
    info = getCaloriesRecipesWithIngredients(calories, ingredients)
    return dumps({
        'recipes': info
    })
    
@APP.route("/recipe/mealtype/view", methods = ['POST'])
def recipeMatchMealTypeFlask():
    temp = request.get_json()
    ingredients = temp['ingredients']
    mealType = temp['mealType']
    info = getMealType(mealType, ingredients)
    return dumps({
        'recipes': info
    })
    
@APP.route("/recipe/calorie/mealtype/view", methods = ['POST'])
def recipeMatchMealTypeCalorieFlask():
    temp = request.get_json()
    ingredients = temp['ingredients']
    mealType = temp['mealType']
    calories = temp['calories']
    info = getRecipesWithCaloriesIngredientsMealType(calories, ingredients, mealType)
    return dumps({
        'recipes': info
    })
    
if __name__ == "__main__":
    APP.run(port=config.port)



