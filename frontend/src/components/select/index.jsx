import React, {useState} from 'react';
import { Select } from '@chakra-ui/react'


function SelectMenu () {
    return(
        <>
            <Select id="categories" placeholder='Ingredient Categories'>
                <option value='dairy and eggs'>dairy and eggs</option>
                <option value='herbs and spices'>herbs and spices</option>
                <option value='meat'>meat</option>
                <option value='oils'>oils</option>
                <option value='poultry'>poultry</option>
                <option value='vegetables'>vegetables</option>
            </Select>
        </>
    )
}

export default SelectMenu