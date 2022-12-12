import { Button, Flex, HStack, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import Dj from '../img/dj.jpg'
import {FcGoogle} from 'react-icons/fc'


export default function Login() {
    const firebaseAuth = getAuth(firebaseApp)
    const provider = new GoogleAuthProvider()
    const firebaseDb = getFirestore(firebaseApp)

    const navigate = useNavigate()

    const login = async ()=>{
        const {user} = await signInWithPopup(firebaseAuth,provider)
        const {refreshToken , providerData} = user
         localStorage.setItem('user',JSON.stringify(providerData))
         localStorage.setItem('accessToken',JSON.stringify(refreshToken))

        await setDoc(doc(firebaseDb, 'users', providerData[0].uid),providerData[0])
        navigate('/', {replace : true})
    }
  return (
        <Flex width={'100vw'}height='100vh'justifyContent={'center'}alignItems='center'position={'relative'}>
            <Image objectFit={'cover'} width='full'height={'full'}src={Dj}/>
            <Flex position={'absolute'}width={'100vw'}height='100vh'bg={'blackAlpha.600'}top='0' left={'0'}alignItems={'center'}justifyContent={'center'}>
                <HStack>
                    <Button onClick={()=>login()} leftIcon={<FcGoogle/>} >
                        <Text color={'white'}>login with google</Text>
                    </Button>
                </HStack>
            </Flex>
        </Flex>

  )
}
