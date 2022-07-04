import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Home from './pages'
import { ChakraProvider } from '@chakra-ui/react'
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
          <Route element ={<Home />} path ="/test">
          </Route>
        </Routes>
      </Router>
    </>
  );
}

function Test() {
  return (
    <div>test</div>
  )
}

export default App;
