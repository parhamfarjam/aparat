import { Flex, Image } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Spinner from './Spinner'
import Dj from '../img/dj.jpg'
import { useParams } from 'react-router-dom'
import { getUserInfo, userUploadedVideos } from '../utils/fetchData'
import { getFirestore } from 'firebase/firestore'
import { firebaseApp } from '../firebase-config'
import RecommendedVideo from './RecommendedVideo'

export default function UserProfile() {
  const { userId} = useParams()
  const [isloading,setIsloading] = useState(false)
  const [userInfo,setUserInfo] = useState(null)
  const [feeds,setFeeds] = useState(null)


  const firebaseDb = getFirestore(firebaseApp)

  useEffect(()=>{
    setIsloading(true)
    if(userId){
      getUserInfo(firebaseDb , userId).then((user)=>{
        setUserInfo(user)
        
      })
      userUploadedVideos(firebaseDb, userId).then((feed)=>{
        setFeeds(feed)
      })
      setIsloading(false)
    }
  },[userId])

    if(isloading) return <Spinner/>
  return (
    <Flex alignItems={'center'}justifyContent='center'width={'full'}height='auto'p={2}direction='column'>
      <Flex justifyContent={'center'}alignItems='center'width={'full'}position='relative'direction={'column'}>
        <Image src={Dj} height={'320px'} width='full' objectFit={'cover'} borderRadius={'md'}/>
        <Image src={userInfo?.photoURL} width='120px'objectFit={'cover'}border='2px'borderColor={'gray.100'}rounded='full'shadow={'lg'} mt='-16'/>
      </Flex>
      {feeds && (
            <Flex direction={'column'} width='full' my='6'>
              <RecommendedVideo feeds={feeds}/>
            </Flex>
          )}
    </Flex>
  )
}
