import React from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, fileToDataUrl } from '../helpers.jsx';

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
    const newValue = newIngredientsGram[ingredientName];
    if (event.target.value === 'g'){
      newIngredientsGram[ingredientName] = newValue + "g";
      console.log(true)
    } else if (event.target.value === 'q'){
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
    if (cookingTime < 0 || servings < 0) {
      alert('Invalid Input');
      return;
    }

    if ((title === '' ||
      mealType === '' ||
      servings === '' ||
      thumbnail === '' ||
      cookingTime === '' ||
      ingredients.length === 0)) {
      
        alert('Empty Input!');
      return;
    }
    const selectedIngredients = [];
    for (const ingredient in ingredients){ 
      if (ingredient.check){
        selectedIngredients.push(ingredient.text);
      }
    }

    const body = {
      recipe: {
        title: title,
        mealType: mealType,
        servings: servings,
        photo: thumbnail,
        timeToCook: cookingTime,
        ingredients: selectedIngredients,
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
          <h4>Suggested categories of ingredients:</h4>
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

//   React.useEffect(() => {
//     viewAllIngredients();
//   }, []);

//   React.useEffect(() => {
//     viewAllIngredientsInCategories();
//   }, []);

  React.useEffect(() => {
    viewAllIngredients();
    viewFrequentIngredients();
    viewAllIngredientsInCategories();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>   
      <h1>Create Recipe</h1>
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
        ? (<img src={thumbnail} alt="recipe thumbnail photo" height="140px" width="auto"/>)
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
            <textarea id="story" name="story"
              rows="2" cols="50">
            </textarea>
          </div>
        )
      })}

      <CatSuggestion/>

      <h4>Select your ingredients:</h4>
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
      <h3 style={{textAlign: "center"}}>Frequently Searched Ingredients</h3>
      {freqIngredients.map((ingredients, idx) => (
        <div key={idx}>
          <p style = {{textAlign: 'center'}}>
            {ingredients}
          </p>
        </div>
      ))}
    </>
  );
}

export default RecipeCreate;