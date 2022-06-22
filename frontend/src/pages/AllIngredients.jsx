import React from 'react';
import { apiFetch } from '../helpers.jsx';

const AllIngredients = () => {
  const [ingredients, setIngredients] = React.useState([]);
  const [recipes, setRecipes] =  React.useState([]);

  const viewAllIngredients = async () => {
    try {
      const ingredientData = await apiFetch('GET', `ingredients/view`, null);
      setIngredients(ingredientData);
      console.log(ingredients);
      console.log('here');

    } catch (err) {
      alert(err.message);
    }
  }

  const recipeMatch = async () => {
    try {
      const body = {
        ingredients: [],
      }
      const recipeData = await apiFetch('POST', `recipe/view`, null, body);
      setRecipes(recipeData);
      console.log(recipeData);
      console.log(recipes);
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
        {ingredients.map((ingredient, idx) => {
          return (
            <p key={idx}>
              {ingredient}
            </p>
          )
        }) }
        <button name="search" onClick={recipeMatch}>Search</button>
      </>
      
      
    </>
  );
}

export default AllIngredients;