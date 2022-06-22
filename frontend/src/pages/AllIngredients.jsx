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
        ingredients: ["bacon"],
      }
      const recipeData = await apiFetch('POST', `recipe/view`, null, body);
      setRecipes(recipeData.recipes);
      console.log(recipeData);
      console.log(recipes.recipes);
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
        {recipes.map((r, idx) => {
          return (
            <p key={idx}>
              {r}
            </p>
          )
        }) }
        <p>{recipes}</p>

      </>
      
      
    </>
  );
}

export default AllIngredients;