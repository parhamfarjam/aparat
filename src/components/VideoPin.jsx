import { Flex, Image, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { getFirestore } from 'firebase/firestore'
import moment from 'moment/moment'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { firebaseApp } from '../firebase-config'
import { getUserInfo } from '../utils/fetchData'

export default function VideoPin({data}) {
  const { colorMode } = useColorMode()
  const bg = useColorModeValue('blackAphe.700', 'gray.900')
  const textColor = useColorModeValue('gray.100', 'gray.100')

  const firebaseDb = getFirestore(firebaseApp)

  const [userInfo,setUserInfo] = useState(null)
  const [userId,setUserId] = useState(null)

  
  useEffect(()=>{
    if(data) setUserId(data.userId)
    if(userId) getUserInfo(firebaseDb,userId).then((data)=>{
      setUserInfo(data)
    })
  },[userId])
  return (
    <Flex position={'relative'}justifyContent='space-between'alignItems={'center'}direction='column'cursor={'pointer'}overflow='hidden'maxWidth={'300px'}>
      <Link to={`/videoDetali/${data?.id}`}>
        <video
         src={data.videoUrl} 
         muted
         onMouseOver={(e)=> e.target.play()}
         onMouseOut={(e)=> e.target.pause()}
         />
      </Link>
      <Flex position={'absolute'}bottom='0'left={'0'}p='2'width={'full'}direction='column'bg={bg}>
        <Flex width={'full'}justifyContent='space-between'align={'center'}>
          <Text color={textColor}>{data.title}</Text>
          <Link to={`userDetali/${userId}`}>
          <Image src={userInfo?.photoURL} width='50px' height={'50px'} rounded='full' mt={'-10'}/>
          </Link>
        </Flex>
        <Text fontSize={12} ml={'auto'}>
          {moment(new Date(parseInt(data.id)).toISOString()).fromNow()}
        </Text>
      </Flex>
    </Flex>
  )
}
