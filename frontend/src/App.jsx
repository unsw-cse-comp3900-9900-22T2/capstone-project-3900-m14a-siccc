import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Home from './pages'
import { ChakraProvider } from '@chakra-ui/react'

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
