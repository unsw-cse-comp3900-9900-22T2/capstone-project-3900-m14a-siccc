import { Grid } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, fileToDataUrl } from '../helpers.jsx';
import { useState } from "react";
import TextField from '@mui/material/TextField';
import { Checkbox } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Slider from '@mui/material/Slider';
import ListItem from '@mui/material/ListItem';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Logo from "../assets/logo1.png";


const RecipeCreate = () => {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState('');
  const [ingredients, setIngredients] = React.useState([]);
  const [thumbnail, setThumbnail] = React.useState('');
  const [servings, setServings] = React.useState('');
  const [mealType, setMealType] = React.useState('')
  const [cookingTime, setCookingTime] = React.useState('')
  const [freqIngredients, setFreqIngredients] = React.useState([]);
  const [steps, setSteps] = React.useState([]);
  // const [stepsNo, setStepsNo] = React.useState(0);
  const [categories, setCategories] = React.useState({});
  const [ingredientsGram, setIngredientsGram] = React.useState({});
  const [inputText, setInputText] = useState("");

  const marks = [
    { value: 0, label: '0'},
    { value: 1, label: '1'},
    { value: 2, label: '2'},
    { value: 3, label: '3'},
    { value: 4, label: '4'},
    { value: 5, label: '5'},
    { value: 6, label: '6'},
    { value: 7, label: '7'},
    { value: 8, label: '8'},
    { value: 9, label: '9'},
    { value: 10, label: '10'},
    { value: 11, label: '11'},
    { value: 12, label: '12'},
    { value: 13, label: '13'},
    { value: 14, label: '14'},
    { value: 15, label: '15'},
    { value: 16, label: '16'},
    { value: 17, label: '17'},
    { value: 18, label: '18'},
    { value: 19, label: '19'},
    { value: 20, label: '20'},
  ]

  let inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  // Displays all Ingredients
  const viewAllIngredients = async () => {
    try {
      const ingredientList = [];
      const ingredientData = await apiFetch('GET', `ingredients/view`, null);
      for (const ingredient of ingredientData) {
        const elem = { text: ingredient, check: false };
        ingredientList.push(elem);
      }
      setIngredients(ingredientList);
    } catch (err) {
      alert(err.message);
    }
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

    // Deletes the ingredient value in list
    if(!newIngredient[index].check) {
      delete ingredientsGram[newIngredient[index].text];
    }

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
  }

  // Set the value of ingredients and adds g to value
  function updateIngredientValue (event, ingredientName) {
    event.target.value = Math.abs(event.target.value)
    const newIngredientsGram = {...ingredientsGram};
    if (newIngredientsGram[ingredientName] && newIngredientsGram[ingredientName].includes("g")) {
      newIngredientsGram[ingredientName] = String(event.target.value) + "g";
    } else if (newIngredientsGram[ingredientName]) {
      newIngredientsGram[ingredientName] = String(event.target.value);
    } else {
      newIngredientsGram[ingredientName] = String(event.target.value) + "g";
    }
    setIngredientsGram(newIngredientsGram);
  }

  // Updates dictionary to grams or in quantities
  function updateIngredientMeasurement (event, ingredientName) {
    const newIngredientsGram = {...ingredientsGram};
    var newValue = '0g';

    // if the ingredient value does exist set value
    if (newIngredientsGram[ingredientName]) {
      newValue = newIngredientsGram[ingredientName];
    }

    if (event.target.value === 'g'){
      newIngredientsGram[ingredientName] = newValue.replaceAll("g", "") + "g";
    } else if (event.target.value === 'q' && newValue.includes("g")){
      newIngredientsGram[ingredientName] = newValue.replaceAll("g", "");
    }

    setIngredientsGram(newIngredientsGram);
  }

  // Return grams or quanitities for ingredient
  function measurementValue (ingredient) {
    if (!ingredientsGram[ingredient]) {
      return "";
    }

    if (ingredientsGram[ingredient].includes("g")){
      return "g";
    } else {
      return "q";
    }
  }

  // Set the thumbnail of listing
  const thumbnailUpdate = async (event) => {
    if (event.target.files[0]) {
      const data = await fileToDataUrl(event.target.files[0]);
      setThumbnail(data);
    } else {
      setThumbnail('');
    }
  }

  // Sets the list of steps for listing
  const updateSteps = (event, index) => {
    const newSteps = [...steps];
    newSteps[index] = event.target.value;
    setSteps(newSteps);
  }

  // Changes number of steps
  const changeSteps = (e) => {
    // setStepsNo(e.target.value);
    const newSteps = [...steps];
    const oldLength = newSteps.length;
    var i = 0;
    if(parseInt(e.target.value) > oldLength) {
      // Push the difference
      const difference = parseInt(e.target.value) - oldLength;
      i = 0;
      while(i < difference) {
        newSteps.push(0)
        i = i + 1;
      }
    } else {
      const difference = oldLength - parseInt(e.target.value);
      i = 0;
      while(i < difference) {
        newSteps.pop()
        i = i + 1;
      }
    }
    setSteps(newSteps);
  }
  
  // Sends off data of the created recipe to backend
  const createRecipe = () => {
    if (cookingTime < 0 || servings < 0) {
      alert('Invalid Input');
      return;
    }

    if ((title === '' ||
      mealType === '' ||
      servings === '' ||
      thumbnail === '' ||
      cookingTime === '' ||
      ingredients.length === 0 ||
      steps.length === 0 || 
      steps.includes(0) || 
      steps.includes(''))) {
        var message = "Please enter the required information:\n"
        if (title === '') message = message + "- Recipe title\n";
        if (mealType === '') message = message + "- Meal type\n";
        if (servings === '') message = message + "- Number of servings\n";
        if (thumbnail === '') message = message + "- Recipe photo\n";
        if (cookingTime === '') message = message + "- Estimated cooking time\n";
        if (ingredients.length === 0) message = message + "- Ingredients\n";
        if (steps.length === 0) message = message + "- Recipe steps\n";
        if (steps.includes(0) || steps.includes('')) message = message + "- Missing instructions in steps\n";
        alert(message)
        return;
      }
      
      // Removed any 0 values in dictionary
      const newIngredientGram = {...ingredientsGram}
      for (const [key, value] of Object.entries(newIngredientGram)) {
        if (value === '0' || value === '0g') {
          delete newIngredientGram[key];
        }
      }
      // Check if dictionary is empty
      if (Object.keys(newIngredientGram).length === 0) {
        alert('Add values for ingredient!');
        return;
      }

    const body = {
      recipe: {
        title: title,
        mealType: mealType,
        servings: servings,
        photo: thumbnail,
        timeToCook: cookingTime,
        ingredients: newIngredientGram,
        cookingSteps: steps,
      },
    }
    
    apiFetch('POST', 'insert/recipe', null, body)
    .then((data) => {
      navigate('/');
    })
    .catch((err) => {
      alert(err);
    });
  }

  const viewFrequentIngredients = async () => {
    try {
      const freqIngredientList = [];
      const freqIngredientData = await apiFetch('GET', `no/recipe/match`, null);
      var counter = 0
      for (const ingredient of freqIngredientData) {
        if(counter < 5) {
          freqIngredientList.push(ingredient);
        }
        counter = counter + 1
      }
      setFreqIngredients(freqIngredientList);
    } catch (err) {
      alert(err.message);
    }
  }

  function CatSuggestion () {
    let catSuggestions = []
    for (const [categoryName, ingredientsList] of Object.entries(categories)) {
      var flag = 0
      for (const ingredientDict of ingredientsList) {
        if(ingredientDict.check === true) {
          flag = 1
        }
      }
      if (flag === 0) {
        catSuggestions.push(categoryName)
      }
    }
    return(
      catSuggestions.map((category, idx) => {
        return(
          <ListItem key={idx}>
            <ListItemIcon>
              <LocalDiningIcon/>
            </ListItemIcon>
            <ListItemText primary={capitalizeFirstLetter(category)}/>
          </ListItem>
        )
      })
    )
  }

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

    // If unchecked ingredient deletes the ingredient value in list
    if(!newCategory[category][index].check) {
      delete ingredientsGram[newCategory[category][index].text];
    }
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
          <label>
            <Checkbox
              onChange={() => toggleIngredients(idx, ingredient.text)}
              checked={ingredient.check}
            />
            {capitalizeFirstLetter(ingredient.text)} 
          </label>
        </div>
      ))}
      </div>
    )
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: '#93c759'
      }
    }
  });

  React.useEffect(() => {
    viewAllIngredients();
    viewFrequentIngredients();
    viewAllIngredientsInCategories();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>

      <ThemeProvider theme={theme}>
        <AppBar position="sticky">
          <Toolbar>
            <img src={Logo} alt="logo" height="50"/>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              MASTERCOOK
            </Typography>
            <Button variant="outlined" style={{background: "#FFFFFF"}} onClick={() => navigate('/')}><b>Search for recipes</b></Button> 
          </Toolbar>
        </AppBar>
      <Container component="main" maxWidth="md">
        <CssBaseline />
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: '#93c759' }}>
              <MenuBookIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Create Recipe
            </Typography>
            <Box component="form" sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Title"
                type="text"
                name="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="servings"
                label="Servings"
                type="number"
                id="servings"
                min="0"
                value={servings}
                onChange={e => setServings(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="cookingTime"
                type="number"
                name="cookingTime"
                label="Cooking Time"
                min="0"
                value={cookingTime}
                onChange={e => setCookingTime(e.target.value)}
              />
              <FormControl fullWidth margin="normal" required>
                <Select
                  name="mealType"
                  displayEmpty
                  value={mealType}
                  onChange={e => setMealType(e.target.value)}
                >
                  <MenuItem value="">Select Meal Type</MenuItem>
                  <MenuItem value="Breakfast">Breakfast</MenuItem>
                  <MenuItem value="Lunch">Lunch</MenuItem>
                  <MenuItem value="Dinner">Dinner</MenuItem>
                  <MenuItem value="Entree">Entrée</MenuItem>
                  <MenuItem value="Main">Main</MenuItem>
                  <MenuItem value="Dessert">Dessert</MenuItem>
                </Select>
              </FormControl>
              <Button
                startIcon={<PhotoCameraIcon/>}
                sx={{ mt: 2, mb: 2}}
                variant="contained" 
                component="label"
                fullWidth
                style={{color: "#FFFFFF"}}
              >
                <b>Upload Recipe Photo</b>
                <input 
                  type="file"
                  name="thumbnail"
                  accept="image/png, image/jpg, image/jpeg"
                  hidden
                  onChange={thumbnailUpdate}
                />
              </Button>
              {thumbnail !== ''
                ? (<Box component="img" src={thumbnail} alt="recipe thumbnail" sx={{height: 500, width: 700, mx:5}}/>)
                : <></>
              }
              <Typography component="h2" variant="h6">
                How many steps does your recipe have?
              </Typography>
              <Slider
                marks={marks}
                steps={10}
                valueLabelDisplay='on'
                min={0}
                max={20}
                onChange={changeSteps}
              />
              {steps.map((step, idx) => {
                return (
                  <div key={idx}>
                    <TextField
                      margin="normal"
                      label={"Step "+ (idx + 1)}
                      onChange={e => updateSteps(e, idx)}
                      fullWidth
                    />
                  </div>
                )
              })}
              <Grid container spacing={2}>
                <Grid item xs={6} margin="normal">
                  <Typography component="h2" variant="h6">
                    Suggested Categories
                  </Typography>
                  <CatSuggestion/>
                </Grid>
                <Grid item xs={6}>
                  <Typography component="h2" variant="h6">
                    Frequently Searched Ingredients
                  </Typography>
                  {freqIngredients.map((ingredients, idx) => (
                    <ListItem key={idx}>
                      <ListItemIcon>
                        <LocalDiningIcon/>
                      </ListItemIcon>
                      <ListItemText primary={capitalizeFirstLetter(ingredients)}/>
                    </ListItem>
                  ))}
                </Grid>
              </Grid>
              <Typography component="h2" variant="h6">
                Select your ingredients
              </Typography>
              <TextField
                margin="normal"
                fullWidth
                placeholder='Search ingredients' 
                onChange={inputHandler}
              />
              <List input={inputText}/>
              {Object.keys(categories).map((category, idx) => {
                return(
                  <div key = {idx}>
                    <Typography component="h2" variant="h6">
                      {capitalizeFirstLetter(category)}
                    </Typography>
                  {
                    categories[category].map((ingredient, idx2) => {
                      return(
                        <div key = {idx2}>
                          <Grid container>
                            <Grid item xs={6}>
                              <Checkbox
                                onChange={() => toggleCategoryIngredients(category, idx2)}
                                type="checkbox"
                                checked={ingredient.check}
                              />
                              {capitalizeFirstLetter(ingredient.text)}
                            </Grid>
                            <Grid item xs={6}>
                              {/* If ingredient is checked */}
                              {ingredient.check
                                ? (<span>
                                    <TextField type="number"
                                      required
                                      name="grams" 
                                      min="0"
                                      label="Amount"
                                      size='small'
                                      onChange={e => updateIngredientValue(e, ingredient.text)}/>
                                    <FormControl required size="small" sx={{ minWidth: 150 }}>
                                      <InputLabel id="ingredientValue">Measurement</InputLabel>
                                      <Select
                                        labelId="ingredientValue"
                                        name="valueType"
                                        onChange={e => updateIngredientMeasurement(e, ingredient.text)}
                                        label="Value"
                                        value={measurementValue(ingredient.text)}
                                      >
                                        <MenuItem name="grams" value="g">Grams</MenuItem>
                                        <MenuItem name="quantities" value="q">Quantitites</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </span>)
                                  : <></>
                                }
                              </Grid>
                            </Grid>
                          </div>
                        )
                      })
                    }
                    </div>
                  )
                })
              }
              <Grid container spacing={2}>
                <Grid item xs={12} margin="normal">
                  <Button
                    name="create"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    xs={6}
                    onClick= {createRecipe}
                    style={{color: "#FFFFFF"}}
                  >
                    <b>Create recipe</b>
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
      </Container>
    </ThemeProvider>
    </>
  );
}

export default RecipeCreate;