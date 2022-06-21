import React from 'react';
import './App.css';

import AllIngredients from './pages/AllIngredients';
import RecipeDetails from './pages/RecipeDetails';
// import RecipeView from './pages/RecipeView';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element ={<AllIngredients />} path ="/">
          </Route>
          {/*<Route element ={<RecipeView />} path ="/recipe-view/">
          </Route>*/}
          <Route element ={<RecipeDetails />} path ="/recipe-detail/:id">
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
