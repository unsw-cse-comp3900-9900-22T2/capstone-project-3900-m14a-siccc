import React from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../helpers.jsx';

const RecipeDetails = () => {
  const [recipe, setRecipe] = React.useState({})
  const params = useParams();
  
  React.useEffect(() => {
    const viewDetail = async () => {
      try {
        const recipeData = await apiFetch('GET', `recipe/details/${params.id}`, null);
        setRecipe(recipeData);
        //console.log('here');

      } catch (err) {
        alert(err.message);
      }
    }
    viewDetail();
  }, [params.id]);

  return (
    <>
      <>recipe{params.id}</>
      <h1>{recipe.title}</h1>
      <p>{recipe.servings} servings</p>
      <p>{recipe.timeToCook} minutes</p>
      <p>Meal Type: {recipe.mealType}</p>
      <p>{recipe.photo}</p>
      <p>{recipe.calories}</p>
      <p>{recipe.cookingSteps}</p>
      <p>Ingredients: {recipe.ingredients}</p>
      
    </>
  );
}

export default RecipeDetails;