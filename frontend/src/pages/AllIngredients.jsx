import React from 'react';
import { apiFetch } from '../helpers.jsx';
import { useNavigate } from 'react-router-dom';

const AllIngredients = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = React.useState([]);
  const [recipes, setRecipes] =  React.useState([]);
  const [categories, setCategories] = React.useState({});

  // Displays all Ingredients
  const viewAllIngredients = async () => {
    try {
      console.log(ingredients);
      const ingredientList = [];
      const ingredientData = await apiFetch('GET', `ingredients/view`, null);

      // Sets a list of dictionary of ingredients
      if (ingredients.length === 0) {
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

  // Function to set ingrdients selected
  function toggleIngredients (index) {
    const newIngredient = [...ingredients];
    newIngredient[index].check = !ingredients[index].check;
    setIngredients(newIngredient);
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
      
      // If user clicks search
      if (clicked) {
        localStorage.setItem('categories', JSON.stringify(categories));
        for (const [, ingredients] of Object.entries(categories)) {
          console.log(ingredients)
          for (const ingredient of ingredients) {
            if (ingredient.check){
              selectedIngredients.push(ingredient.text);
            }
          }
        }
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
      // Maytches recipe to selected ingredients
      const body = {
        ingredients: selectedIngredients,
      }
      const recipeData = await apiFetch('POST', `recipe/view`, null, body);
      setRecipes(recipeData.recipes);
      console.log(recipeData.recipes);
    
      console.log('here');

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

    /*const newIngredient = [...ingredients];
    console.log(newCategory[category][index].text)
    for (const ingredient of ingredients) {
      if (newCategory[category][index].text === ingredient.text){
        const allIngreIdx = ingredients.indexOf(ingredient);
        newIngredient[allIngreIdx].check = !ingredients[allIngreIdx].check;
        break;

      }
    }
    setIngredients(newIngredient);*/
    console.log(ingredients)
    console.log(newCategory)
  }

  React.useEffect(() => {
    
    console.log(Object.keys(JSON.parse(localStorage.getItem('categories'))).length);
    //Object.keys(JSON.parse(localStorage.getItem('categories'))).length != 0
    const dicLen = Object.keys(JSON.parse(localStorage.getItem('categories'))).length;
    if (localStorage.getItem('categories') && dicLen !== 0) {
      setCategories(JSON.parse(localStorage.getItem('categories')));
      recipeMatch(false);
      console.log("ssssss")
    } else {
      viewAllIngredientsInCategories();
      console.log("nnnnnn")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <p>hello</p>
      <button name="allIngredients" onClick={viewAllIngredients}>All Ingredients</button>
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

      {/*<button name="categoryView" onClick={viewAllIngredientsInCategories}>Category View</button>*/}
      <h2>Select your ingredients</h2>
      {
        Object.keys(categories).map((category, idx) => {
          return(
            <div key = {idx}>
              <h1>
                {category}
              </h1>
            {
              categories[category].map((ingredient, idx2) => {
                return(
                  <div key = {idx2}>
                    <label>
                      {ingredient.text}
                      <input
                        onChange={() => toggleCategoryIngredients(category, idx2)}
                        type="checkbox"
                        checked={ingredient.check}
                      />
                    </label>
                  </div>
                )
              })
            }
            </div>
          )
        })
      }
      <button name="search" onClick={(e)=> {recipeMatch(true)}}>Search</button>
      {recipes.length !== 0
        ? <div>{recipes.map((recipe, idx) => {
          return (
            <div key={idx}>
              <div>{recipe.photo}</div>
              <h1 onClick={() => navigate(`/recipe-details/${recipe.recipeID}`)}>{recipe.title}</h1>
              <p>ingredients: {recipe.ingredients}</p>
              <hr></hr>
            </div>
          )
        }) }</div>
        : <h1>No Available Recipes</h1>
      }
      
    </>
  );
}

export default AllIngredients;