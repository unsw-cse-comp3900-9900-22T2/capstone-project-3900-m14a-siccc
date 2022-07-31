import React from 'react';
import { apiFetch } from '../helpers.jsx';
import { useNavigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react'
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
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import BlockIcon from '@mui/icons-material/Block';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logo from "../assets/logo1.png";
import { createTheme, ThemeProvider } from '@mui/material/styles';



const AllIngredients = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = React.useState([]);
  const [blacklist, setBlacklist] = React.useState([]);
  const [recipes, setRecipes] =  React.useState([]);
  const [categories, setCategories] = React.useState({});
  const [clickedSearch, setClickedSearch] = React.useState(false);
  const [inputText, setInputText] = useState("");
  const [blacklistInputText, setBlacklistInputText] = useState("");
  const [inputCat, setInputCat] = useState("");
  const [ingredientSuggestions, setIngredientSuggestions] = React.useState([]);
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

  let blacklistInputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setBlacklistInputText(lowerCase);
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
  const viewAllBlacklist = async () => {
    try {

      const newBlacklist = [];
      
      // Sets a list of dictionary of ingredients if there is no local storage
      if (blacklist.length === 0) {
        const ingredientData = await apiFetch('GET', `ingredients/view`, null);
        for (const ingredient of ingredientData) {
          const elem = { text: ingredient, check: false };
          newBlacklist.push(elem);
        }
        setBlacklist(newBlacklist);
      }
    } catch (err) {
      alert(err.message);
    }
  }

  // Displays all Ingredients
  const viewAllIngredients = async () => {
    try {
      const ingredientList = [];

      // Sets a list of dictionary of ingredients if there is no local storage
      if (ingredients.length === 0) {
        const ingredientData = await apiFetch('GET', `ingredients/view`, null);
        for (const ingredient of ingredientData) {
          const elem = { text: ingredient, check: false };
          ingredientList.push(elem);
        }
        setIngredients(ingredientList);
      }
    } catch (err) {
      alert(err.message);
    }
  }

  function categoryHandler(e) {
    setInputCat(e.target.value);
  };

  function toggleBlacklist (index, ingredientName) {
    if (ingredientName) {
      for (const ingredient of blacklist) {
        if (ingredient.text === ingredientName) {
          index = blacklist.indexOf(ingredient);
        }
      }
    }
    const newBlacklist = [...blacklist];
    newBlacklist[index].check = !blacklist[index].check;
    setBlacklist(newBlacklist);
  }

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

    // Shows selected ingredient on categories view
    for (const [categoryName, ingredientsList] of Object.entries(categories)) {
      for (const ingredientDict of ingredientsList) {
        if(ingredientDict.text === newIngredient[index].text) {
          const matchIdx = categories[categoryName].indexOf(ingredientDict);
          newCategory[categoryName][matchIdx].check = !categories[categoryName][matchIdx].check
          break;
        }
      }
    }
    setCategories(newCategory);
    getIngredientSuggestions();
  }

  // Displays all recipes that match
  const recipeMatch = async (clicked) => {
    try {
      const selectedIngredients = [];
      const selectedBlacklist = [];
      
      // If user clicks search, save the search into local storage
      if (clicked) {
        setClickedSearch(true);
        localStorage.setItem('categories', JSON.stringify(categories));
        localStorage.setItem('ingredients', JSON.stringify(ingredients));
        localStorage.setItem('calories', JSON.stringify(calorieLimit));
        localStorage.setItem('mealType', JSON.stringify(mealType));
        localStorage.setItem('blacklist', JSON.stringify(blacklist));
        for (const [, ingredients] of Object.entries(categories)) {
          for (const ingredient of ingredients) {
            if (ingredient.check){
              selectedIngredients.push(ingredient.text);
            }
          }
        }
        for (const i of blacklist) {
          if (i.check){
            selectedBlacklist.push(i.text);
          }
        }
      // If user didn't click search button, this means they refresh the page
      // Get categories from local storage and output the recipes
      } else {
        const categoryDict = JSON.parse(localStorage.getItem('categories'));
        for (const [, ingredients] of Object.entries(categoryDict)) {
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

      // Matches recipe to selected ingredients
      const body = {
        ingredients: selectedIngredients,
        calories: calorieLimit,
        mealType: mealType,
        blacklist: selectedBlacklist,
      }

      if(parseInt(calorieLimit) !== 0 && parseInt(calorieLimit) != null && 
        !isNaN(parseInt(calorieLimit)) && mealType !== "") {
        // Meal type and calorie limit are selected
        const recipeData = await apiFetch('POST', 'recipe/calorie/mealtype/view', null, body)
        setRecipes(recipeData.recipes);
      } else if (parseInt(calorieLimit) !== 0 && parseInt(calorieLimit) !== null && !isNaN(parseInt(calorieLimit))) {
        // Calorie limit is selected but not meal type
        const recipeData = await apiFetch('POST', 'recipe/calorie/view', null, body);
        setRecipes(recipeData.recipes);
      } else if (mealType !== "") {
        // Meal type is selected but not calorie limit
        const recipeData = await apiFetch('POST', 'recipe/mealtype/view', null, body);
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
    } catch (err) {
      alert(err.message);
    }
  }

  const getIngredientSuggestions = async () => {
    try {
      await new Promise(r => setTimeout(r, 750));
      const suggestionIngredients = [];
      for(const ingred of ingredients) {
        if(ingred.check) {
          suggestionIngredients.push(ingred.text);
        }
      }
      const body = {
        'ingredients': suggestionIngredients,
      }
      const ingredientSug = await apiFetch('POST', 'recipe/ingredient/suggestions', null, body);
      const finalList = [];
      for(const ingredSug of ingredientSug['ingredients']) {
        for(const ingred of ingredients) {
          if(ingred.text === ingredSug) {
            finalList.push(ingred)
          }
        }
      }
      setIngredientSuggestions(finalList);
    } catch (err) {
      alert(err.message)
    }
  }

  function toggleCategoryIngredients (category, index) {
    const newCategory = {...categories};
    newCategory[category][index].check = !categories[category][index].check;
    setCategories(newCategory);

    // Shows selected ingredient on all ingredients view
    const newIngredient = [...ingredients];
    for (const ingredient of ingredients) {
      if (newCategory[category][index].text === ingredient.text){
        const allIngreIdx = ingredients.indexOf(ingredient);
        newIngredient[allIngreIdx].check = !ingredients[allIngreIdx].check;
        break;

      }
    }
    setIngredients(newIngredient);

    getIngredientSuggestions();
  }

  function toggleSuggestions(ingredient) {
    // Find ingredient in ingredients list, change check and set
    const newIngredient = [...ingredients];
    for (const ingred of ingredients) {
      if(ingredient === ingred) {
        const allIngreIdx = ingredients.indexOf(ingred);
        newIngredient[allIngreIdx].check = !ingredients[allIngreIdx].check;
        break
      }
    }
    setIngredients(newIngredient);

    // Find categories in categories list, change check and set
    const newCategory = {...categories};
    for (const [categoryName, ingredientsList] of Object.entries(categories)) {
      for (const ingredientDict of ingredientsList) {
        if(ingredientDict.text === ingredient.text) {
          const matchIdx = categories[categoryName].indexOf(ingredientDict);
          newCategory[categoryName][matchIdx].check = !categories[categoryName][matchIdx].check
          break;
        }
      }
    }
    setCategories(newCategory);
    
    getIngredientSuggestions();
  }

  function toggleBlacklistIngredients (category, index) {
    const newBlacklist = [...blacklist];
    for (const ingredient of blacklist) {
      if (categories[category][index].text === ingredient.text){
        const allIngreIdx = blacklist.indexOf(ingredient);
        newBlacklist[allIngreIdx].check = !blacklist[allIngreIdx].check;
        break;
      }
    }
    setBlacklist(newBlacklist);
  }

  function blacklistIndex (category, index) {
    for (const ingredient of blacklist) {
      if (categories[category][index].text === ingredient.text){
        return blacklist.indexOf(ingredient);
      }
    }
  }

  React.useEffect(() => {
    // Check that there is local storage stored, 
    // if there is local storage set the check lists to display the data
    if (localStorage.getItem('categories') && 
      Object.keys(JSON.parse(localStorage.getItem('categories'))).length !== 0) {
      setBlacklist(JSON.parse(localStorage.getItem('blacklist')));
      setCategories(JSON.parse(localStorage.getItem('categories')));
      setIngredients(JSON.parse(localStorage.getItem('ingredients')));
      if(localStorage.getItem('calories')) {
        setCalorieLimit(JSON.parse(localStorage.getItem('calories')));
      }
      if(localStorage.getItem('mealType')) {
        setMealType(JSON.parse(localStorage.getItem('mealType')))
      }
      recipeMatch(false);
    } else {
      viewAllIngredientsInCategories();
      viewAllBlacklist();
      viewAllIngredients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // List for blacklist search bar
  function SearchBlacklist(props) {
    const filteredBlacklist = blacklist.filter((el) => {
      if (props.input === '') {  
        return null;
      }
      else {
          return el.text.includes(props.input)
      }
    })

    return(
      <div>
      {filteredBlacklist.map((ingredient, idx) => (
        <div key={idx}>
          <FormControlLabel 
            control={<Checkbox icon={<BlockIcon/>} checkedIcon={<BlockIcon style={{color: "red"}}/>}/>}
            label={CapitalizeFirstLetter(ingredient.text)}
            onChange={() => toggleBlacklist(idx, ingredient.text)} 
            checked={ingredient.check}
          />
        </div>
      ))}
      </div>
    )
  }

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
            control={<Checkbox icon={<AddBoxIcon/>} checkedIcon={<IndeterminateCheckBoxIcon/>}/>} 
            label={CapitalizeFirstLetter(ingredient.text)}
            onChange={() => toggleIngredients(idx, ingredient.text)} 
            checked={ingredient.check}
          />
        </div>
      ))}
      </div>
    )
  }

  // chosen ingredients
  function ChosenIngredients() {
    return(
      <div>
        {ingredients.map((ingredient, idx) => (
          <div key={idx}>
            {ingredient.check
              ? <div key={idx}>
                  <FormControlLabel 
                    control={<Checkbox checkedIcon={<IndeterminateCheckBoxIcon/>}/>} 
                    label={CapitalizeFirstLetter(ingredient.text)} 
                    onChange={() => toggleIngredients(idx, ingredient.text)} 
                    checked={ingredient.check}
                  />
                </div>
              : <></>
            }
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
              <Checkbox 
                onChange={() => toggleCategoryIngredients(props.input, idx2)} 
                checked={ingredient.check}
                icon={<AddBoxIcon/>} 
                checkedIcon={<IndeterminateCheckBoxIcon/>}
              />
              <Checkbox
                onChange={() => toggleBlacklistIngredients(props.input, idx2)}
                type="checkbox"
                checked={blacklist[blacklistIndex(props.input, idx2)].check}
                icon={<BlockIcon/>}
                checkedIcon={<BlockIcon style={{color: "red"}}/>}
              />
              {CapitalizeFirstLetter(ingredient.text)}
            </div>
          )
        })
      )
    }
  }

  function CapitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: '#93c759'
      }
    },
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
        <Grid container justifyContent="space-between" direction="row" spacing={2}>
          
          <Grid item >
            <Box pl="30px">
              <br/>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Select your ingredients
              </Typography>
              <TextField placeholder="Search ingredients" variant="outlined" fullWidth onChange={inputHandler}/>
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
                    <MenuItem key={category} name={category} value={category}>{CapitalizeFirstLetter(category)}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <ViewCategory input={inputCat}/>
            </Box>
          </Grid>

          <Grid item sx={{width: "84%"}}>
            <Grid container justifyContent="space-between" direction="column" >
              <Grid item >
                <Box pl="20px">
                <Grid container justifyContent="space-between" direction="row" >

                  <Grid item xs={2} style={{minWidth: "240px"}}>
                    <br/>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      Ingredient suggestions
                    </Typography>
                    {
                      ingredientSuggestions.map((suggestion, idx) => {
                        return(
                        <div key = {idx}>
                          <Checkbox
                            onChange={() => toggleSuggestions(suggestion)}
                            type="checkbox"
                            checked={suggestion.check}
                            icon={<AddBoxIcon/>}
                          />
                          {CapitalizeFirstLetter(suggestion.text)}
                        </div>
                      )})
                    }
                    <br/>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      Your chosen ingredients
                    </Typography>
                    <ChosenIngredients/>
                    <Button variant="text" name="clearAll" onClick={(e)=> {clearAll(true)}}><b>Clear All Ingredients</b></Button>
                  </Grid>

                  <Grid item xs={2} style={{minWidth: "240px"}}>
                    <br/>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      Blacklist ingredients
                      <Tooltip 
                        placement="top"
                        title="Recipes with these ingredients will not show in your search">
                          <IconButton>
                            <InfoOutlinedIcon />
                          </IconButton>
                      </Tooltip>
                    </Typography>
                    <TextField placeholder="Search ingredients" variant="outlined" fullWidth onChange={blacklistInputHandler}/>
                    <SearchBlacklist input={blacklistInputText}/>
                    <br/>

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      Your blacklisted ingredients
                    </Typography>
                    {blacklist.map((name, idx) => (
                      <div key={idx}>
                        {name.check
                          ? <div key={idx}>
                            <label>
                              <Checkbox
                                onChange={() => toggleBlacklist(idx)}
                                type="checkbox"
                                checked={name.check}
                                checkedIcon={<BlockIcon style={{color: "red"}}/>}
                              />
                              {CapitalizeFirstLetter(name.text)}
                            </label>
                          </div>
                          : <></>
                        }
                      </div>
                    ))}
                  </Grid>

                  <Grid item xs={2} style={{minWidth: "240px"}}>
                    <br/>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      Meal type
                    </Typography>
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

                  <Grid item xs={2} style={{minWidth: "240px"}}>
                    <br/>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      Maximum calories
                    </Typography>
                    <TextField 
                      id="calorie" 
                      placeholder="Input calorie limit"
                      variant="outlined" 
                      type="number" 
                      onChange={calorieInputHandler} 
                      value={calorieLimit}
                      fullWidth
                    />
                  </Grid>
                  
                  <Grid item>
                    <Box pt="50px" pr="20px">
                      <Button variant="contained" style={{ color: "#FFFFFF" }} name="search" onClick={(e)=> {recipeMatch(true)}}><b>Search for Recipes</b></Button>
                    </Box>
                  </Grid>

                </Grid>
                </Box>
              </Grid>


              <Grid item >
                <Box pr="50px" pl="20px" pt="20px">
              {recipes.length !== 0
                ? 
                <Grid 
                  container
                  spacing={2}
                  direction="row"
                  alignItems="stretch"
                  display="flex"
                >

                  {recipes.map((recipe, idx) => {
                    return (
                      <Grid key={idx} item sx={{width: '25%', minWidth: "240px"}}>
                        <Card style={{height: "100%", minWidth: "240px"}}>
                          <CardActionArea onClick={() => navigate(`/recipe-details/${recipe.recipeID}`)}>
                            <CardMedia
                              component="img"
                              height="200"
                              image={recipe.photo}
                              alt="recipe thumbnail"
                            />
                            <CardContent>
                              <Typography gutterBottom variant="h5" component="div">
                              {recipe.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {recipe.missingIngredient === '' ? <span><b> You have all ingredients </b></span> : <span><b> You are missing {recipe.missingIngredient} </b></span>}
                                <br/>
                                <span>Ingredients: {recipe.ingredients}</span>
                                <br/>
                                <span>Calories: {recipe.calories}</span>
                                <br/>
                                <span>Meal Type: {CapitalizeFirstLetter(recipe.mealType)}</span>
                                <br/>
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
                  
                </Box>
              </Grid>
            </Grid>
          </Grid>

          
          <Grid item xs = {2}>
            <Grid item>
              <Box p='6' borderWidth='3px' borderBottomColor='black' padding='100px'>       
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}

export default AllIngredients;