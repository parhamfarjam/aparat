import { Button, Flex, Image, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuItem, MenuList, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {IoMdAdd, IoMdMoon, IoMdSearch, IoMdSunny} from 'react-icons/io'
import {IoChevronDown, IoLogOut} from 'react-icons/io5'

import Logo from '../img/logo.png'

export default function Navbar({user}) {
  const { colorMode, toggleColorMode } = useColorMode()
  const bg = useColorModeValue('red.500', 'red.200')
  const navigate = useNavigate()


  return (
    <Flex justifyContent={'space-between'}alignItems='center'width={'100cw'}p='4'>
      <Link to='/'>
        <Image src={Logo} width='30px'/>
      </Link>
      <InputGroup mx={6} width='60vw'>
      <InputLeftElement
      pointerEvents='none'
      children={<IoMdSearch fontSize={25}/>}
     />
     <Input type='search' placeholder='serach...' variant={'filled'} />
     </InputGroup>
     <Flex alignItems={'center'} justifyContent='center'>
        <Flex onClick={toggleColorMode} width={'40px'}height='40px'justifyContent={'center'}alignItems='center'cursor={'pointer'}borderRadius='5'>
          {colorMode == 'light' ? <IoMdMoon fontSize={25}/> : <IoMdSunny fontSize={25}/>} 
        </Flex>
        {/*create btns */}
        <Link to='create'>
          <Flex justifyContent={'center'}alignItems='center' bg={bg} width={'40px'}height='40px' borderRadius={4} mx='6'_hover={{shadow : 'md'}}transition='ease-in-out'transitionDuration={'0.3s'}>
            <IoMdAdd fontSize={25} color={`${colorMode == 'dark' ? '#111' : '#f1f1f1'}`}/>
          </Flex>
        </Link>
        <Menu>
          <MenuButton rightIcon={<IoChevronDown />}>
            <Image src={user?.photoURL}width={'40px'}height='40px' rounded={'full'}/>
          </MenuButton>
          <MenuList shadow={'lg'}>
           <Link to={`userDetali/${user.uid}`}>
            <MenuItem>My account</MenuItem>
           </Link>
           <MenuItem onClick={()=>{
            localStorage.clear()
             navigate('/login', {replace : true})
            }}
              flexDirection={'row'} gap='5' >log out<IoLogOut fontSize={20}/> </MenuItem>
          </MenuList>
        </Menu>
     </Flex>
    </Flex>
  )
}
