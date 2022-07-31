import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../helpers.jsx';
import { Box } from '@chakra-ui/react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Button} from '@mui/material';
import Logo from "../assets/logo1.png";
import { createTheme, ThemeProvider } from '@mui/material/styles';


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

  const theme = createTheme({
    palette: {
      primary: {
        main: '#93c759'
      }
    }
  });

  return (
    <>
      <ThemeProvider theme={theme}>
      <AppBar position="sticky">
        <Toolbar>
          <img src={Logo} alt="logo" height="50"/>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            MASTERCOOK
          </Typography>
          <Button variant="outlined" style={{background: "#FFFFFF"}} onClick={() => navigate('/recipe-create')}><b>Create new recipes</b></Button> 
        </Toolbar>
      </AppBar>

      <Box pl="100px" pt="50px" pb="100px">
        <Box >
          {/* <>recipe{params.id}</> */}
          <Typography gutterBottom variant="h3" component="div">
            {recipe.title}
          </Typography>
          <img src={recipe.photo} alt="recipe thumbnail" height="300px" width="auto"/>
          <Typography variant="body2" color="text.secondary">
            <p><b>Meal Type:</b> {recipe.mealType}</p>
            <p><b>Serving Size:</b> {recipe.servings} servings</p>
            <p><b>Time To Cook:</b> {recipe.timeToCook} minutes</p>
            <p><b>Total Calories:</b> {recipe.calories} calories</p>
          </Typography>

          <Typography gutterBottom variant="h5" component="div">
            Ingredients:
          </Typography>
          {String(recipe.ingredients).split(", ").map((ingredient, idx) => {
            return (
              <div key = {idx}>
                <label>
                  {ingredient}
                </label>
              </div>
            )
          })}
          <br/>
          <Typography gutterBottom variant="h5" component="div">
            Cooking Steps:
          </Typography>
          <span>{String(recipe.cookingSteps).split("Step ").slice(1).map((step, idx) => {
            return (
              <div key = {idx}>
                <label>
                  Step {step}
                </label>
              </div>
            )
          })}</span>
          <br></br>
          <Button variant="contained" style={{ color: "#FFFFFF" }} name="back" onClick={() => navigate(`/`)}><b>Back</b></Button>

        </Box>  
      </Box>
      </ThemeProvider>
    </>
  );

}



export default RecipeDetails;