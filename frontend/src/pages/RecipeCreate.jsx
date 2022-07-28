import { Grid } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, fileToDataUrl } from '../helpers.jsx';
import { Box } from '@chakra-ui/react'

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
  const [stepsNo, setStepsNo] = React.useState(0);
  const [categories, setCategories] = React.useState({});
  const [ingredientsGram, setIngredientsGram] = React.useState({});

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

    if(!newIngredient[index].check) {
      console.log(newIngredient[index].text)
      delete ingredientsGram[newIngredient[index].text];
    }

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
    console.log(newIngredientsGram);
  }

  // Updates dictionary to grams or in quantities
  function updateIngredientMeasurement (event, ingredientName) {
    console.log(event.target.value);
    const newIngredientsGram = {...ingredientsGram};
    var newValue = '0g';

    // if the ingredient value does exist set value
    if (newIngredientsGram[ingredientName]) {
      console.log(newIngredientsGram[ingredientName]);
      newValue = newIngredientsGram[ingredientName];
    }

    if (event.target.value === 'g'){
      newIngredientsGram[ingredientName] = newValue + "g";
      console.log(true)
    } else if (event.target.value === 'q' && newValue.includes("g")){
      newIngredientsGram[ingredientName] = newValue.replace("g", "");
    }

    setIngredientsGram(newIngredientsGram);
    console.log(newIngredientsGram);
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
    console.log(newSteps);
  }

  // Add the steps and add the number of steps
  const addStepsNo = () => {
    setStepsNo(stepsNo + 1);

    const newSteps = [...steps];
    newSteps.push(0);
    setSteps(newSteps);
  }

  // Delete the steps and minus the number of steps
  const minusStepsNo = () => {
    stepsNo > 0 ? setStepsNo(stepsNo - 1) : setStepsNo(stepsNo);

    const newSteps = [...steps];
    newSteps.pop();
    setSteps(newSteps);
  }

  // Sends off data of the created recipe to backend
  const createRecipe = () => {
    console.log(ingredientsGram);
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
      steps.length === 0)) {
        var message = "Please enter the required information:\n"
        if (title === '') message = message + "- Recipe title\n";
        if (mealType === '') message = message + "- Meal type\n";
        if (servings === '') message = message + "- Number of servings\n";
        if (thumbnail === '') message = message + "- Recipe photo\n";
        if (cookingTime === '') message = message + "- Estimated cooking time\n";
        if (ingredients.length === 0) message = message + "- Ingredients\n";
        if (steps.length === 0) message = message + "- Recipe steps\n";
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
    console.log(freqIngredients)
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
        catSuggestions.push(<div>{categoryName}</div>)
      }
    }
    return(
      <div>
          <h3>Suggested categories of ingredients:</h3>
          {catSuggestions}
      </div>
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
      console.log(categories)
    } catch (err) {
      alert(err.message);
    }
  }

  React.useEffect(() => {
    viewAllIngredients();
    viewFrequentIngredients();
    viewAllIngredientsInCategories();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Grid container direction="row" justifyContent="space-between">
        <Grid item>
          <Box p='6' borderWidth='3px' borderBottomColor='black' padding='100px'>
            <h2>Create Recipe</h2>
            Title <input type="text" name="title" value={title} onChange={e => setTitle(e.target.value)} /> < br/>

            Servings&nbsp;
            <input type="number"
            name="servings"
            min="0"
            value={servings}
            onChange={e => setServings(e.target.value)}
            /> < br/>

            Cooking Time&nbsp;
            <input type="number"
            name="servings"
            min="0"
            value={cookingTime}
            onChange={e => setCookingTime(e.target.value)}
            /> < br/>

            <p>What kind of meal is your recipe?</p>
            <select name="mealType" value={mealType} onChange={e => setMealType(e.target.value)}>
              <option name="empty" value="">Select one</option>
              <option name="breakfast" value="Breakfast">Breakfast</option>
              <option name="lunch" value="Lunch">Lunch</option>
              <option name="dinner" value="Dinner">Dinner</option>
              <option name="entree" value="Entree">Entrée</option>
              <option name="main" value="Main">Main</option>
              <option name="dessert" value="Dessert">Dessert</option>
            </select> < br/>

            <p>Select your recipe photo:</p>
            <input type="file"
            name="thumbnail"
            accept="image/png, image/jpg, image/jpeg"
            onChange={thumbnailUpdate}
            /> < br/>

            {thumbnail !== ''
              ? (<img src={thumbnail} alt="recipe thumbnail" height="140px" width="auto"/>)
              : <></>
            }< br/>
            
            <p>How many steps does your recipe have?</p>
            Steps&nbsp;
            <button name="minus" onClick={minusStepsNo}>&minus;</button>
            <input type="number" min="0" disabled value={stepsNo} />
            <button name="plus" onClick={addStepsNo}>+</button> < br/>

            {steps.map((step, idx) => {
              return (
                <div key={idx}>
                  <>Step {idx + 1}.</>&nbsp;
                  <textarea rows="2" cols="50"
                  onChange={e => updateSteps(e, idx)}>
                  </textarea>
                </div>
              )
            })}

            <CatSuggestion/>

            <h3>Select your ingredients:</h3>
            {ingredients.map((ingredient, idx) => (
              <div key={idx}>
                <label>
                  {ingredient.text}
                  <input
                    onChange={() => toggleIngredients(idx, ingredient.text)}
                    type="checkbox"
                    checked={ingredient.check}
                  />
                </label>

                {/* If ingredient is checked */}
                {ingredient.check
                  ? (<span>
                      <input type="number" 
                        name="grams" 
                        min="0"
                        placeholder='Enter values'
                        onChange={e => updateIngredientValue(e, ingredient.text)}/>

                      <select name="valueType" onChange={e => updateIngredientMeasurement(e, ingredient.text)}>
                        <option name="grams" value="g">grams</option>
                        <option name="quantities" value="q">quantities</option>
                      </select> < br/>
                      
                    </span>)
                    
                  : <></>
                }
              </div>
            ))}

            <button name="create" onClick={ createRecipe }>Create</button>
            <button onClick={() => navigate('/')}>Cancel</button>
          </Box>
        </Grid>
        <Grid item xs = {7}>
          <Grid item padding='20px'>
            <Box p='6' borderWidth='3px' borderBottomColor='black' padding='100px'>
              <h3>Frequently Searched Ingredients</h3>
              {freqIngredients.map((ingredients, idx) => (
                <div key={idx}>
                  <p>
                    {ingredients}
                  </p>
                </div>
              ))}
              </Box>
          </Grid>
        </Grid>
      </Grid>  
    </>
  );
}

export default RecipeCreate;