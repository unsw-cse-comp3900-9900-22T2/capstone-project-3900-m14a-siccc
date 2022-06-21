from json import dumps
from flask import Flask, request
from flask_cors import CORS
from src.error import InputError
from src.search import recipeMatch

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

@APP.route("", methods=['GET'])
def search_flask():
    ingredients = request.args.get("ingredients")
    return dumps(recipeMatch(ingredients))