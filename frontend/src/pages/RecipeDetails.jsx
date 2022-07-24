import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../helpers.jsx';
import { Box } from '@chakra-ui/react'
import { Grid, List, ListItem, ListItemText, Divider } from '@mui/material';

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const MyButton = styled(Button)({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
});

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
      <Grid container direction="row" justifyContent="space-between">
        <Grid item xs = {3}> 
          <Box p='6' borderWidth='3px' borderBottomColor='black' padding='100px'
          > 
            {/* <>recipe{params.id}</> */}
            <MyButton onClick={() => navigate(`/`)}>Back</MyButton>
              <h1>{recipe.title}</h1>
              <img src={recipe.photo} alt="recipe thumbnail" height="140px" width="auto"/>

            <List sx={3} component="nav" aria-label="mailbox folders">
              <ListItem button>
              <p><b>Meal Type:</b> {recipe.mealType}</p>
              </ListItem>
              <Divider />
              <ListItem button divider>
              <p><b>Serving Size:</b> {recipe.servings} servings</p>
              </ListItem>
              <ListItem button>
              <p><b>Time To Cook:</b> {recipe.timeToCook} minutes</p>
              </ListItem>
              <Divider light />
              <ListItem button>
              <p><b>Total Calories:</b> {recipe.calories} calories</p>
              </ListItem>
            </List>
              

          </Box>
        </Grid>
        <Grid item xs = {3}>
        <Box p='6' borderWidth='3px' borderBottomColor='black' padding='150px'>
        <span><b>Ingredients: </b>{String(recipe.ingredients).split(", ").map((ingredient, idx) => {
                return (
                  <div key = {idx}>
                    <label>
                      {ingredient}
                    </label>
                  </div>
                )
        })}</span>
        </Box>
        </Grid>
        <Grid item xs = {6}> 
        <Box p='6' borderWidth='3px' borderBottomColor='black' padding='130px'>
        <h3>Cooking Steps</h3>
              <span>{String(recipe.cookingSteps).split("Step ").slice(1).map((step, idx) => {
                return (
                  <div key = {idx}>
                    <label>
                      Step {step}
                    </label>
                  </div>
                )
              })}</span>
              
        </Box>
        
        </Grid>
      </Grid>
    </>
  );

}



export default RecipeDetails;