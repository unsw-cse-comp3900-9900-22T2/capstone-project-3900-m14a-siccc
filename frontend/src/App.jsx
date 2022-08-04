import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import AllIngredients from './pages/AllIngredients';
import RecipeDetails from './pages/RecipeDetails';
import RecipeCreate from './pages/RecipeCreate';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element ={<AllIngredients />} path ="/">
          </Route>
          <Route element ={<RecipeCreate />} path ="/recipe-create">
          </Route>
          <Route element ={<RecipeDetails />} path ="/recipe-details/:id">
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
