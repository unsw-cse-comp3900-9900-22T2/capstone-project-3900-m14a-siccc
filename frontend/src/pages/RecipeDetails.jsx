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
          <p>{recipe.photo}</p>
          <p>Meal Type: {recipe.mealType}</p>
          <p>{recipe.servings} servings</p>
          <p>{recipe.timeToCook} minutes</p>
          <p>{recipe.calories} calories</p>
          <Box p='6' borderWidth='3px' borderBottomColor='black' padding='10px'>
            <Box >
              <p>Ingredients: {recipe.ingredients}</p>
              <p>{recipe.cookingSteps}</p>
            </Box>
          </Box>
          <button onClick={() => navigate(`/`)}>Back</button>
          </Box>  
      </Box>
    </>
  );

}



export default RecipeDetails;