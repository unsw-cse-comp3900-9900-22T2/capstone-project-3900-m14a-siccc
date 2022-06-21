import React from 'react';
import './App.css';

import AllIngredients from './pages/AllIngredients';
import RecipeView from './pages/RecipeView';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element ={<AllIngredients />} path ="/">
          </Route>
          <Route element ={<RecipeView />} path ="/recipe-view/:id">
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
