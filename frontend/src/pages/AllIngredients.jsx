import React from 'react';
import { apiFetch } from '../helpers.jsx';
import { useNavigate } from 'react-router-dom';

const AllIngredients = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = React.useState([]);
  const [recipes, setRecipes] =  React.useState([]);

  // Displays all Ingredients
  const viewAllIngredients = async () => {
    try {
      console.log(ingredients);
      const ingredientList = [];
      const ingredientData = await apiFetch('GET', `ingredients/view`, null);

      // Sets a list of dictionary of ingredients
      console.log("list is 0")
      for (const ingredient of ingredientData) {
        const elem = { text: ingredient, check: false };
        ingredientList.push(elem);
      }
      setIngredients(ingredientList);
      
      /*if (ingredients.length === 0) {
      }*/
      console.log(ingredients)
      //console.log(ingredients);
      console.log('here');
      console.log(ingredientList);
    } catch (err) {
      alert(err.message);
    }
  }

  // Function to set ingrdients selected
  function toggleIngredients (index) {
    const newIngredient = [...ingredients];
    newIngredient[index].check = !ingredients[index].check;
    setIngredients(newIngredient);
  }

  // Displays all recipes that match
  const recipeMatch = async () => {
    try {
      const selectedIngredients = [];
      console.log(ingredients);
      // Checks if the ingredients are selected and pushes to list
      for (const ingredient of ingredients) {
        if (ingredient.check){
          selectedIngredients.push(ingredient.text);
        }
      }

      // Maytches recipe to selected ingredients
      const body = {
        ingredients: selectedIngredients,
      }
      const recipeData = await apiFetch('POST', `recipe/view`, null, body);
      setRecipes(recipeData.recipes);
      console.log(recipeData.recipes);
    
      console.log('here');

    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <>
      <>
        <p>hello</p>
        <button name="allIngredients" onClick={viewAllIngredients}>All Ingredients</button>
        {ingredients.map((ingredient, idx) => (
          <div key={idx}>
            <label>
              {ingredient.text}
              <input
                onChange={() => toggleIngredients(idx)}
                type="checkbox"
                checked={ingredient.check}
              />
            </label>
          </div>
        ))}

        <button name="search" onClick={recipeMatch}>Search</button>
        {recipes.map((recipe, idx) => {
          return (
            <div key={idx}>
              <div>{recipe.photo}</div>
              <h1 onClick={() => navigate(`/recipe-details/${recipe.recipeID}`)}>{recipe.title}</h1>
              <p>ingredients: {recipe.ingredients}</p>
              <hr></hr>
            </div>
          )
        }) }

      </>
      
      
    </>
  );
}

export default AllIngredients;