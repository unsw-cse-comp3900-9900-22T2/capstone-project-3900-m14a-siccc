import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Home from './pages'
import { ChakraProvider } from '@chakra-ui/react'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    // <div className="App">
    //   Recipe Recommendation System !
    //   { Menu }
    // </div>
    <ChakraProvider>
    <Router>
      <Routes>
        <Route exact path='/' element={<Home/>}/>
        <Route exact path='/test' element={<Test/>}/>
      </Routes>
    </Router>
    </ChakraProvider>
  );
}

function Test() {
  return (
    <div>test</div>
  )
}

export default App;
