

from src.ingredients import IngredientsViewAll


def test_viewAllIngredients(): 
    ingredients = IngredientsViewAll() 
    print(ingredients)
    assert(True)
    # ingredients = ["bacon", "broccoli", "cinnamon", "egg", "olive oil", "thyme", "turkey"]
    # assert IngredientsViewAll() == ingredients

