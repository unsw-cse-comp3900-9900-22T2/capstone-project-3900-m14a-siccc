import React from "react";
//import './App.css';
import SearchButton from '../components/button'
import SelectMenu from '../components/select'
import { useState } from "react";
import { Input } from '@chakra-ui/react'
import data from "../components/search/data.json"
import { Select } from "@chakra-ui/react"

function Home() {
  const [inputText, setInputText] = useState("");
  const [inputCat, setInputCat] = useState("");
  const [inputCheck, setInputCheck] = useState([]);
  
  let inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };
  
  function recordInputCat(e) {
    setInputCat(e.target.value);
  };

  function recordInputCheck(e) {

  }


  return (
    <div className="App">
      Recipe Recommendation System
      <Select id="categories" placeholder='Ingredient Categories' value="" onChange={recordInputCat}>
          <option value='dairy and eggs'>dairy and eggs</option>
          <option value='herbs and spices'>herbs and spices</option>
          <option value='meat'>meat</option>
          <option value='oils'>oils</option>
          <option value='poultry'>poultry</option>
          <option value='vegetables'>vegetables</option>
      </Select>
      <CatList input={inputCat}/>
      <Input variant="outline" placeholder='Search ingredients' onChange={inputHandler}/>
      <List input={inputText}/>
      <SearchButton/>

    </div>
  );
}

function List(props) {
  const filteredData = data.filter((el) => {
    if (props.input === '') {  
      return null;
    }
    else {
        return el.name.toLowerCase().includes(props.input)
    }
  })
  return (
    <ul>
      {filteredData.map((item) => (
        <li key={item.id}>
        <input value={item.name} type="checkbox"/>
        <span>{item.name}</span>
        </li>
      ))}
    </ul>
  )
}

function CatList(props) {
  const filteredData = data.filter((el) => {
    if (props.input === "") {  
      return null;
    }
    else {
      return el.category.toLowerCase().includes(props.input)
    }
  })
  return (
    <ul>
      <input value={props.input}/>
      {filteredData.map((item) => (
        <li key={item.id}>
          <input value={item.name} type="checkbox"/>
          <span>{item.name}</span>
        </li>
      ))}
    </ul>
  )
}

export default Home;
