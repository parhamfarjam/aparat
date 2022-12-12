import { Box, Button, Flex, FormLabel, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuItem, MenuList, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { IoCheckmark, IoChevronDown, IoCloudUpload, IoLocate, IoPlay, IoTrash, IoWarning } from 'react-icons/io5'
import { categories } from '../data'
import Spinner from './Spinner'

import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import { firebaseApp } from '../firebase-config'
import AlertMsg from './AlertMsg'
import { Editor } from '@tinymce/tinymce-react'
import { fetchUser } from '../utils/fetchUser'
import { useNavigate } from 'react-router-dom'


export default function Create() {
  const { colorMode, toggleColorMode } = useColorMode()
  const bg = useColorModeValue('gray.50' , 'gray.900')
  const textColor = useColorModeValue('gray.900' , 'gray.50')

  const [title,SetTitle] = useState('')
  const [category,setCategory] = useState('choose a category')
  const [location,setLocation] = useState('')
  const [videoAsset,setVideoAsset] = useState(null)
  const [loading,setLoading] = useState(false)
  const [progress,setProgress] = useState(1)
  const [alert,setAlert] = useState(false)
  const [alertMsg,setAlertMsg] = useState('')
  const [alertIcon,setAlertIcon] = useState(null)
  const [alertStatus,setAlertStatus] = useState('')
  const [description,setDecription] = useState('')

  const [userInfo] = fetchUser()

  const storage = getStorage(firebaseApp)
  const firebaseDb = getFirestore(firebaseApp)
  const editorRef = useRef(null);

  const navigate = useNavigate()

 const uploadImage =(e)=>{
  setLoading(true)
  const videofile = e.target.files[0]

  const storageRef = ref(storage, `videos/${Date.now()}-${videofile.name}`)

  const uploadTask = uploadBytesResumable(storageRef,videofile)
  
  uploadTask.on('state_changed',(snapshot)=>{
    const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setProgress(uploadProgress)
  } , (error)=>{console.log(error)},
  ()=>{
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      setVideoAsset(downloadURL)
      setLoading(false)
      setAlert(true)
      setAlertStatus('success')
      setAlertIcon(<IoCheckmark fontSize={20}/>)
      setAlertMsg('your video is uploaded')
      setTimeout(() => {
        setAlert(false)
      }, 3000);
    });
  }
    )
 }
 const deleteImage =()=>{
  const deleteRef = ref(storage ,videoAsset)
  deleteObject(deleteRef).then(()=>{
    setVideoAsset(null)
    setAlert(true)
      setAlertStatus('error')
      setAlertIcon(<IoWarning fontSize={20}/>)
      setAlertMsg('your video is delete')
      setTimeout(() => {
        setAlert(false)
      }, 3000);
  })
    .catch((error=>{
      console.log(error);
    }))
 }
 const getTiny = () => {
  if (editorRef.current) {
    setDecription(editorRef.current.getContent())

  }
};
const uploadDetails = async()=>{
  try {
    setLoading(true)
    if(!title && !category && !videoAsset){
      setAlert(true)
      setAlertStatus('error')
      setAlertIcon(<IoWarning fontSize={20}/>)
      setAlertMsg('your video is delete')
      setTimeout(() => {
        setAlert(false)
      }, 3000);
      setLoading(false)
    }else{
      const data = {
        id: `${Date.now()}`,
        title: title,
        userId: userInfo?.uid,
        category: category,
        location: location,
        videoUrl: videoAsset,
        description: description
      }
      await setDoc(doc(firebaseDb, 'videos',`${Date.now()}`),data)
      setLoading(false)
      navigate('/',{replace : true})
    }
    
  } catch (error) {
    console.log(error);
  }
}
 useEffect(()=>{

 },[title,category,location,description])
 
  return (
    <Flex alignItems={'center'}justifyContent='center'width={'full'}minHeight='100vh'padding={10}>
      <Flex width={'80%'}height={'full'}border='1px'borderColor={'gray.300'}borderRadius='md'p={4}flexDirection='column'alignItems={'center'}justifyContent='center'gap={2}>
        {alert && (
          <AlertMsg status={alertStatus} msg={alertMsg} icon={alertIcon}/>
        )}
        <Input value={title} onChange={(e)=>SetTitle(e.target.value)} variant={'flushed'} placeholder='title'isRequired errorBorderColor='red'type={'text'}_placeholder={{ color : 'gray.500'}}fontSize={20}/>
        <Flex justifyContent={'space-between'}width='full'alignItems={'center'}gap='8'my={4}>
        <Menu>
          <MenuButton as={Button} rightIcon={<IoChevronDown/>} outlineColor={'blue.300'}width='full' >
            {category}
           </MenuButton>
          <MenuList zIndex={101} width='md' shadow={'xl'}>
            {categories && categories.map((data=>(
              <MenuItem key={data.id} onClick={()=>setCategory(data.name)} hover={{bg : 'blackAlpha.300'}} fontSize='20'px={4}>
              {data.iconSrc}{' '}<Text fontSize={18} ml='4'>{data.name}</Text>
              </MenuItem>
            )))}
          </MenuList>
         </Menu>
         <InputGroup>
          <InputLeftElement
            pointerEvents='none'
            children={<IoLocate fontSize={20}/>}
          />
             <Input value={location} onChange={(e)=>setLocation(e.target.value)} variant={'flushed'} placeholder='location'isRequired errorBorderColor='red'type={'text'}_placeholder={{ color : 'gray.500'}}fontSize={20}/>
        </InputGroup>
        </Flex>
        {/*file selection */}
        <Flex border={'1px'}borderColor='gray.500'height={'400px'}borderStyle='dashed'width={'full'}borderRadius='md'overflow={'hidden'}position='relative'>
              {!videoAsset ? 
              <>
              <FormLabel width={'full'}>
                <Flex direction={'column'}alignItems={'center'}justifyContent={'center'}height='full'width={'full'}>
                  <Flex direction={'column'}alignItems={'center'}justifyContent={'center'}height='full'width={'full'} cursor='pointer'>
                  {loading ? (
                  <>
                  <Spinner msg={'upload your video'} progress={progress}/>
                  </>
                  ) : (
                  <>
                    <IoCloudUpload fontSize={25}/>
                    <Text color={textColor}>Clip here to upload</Text>
                  </>)}
                  {!loading && (
                    <input onChange={uploadImage} type={'file'} style={{width: 0 ,height: 0}} accept='video/m4,video/*'/>
                  )}
                  </Flex>
                </Flex>
              </FormLabel>
              </> : <>
              <Flex width={'full'}height='full'justifyContent={'center'}alignItems='center'position={'relative'}>
                  <Flex onClick={deleteImage} width={'40px'}height='40px'justifyContent={'center'}alignItems='center'rounded={'full'}bg='red'top={5}right='5'position={'absolute'}cursor='pointer'zIndex={10}>
                    <IoTrash fontSize={20}/>
                  </Flex>
                  <video src={videoAsset} controls style={{width: '100%', height:'100%'}}/>
              </Flex>
              </>}
        </Flex>
        <Editor
        onChange={getTiny}
        apiKey={process.env.REACT_APP_TINYMCE_API_KEY }
        onInit={(evt, editor) => editorRef.current = editor}
        init={{
          height: 500,
          width: '100%',
          menubar: false,
          skin: 'oxide-dark',
          content_css: 'dark'
        }}
      />
      <Button onClick={()=>uploadDetails()}isLoading={loading}loadingText='uploading'colorScheme={'linkedin'}variant={`${loading ? 'outline' : 'solid'}`}width='xl'fontSize={20}>
        upload
      </Button>
      </Flex>
    </Flex>
  )
}
