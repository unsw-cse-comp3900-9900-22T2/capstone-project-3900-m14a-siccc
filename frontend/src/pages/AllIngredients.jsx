import React from 'react';
import { apiFetch } from '../helpers.jsx';
import { useNavigate } from 'react-router-dom';

const AllIngredients = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = React.useState([]);
  const [recipes, setRecipes] =  React.useState([]);
  //const [searchIngredient, setSearchIngredient] = React.useState([]);

  // Displays all Ingredients
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

  // Displays all recipes that match
  const recipeMatch = async () => {
    try {
      const body = {
        ingredients: ["bacon"],
      }
      const recipeData = await apiFetch('POST', `recipe/view`, null, body);
      setRecipes(recipeData.recipes);
      console.log(recipeData.recipes);
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
              <input type="checkbox" id={idx} />
            </p>
          )
        }) }
        <button name="search" onClick={recipeMatch}>Search</button>
        {recipes.map((recipe, idx) => {
          return (
            <p key={idx}>
              <div>{recipe.photo}</div>
              <h1 onClick={() => navigate(`/recipe-details/${recipe.recipeID}`)}>{recipe.title}</h1>
              <p>ingredients: {recipe.ingredients}</p>
              <hr></hr>
            </p>
          )
        }) }

      </>
      
      
    </>
  );
}

export default AllIngredients;