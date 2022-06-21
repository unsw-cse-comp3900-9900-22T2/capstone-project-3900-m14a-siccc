import React from 'react';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Flex,
    Button
} from '@chakra-ui/react';

// interface MenuProps {
//     title: string
//     option: list
// }

function DropDown () {
    return (
        <>
            <Flex m="4rem" flexDir="column">
                <Menu>
                    <MenuButton as={Button}>
                        Actions
                    </MenuButton>
                    <MenuList>
                        <MenuItem>Download</MenuItem>
                        <MenuItem>Create a Copy</MenuItem>
                        <MenuItem>Mark as Draft</MenuItem>
                        <MenuItem>Delete</MenuItem>
                        <MenuItem>Attend a Workshop</MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        </>
    )
}

export default DropDown