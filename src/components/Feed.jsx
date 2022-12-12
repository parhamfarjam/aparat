import { Box, SimpleGrid } from '@chakra-ui/react'
import { getFirestore } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { firebaseApp } from '../firebase-config'
import { categoryFeeds, getAllFeeds } from '../utils/fetchData'
import Spinner from './Spinner'
import VideoPin from './VideoPin'

export default function Feed() {
  const firebaseDb = getFirestore(firebaseApp)

 const [loading,setLoading] = useState(false)
 const [feeds,setFeeds] = useState(null)
 const {categoryId} = useParams()


 useEffect(()=>{
  setLoading(true)
  if(categoryId){
    categoryFeeds(firebaseDb, categoryId).then((data)=>{
      setFeeds(data)
      setLoading(false)
    })
  }else{
    getAllFeeds(firebaseDb).then((data)=>{
      setFeeds(data)
      setLoading(false)
    })
  }
 },[categoryId])

  if (loading) return <Spinner/>
  
  return (
    <SimpleGrid minChildWidth='300px' autoColumns={'max-content'} px='2' overflow={'hidden'} spacing='40px' width={'full'}>
      {feeds && feeds.map((data)=>(
        <VideoPin key={data.id} maxWidth={420} height='80px' data={data}/>
      ))}
    </SimpleGrid>
  )
}
