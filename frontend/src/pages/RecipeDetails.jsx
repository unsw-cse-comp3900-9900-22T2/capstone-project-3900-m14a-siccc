import React from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../helpers.jsx';

const RecipeDetails = () => {
  const params = useParams();
  const [recipe, setRecipe] = React.useState({})
  
  const viewDetail = async () => {
    try {
      const body = {
        recipeID: params.id
      }
      const recipeData = await apiFetch('GET', `recipe/view`, null, body);
      setRecipe(recipeData);

    } catch (err) {
      alert(err.message);
    }
  }
  
  viewDetail();
  return (
    <>
      <>recipe{params.id}</>
      <h1>{recipe.title}</h1>
    </>
  );
}

export default RecipeDetails;