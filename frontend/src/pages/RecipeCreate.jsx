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

  // Sends off data of the created recipe to backend
  const createRecipe = () => {
    
    const body = {
      title: title,
      mealType: mealType,
      servings: servings,
      thumbnail: thumbnail,
      cookingTime: cookingTime,
    }
    /*
    apiFetch('POST', 'recipe/new', null, body)
    .then((data) => {
      navigate('/');
    })
    .catch((err) => {
      alert(err);
    });*/
  }

  React.useEffect(() => {
    viewAllIngredients();
  }, []);
  return (
    <>   
      <h1>Create Recipe</h1>
      Title <input type="text" name="title" value={title} onChange={e => setTitle(e.target.value)} /> < br/>

      Servings&nbsp;
      <input type="number"
      name="servings"
      value={servings}
      onChange={e => setServings(e.target.value)}
      /> < br/>

      Cooking Time&nbsp;
      <input type="number"
      name="servings"
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

      <p>Recipe Instructions</p>
      <input type="text"
        name="instructions"
      /> < br/>

      <button name="create" onClick={ createRecipe }>Create</button>
      <button onClick={() => navigate('/')}>Cancel</button>
    </>
  );
}

export default RecipeCreate;