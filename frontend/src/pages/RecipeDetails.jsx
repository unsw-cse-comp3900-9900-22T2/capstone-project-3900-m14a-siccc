import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../helpers.jsx';

const RecipeDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [recipe, setRecipe] = React.useState({})
  
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
      <button onClick={() => navigate(`/`)}>Back</button>
      
    </>
  );
}

export default RecipeDetails;