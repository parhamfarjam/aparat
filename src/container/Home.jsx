import { Flex } from '@chakra-ui/react'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Category from '../components/Category'
import Create from '../components/Create'
import Feed from '../components/Feed'
import Navbar from '../components/Navbar'
import Search from '../components/Search'
import UserProfile from '../components/UserProfile'
import VideoPin from '../components/VideoPin'
import VideoPinDetail from '../components/VideoPinDetail'
import {categories} from '../data'

export default function Home({user}) {
  return (
    <>
    <Navbar user={user}/>
    
    <Flex width={'100vw'}>
    <Flex direction={'column'}justifyContent='start'alignItems={'center'}width='5%'>
        {categories && categories.map((data=>
          <Category key={data.id} data={data}/>
          ))}
    </Flex>

    <Flex  width={'95%'} justifyContent='center'alignItems={'center'}>
        <Routes>
            <Route path='/' element={<Feed/>}/>
            <Route path='/category/:categoryId' element={<Feed/>}/> 
            <Route path='/create' element={<Create/>}/>
            <Route path='/search' element={<Search/>}/>
            <Route path='/videoDetali/:videoId' element={<VideoPinDetail/>}/>
            <Route path='/userDetali/:userId' element={<UserProfile/>}/>

        </Routes>
    </Flex>
    </Flex>
    
    </>
  )
}
