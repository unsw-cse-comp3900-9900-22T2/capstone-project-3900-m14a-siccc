import React from 'react';
import { apiFetch } from '../helpers.jsx';
import { useNavigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { useState } from "react";
import { Grid } from '@mui/material';
import {Button} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Fab from '@mui/material/Fab';
import Toolbar from '@mui/material/Toolbar';




const AllIngredients = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = React.useState([]);
  const [recipes, setRecipes] =  React.useState([]);
  const [categories, setCategories] = React.useState({});
  const [clickedSearch, setClickedSearch] = React.useState(false);
  const [inputText, setInputText] = useState("");
  const [inputCat, setInputCat] = useState("");
  var localCalories = localStorage.getItem('calories');
  if(isNaN(localCalories) || localCalories == null) {
    localCalories = '';
  } else {
    localCalories = parseInt(localCalories);
  }
  const [calorieLimit, setCalorieLimit] = React.useState(localCalories);
  var localMealType = localStorage.getItem('mealType')
  if(localMealType == null) {
    localMealType = ""
  } else {
    localMealType = JSON.parse(localMealType)
  }
  const [mealType, setMealType] = React.useState(localMealType);

  let inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };
  
  let calorieInputHandler = (e) => {
    const number = Math.abs(e.target.value);
    e.target.value = Math.abs(e.target.value);
    setCalorieLimit(number);
    localStorage.setItem('calories', JSON.stringify(number));
  }

  let mealTypeHandler = (e) => {
    setMealType(e.target.value);
    localStorage.setItem('mealType', JSON.stringify(e.target.value));
  }

  // Displays all Ingredients
  const viewAllIngredients = async () => {
    try {
      console.log(ingredients);
      const ingredientList = [];
      console.log(ingredients.length);
      
      // Sets a list of dictionary of ingredients if there is no local storage
      if (ingredients.length === 0) {
        const ingredientData = await apiFetch('GET', `ingredients/view`, null);
        console.log("list is 0")
        for (const ingredient of ingredientData) {
          const elem = { text: ingredient, check: false };
          ingredientList.push(elem);
        }
        setIngredients(ingredientList);
      }

      console.log(ingredients)
      //console.log(ingredients);
      console.log('here');
      console.log(ingredientList);
    } catch (err) {
      alert(err.message);
    }
  }

  function categoryHandler(e) {
    setInputCat(e.target.value);
  };

  // function toggleIngredients (index) {
  //   const newIngredient = [...ingredients];
  //   newIngredient[index].check = !ingredients[index].check;
  //   setIngredients(newIngredient);
  // }


  // Function to set ingrdients selected
  function toggleIngredients (index, ingredientName) {

    // Executes this code since the index changes for filtered list
    if (ingredientName) {
      for (const ingredient of ingredients) {
        if (ingredient.text === ingredientName) {
          index = ingredients.indexOf(ingredient);
        }
      }
    }

    const newIngredient = [...ingredients];
    newIngredient[index].check = !ingredients[index].check;
    setIngredients(newIngredient);


    const newCategory = {...categories};
    //console.log(newCategory[category][index].text)
    //console.log(ingredients[index].text);

    // Shows selected ingredient on categories view
    for (const [categoryName, ingredientsList] of Object.entries(categories)) {
      for (const ingredientDict of ingredientsList) {
        if(ingredientDict.text === newIngredient[index].text) {
          const matchIdx = categories[categoryName].indexOf(ingredientDict);
          newCategory[categoryName][matchIdx].check = !categories[categoryName][matchIdx].check
          /*console.log(newIngredient[index].text);
          console.log(matchIdx);
          console.log(categoryName);*/
          break;
        }
        console.log(ingredientDict.text);
      }
    }
    setCategories(newCategory);
  }

  // Displays all recipes that match
  const recipeMatch = async (clicked) => {
    try {
      const selectedIngredients = [];
      console.log(clicked);
      // Checks if the ingredients are selected and pushes to list
      /*for (const ingredient of ingredients) {
        if (ingredient.check){
          selectedIngredients.push(ingredient.text);
        }
      }*/
      
      // If user clicks search, save the search into local storage
      if (clicked) {
        setClickedSearch(true);
        localStorage.setItem('categories', JSON.stringify(categories));
        localStorage.setItem('ingredients', JSON.stringify(ingredients));
        localStorage.setItem('calories', JSON.stringify(calorieLimit));
        localStorage.setItem('mealType', JSON.stringify(mealType));
        for (const [, ingredients] of Object.entries(categories)) {
          console.log(ingredients)
          for (const ingredient of ingredients) {
            if (ingredient.check){
              selectedIngredients.push(ingredient.text);
            }
          }
        }
      // If user didn't click search button, this means they refresh the page
      // Get categories from local storage and output the recipes
      } else {
        const categoryDict = JSON.parse(localStorage.getItem('categories'));
        console.log(JSON.parse(localStorage.getItem('categories')));
        for (const [, ingredients] of Object.entries(categoryDict)) {
          console.log(ingredients)
          for (const ingredient of ingredients) {
            if (ingredient.check){
              selectedIngredients.push(ingredient.text);
            }
          }
        }
      }
      if (selectedIngredients.length === 0) {
        alert("Please select some ingredients")
      }

      console.log(calorieLimit)
      console.log(mealType)
      // Matches recipe to selected ingredients
      const body = {
        ingredients: selectedIngredients,
        calories: calorieLimit,
        mealType: mealType,
      }
      if(calorieLimit != 0 && calorieLimit != null && 
        !isNaN(calorieLimit) && mealType != "") {
        // Meal type and calorie limit are selected
        const recipeData = await apiFetch('POST', 'recipe/calorie/mealtype/view', null, body)
        setRecipes(recipeData.recipes);
      } else if (calorieLimit != 0 && calorieLimit != null && !isNaN(calorieLimit)) {
        // Calorie limit is selected but not meal type
        const recipeData = await apiFetch('POST', 'recipe/calorie/view', null, body);
        setRecipes(recipeData.recipes);
      } else if (mealType != "") {
        // Meal type is selected but not calorie limit
        const recipeData = await apiFetch('POST', 'recipe/mealtype/view', null, body);
        console.log(recipeData.recipes);
        setRecipes(recipeData.recipes);
      } else {
        // Meal type and calorie limit are not selected
        const recipeData = await apiFetch('POST', `recipe/view`, null, body);
        setRecipes(recipeData.recipes);
      }

    } catch (err) {
      alert(err.message);
    }
  }
  
  // Loads all ingredients in a category
  const viewAllIngredientsInCategories = async () => {
    try {
      const ingredientsInCategoriesDict = {};
      
      if (Object.keys(categories).length === 0) {
        const ingredientsInCategoriesData = await apiFetch('GET', 'ingredients/categories', null);
        for (const [category, ingredients] of Object.entries(ingredientsInCategoriesData)) {
          const ingredientList = [];
          for (const ingredient of ingredients) {
            const elem = { text: ingredient, check: false };
            ingredientList.push(elem);
          }
          ingredientsInCategoriesDict[category] = ingredientList
        }
        setCategories(ingredientsInCategoriesDict)
      }
      console.log(categories)
    } catch (err) {
      alert(err.message);
    }
  }

  function toggleCategoryIngredients (category, index) {
    const newCategory = {...categories};
    newCategory[category][index].check = !categories[category][index].check;
    setCategories(newCategory);

    // Shows selected ingredient on all ingredients view
    const newIngredient = [...ingredients];
    console.log(newCategory[category][index].text)
    for (const ingredient of ingredients) {
      if (newCategory[category][index].text === ingredient.text){
        const allIngreIdx = ingredients.indexOf(ingredient);
        newIngredient[allIngreIdx].check = !ingredients[allIngreIdx].check;
        break;

      }
    }
    setIngredients(newIngredient);
    console.log(ingredients)
    console.log(newCategory)
  }

  React.useEffect(() => {
    //console.log(Object.keys(JSON.parse(localStorage.getItem('categories'))).length);
    //Object.keys(JSON.parse(localStorage.getItem('categories'))).length != 0

    // Check that there is local storage stored, 
    // if there is local storage set the check lists to display the data
    if (localStorage.getItem('categories') && 
      Object.keys(JSON.parse(localStorage.getItem('categories'))).length !== 0) {

      setCategories(JSON.parse(localStorage.getItem('categories')));
      setIngredients(JSON.parse(localStorage.getItem('ingredients')));
      if(localStorage.getItem('calories')) {
        setCalorieLimit(JSON.parse(localStorage.getItem('calories')));
      }
      if(localStorage.getItem('mealType')) {
        setMealType(JSON.parse(localStorage.getItem('mealType')))
      }
      console.log(JSON.parse(localStorage.getItem('ingredients')));
      recipeMatch(false);
      console.log("ssssss")
    } else {
      viewAllIngredientsInCategories();
      viewAllIngredients();
      console.log("nnnnnn")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // List for ingredient search bar
  function List(props) {
    const filteredData = ingredients.filter((el) => {
      if (props.input === '') {  
        return null;
      }
      else {
          return el.text.includes(props.input)
      }
    })

    return(
      <div>
      {filteredData.map((ingredient, idx) => (
        <div key={idx}>
          <FormControlLabel 
            control={<Checkbox/>} 
            label={ingredient.text} 
            onChange={() => toggleIngredients(idx, ingredient.text)} 
            checked={ingredient.check}
          />
          {/* <label>
            {ingredient.text}
            <input
              onChange={() => toggleIngredients(idx, ingredient.text)}
              type="checkbox"
              checked={ingredient.check}
            />
          </label> */}
        </div>
      ))}
      </div>
    )
  }

  // chosen ingredients
  function ChosenIngredients() {
    const filteredData = ingredients.filter((el) => {
      if (el.check) {
        return el
      }
    })

    return(
      <div>
      {filteredData.map((ingredient, idx) => (
        <div key={idx}>
          <FormControlLabel 
            control={<Checkbox/>} 
            label={ingredient.text} 
            onChange={() => toggleIngredients(idx, ingredient.text)} 
            checked={ingredient.check}
          />
          {/* <label>
            {ingredient.text}
            <input
              onChange={() => toggleIngredients(idx, ingredient.text)}
              type="checkbox"
              checked={ingredient.check}
            />
          </label> */}
        </div>
      ))}
      </div>
    )
  }

  const clearAll = async (clicked) => {
    for (const ingredient of ingredients) {
      if (ingredient.check) {
        toggleIngredients(1, ingredient.text)
      }
    }
  }

  function ViewCategory(props) {
    if (props.input === "") {
      return
    }
      else {
      return(
        categories[props.input].map((ingredient, idx2) => {
          return(
            <div key={idx2}>
              <FormControlLabel 
                control={<Checkbox/>} 
                label={ingredient.text} 
                onChange={() => toggleCategoryIngredients(props.input, idx2)} 
                checked={ingredient.check}
              />
              {/* <label>
                {ingredient.text}
                <input
                  onChange={() => toggleCategoryIngredients(props.input, idx2)}
                  type="checkbox"
                  checked={ingredient.check}
                />
              </label> */}
            </div>
          )
        })
      )
    }
  }


  return (
    <>
      <AppBar position="static" style={{ background: '#93C759' }}>
      <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Recipe Recommendation System
          </Typography>
          <Button variant="outlined" style={{color:"#93C759", background: "#FFFFFF", borderColor: '#FFFFFF' }} onClick={() => navigate('/recipe-create')}>Create new recipes</Button> 
        </Toolbar>
      </AppBar>

      <Grid container justifyContent="space-between" direction="row" border='4px solid yellow' spacing={2}>
        
        <Grid item>
          <h2>Select your ingredients</h2>
          <TextField placeholder="Search ingredients" variant="outlined" onChange={inputHandler}/>
          <List input={inputText}/>
          <br/>
          <FormControl fullWidth>
            <Select
              name="categories"
              displayEmpty
              value={inputCat}
              onChange={categoryHandler}
            >
              <MenuItem value="">View ingredient categories</MenuItem>
              {Object.keys(categories).map((category) => (
                <MenuItem name={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <ViewCategory input={inputCat}/>
        </Grid>

        <Grid item border='4px solid blue' sx={{width: "60%"}}>
          <Grid container justifyContent="space-between" direction="column" spacing={2} border='4px solid red'>
            <Grid item>
              <Grid container justifyContent="space-between" direction="row" spacing={2} border='4px solid orange'>

                <Grid item>
                  <h2>Your chosen ingredients:</h2>
                  <ChosenIngredients/>
                  <Button variant="text" name="clearAll" onClick={(e)=> {clearAll(true)}}>Clear All Ingredients</Button>
                </Grid>

                <Grid item>
                  <p>What kind of meal is your recipe?</p>
                  <FormControl fullWidth>
                    <Select
                      name="mealType"
                      displayEmpty
                      value={mealType}
                      onChange={mealTypeHandler}
                    >
                      <MenuItem value="">Select one</MenuItem>
                      <MenuItem value="Breakfast">Breakfast</MenuItem>
                      <MenuItem value="Lunch">Lunch</MenuItem>
                      <MenuItem value="Dinner">Dinner</MenuItem>
                      <MenuItem value="Entree">Entrée</MenuItem>
                      <MenuItem value="Main">Main</MenuItem>
                      <MenuItem value="Dessert">Dessert</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item>
                  <p>Filter by calories</p>
                  <TextField 
                    id="calorie" 
                    placeholder="Input Calorie Limit"
                    variant="outlined" 
                    type="number" 
                    onChange={calorieInputHandler} 
                    value={calorieLimit}
                  />
                </Grid>
                
                <Grid item spacing={3}>
                  <Box pt="50px">
                  <Button variant="contained" style={{ background: '#93C759' }} name="search" onClick={(e)=> {recipeMatch(true)}}>Search Recipes</Button>
                  </Box>
                </Grid>

              </Grid>
            </Grid>


            <Grid item border='4px solid pink'>
            {recipes.length !== 0
              ? 
              <Grid 
                container
                spacing={2}
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                // justifyContent="space-between"
                // sx={4}
                border='4px solid green'
              >
              {/* // <div style={{ display: "flex", flexWrap: "wrap", border:'4px solid green' }} > */}
                {recipes.map((recipe, idx) => {
                  return (
                    <Grid item sx={{width: '25%'}}>
                      <Card >
                        <CardActionArea onClick={() => navigate(`/recipe-details/${recipe.recipeID}`)}>
                          <CardMedia
                            component="img"
                            height="140"
                            image={recipe.photo}
                            alt="recipe thumbnail"
                          />
                          <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                            {recipe.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {recipe.missingIngredient == '' ? <p><b> You have all ingredients </b></p> : <p><b> You are missing {recipe.missingIngredient} </b></p>}
                              <p>Ingredients: {recipe.ingredients}</p>
                              <p>Calories: {recipe.calories}</p>
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  )
              }) }
              </Grid>
              // </div>
              : ((clickedSearch && recipes.length === 0) || (localStorage.getItem('categories') && recipes.length === 0)) 
                ? <h1>No Available Recipes</h1>
                : <></>
            }
                
            
            </Grid>
          </Grid>
        </Grid>

        
        <Grid item xs = {2}>
          <Grid item>
            <Box p='6' borderWidth='3px' borderBottomColor='black' padding='100px'>
              {/* <p>hello</p> */}
              {/* <button name="allIngredients" onClick={viewAllIngredients}>All Ingredients</button>
              {ingredients.map((ingredient, idx) => (
                <div key={idx}>
                  <label>
                    {ingredient.text}
                    <input
                      onChange={() => toggleIngredients(idx)}
                      type="checkbox"
                      checked={ingredient.check}
                    />
                  </label>
                </div>
              ))} */}
              {/* <button name="recipeCreate" onClick={() => navigate('/recipe-create')}>Create new recipes</button> */}
               
            </Box>
          </Grid>
        </Grid>
      </Grid>
      
    </>
  );
}

export default AllIngredients;