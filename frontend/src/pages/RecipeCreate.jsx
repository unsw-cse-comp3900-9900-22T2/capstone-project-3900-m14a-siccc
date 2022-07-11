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

  function toggleIngredients (index) {
    const newIngredient = [...ingredients];
    newIngredient[index].check = !ingredients[index].check;
    setIngredients(newIngredient);
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
      const count = 0;
      for (const ingredient of freqIngredientData) {
        if(count < 5) {
          freqIngredientList.push(ingredient);
        }
        count = count + 1
      }
      setFreqIngredients(freqIngredientList);
    } catch (err) {
      alert(err.message);
    }
    console.log(freqIngredients)
  }

  React.useEffect(() => {
    viewAllIngredients();
    viewFrequentIngredients();
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
      <h3 style={{textAlign: "center"}}>Frequently Searched Ingredients</h3>
      {freqIngredients.map((ingredients, idx) => (
        <div key={idx}>
          <p style = {{textAlign:"center"}}>
            {ingredients}
          </p>
        </div>
      ))}
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

      <p>Select your ingredients:</p>
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
      ))}

      <button name="create" onClick={ createRecipe }>Create</button>
      <button onClick={() => navigate('/')}>Cancel</button>
    </>
  );
}

export default RecipeCreate;