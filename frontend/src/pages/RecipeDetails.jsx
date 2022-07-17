import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../helpers.jsx';
import { Box } from '@chakra-ui/react'

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
      <Box p='6' borderWidth='3px' borderBottomColor='black' padding='100px'>
        <Box >
          {/* <>recipe{params.id}</> */}
          <h1>{recipe.title}</h1>
          <img src={recipe.photo} alt="recipe thumbnail" height="140px" width="auto"/>
          <p><b>Meal Type:</b> {recipe.mealType}</p>
          <p><b>Serving Size:</b> {recipe.servings} servings</p>
          <p><b>Time To Cook:</b> {recipe.timeToCook} minutes</p>
          <p><b>Total Calories:</b> {recipe.calories} calories</p>
          <p><b>Ingredients: </b>{String(recipe.ingredients).split(", ").map((ingredient, idx) => {
            return (
              <div key = {idx}>
                <label>
                  {ingredient}
                </label>
              </div>
            )
          })}</p>
          <h3>Cooking Steps</h3>
          <p>{String(recipe.cookingSteps).split("Step ").slice(1).map((step, idx) => {
            return (
              <div key = {idx}>
                <label>
                  Step {step}
                </label>
              </div>
            )
          })}</p>
          <button onClick={() => navigate(`/`)}>Back</button>
        </Box>  
      </Box>
    </>
  );

}



export default RecipeDetails;