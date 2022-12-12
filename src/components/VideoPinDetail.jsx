import { Box, Button, Flex, Grid, GridItem, Image, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text } from '@chakra-ui/react'
import { getFirestore } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { IoMdHome, IoMdPause, IoMdPlay, IoMdTrash } from 'react-icons/io'
import { MdForward10, MdFullscreen, MdOutlineReplay10, MdVolumeOff, MdVolumeUp } from 'react-icons/md'
import {FcApproval} from 'react-icons/fc'
import ReactPlayer from 'react-player'
import { Link,useNavigate,useParams } from 'react-router-dom'
import { firebaseApp } from '../firebase-config'
import { deleteVideo, getSpecificVideo, getUserInfo, recommendedFedds } from '../utils/fetchData'
import Spinner from './Spinner'
import Logo from '../img/logo.png'
import screenfull from 'screenfull'
import HTMLReactParser from 'html-react-parser'
import moment from 'moment'
import { fetchUser } from '../utils/fetchUser'
import RecommendedVideo from './RecommendedVideo'

const format = (seconds) =>{
  if(isNaN(seconds)){
    return '00:00'
  }
  const date = new Date(seconds * 1000)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = date.getUTCSeconds().toString().padStart(2, '0')

  if(hh){
    return `${hh}:${mm.toString().padStart(2 , '0')} : ${ss}`
  }
  return `${mm}:${ss}`
}

export default function VideoPinDetail() {
  const [loading,setLoading] = useState(false)
  const [videoInfo,setVideoInfo] = useState(null)
  const [isPlaying,setIsPlaying] = useState(false)
  const [muted,setMuted] = useState(false)
  const [volume,setVolume] = useState(0.5)
  const [played,setPlayed] = useState(0)
  const [seeking,setSeeking] = useState(false)
  const [userInfo,setUserInfo] = useState(null)
  const [feeds,setFeeds] = useState(null)


  const {videoId} = useParams()
  const firebaseDb = getFirestore(firebaseApp)
  const [localUser] = fetchUser()
  const navigate = useNavigate()

  const playerRef = useRef()
  const playerContainer = useRef()

  useEffect(()=>{
    if(videoId){
       setLoading(true)
      getSpecificVideo(firebaseDb,videoId).then((data=>{
        setVideoInfo(data)

        recommendedFedds(firebaseDb , data.category , videoId).then((feed =>{
          setFeeds(feed)
        }))

        getUserInfo(firebaseDb ,data.userId).then((user)=>{
          setUserInfo(user)
        })

        setLoading(false)
      }))
    }
  },[videoId])

  useEffect(()=>{

  },[volume,muted,played])

  const onvolumechange =(e)=>{
    setVolume(parseFloat(e / 100))
    e === 0 ? setMuted(true) : setMuted(false)
  }
  const handleForward = ()=>{
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10)
  }
  const handleBack = ()=>{
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10)
  }
  const handleProgress = (changestate)=>{
    if(!seeking){
      setPlayed(parseFloat(changestate.played / 100) * 100)
    }
  }
  const handleSeekChange = (e)=>{
    setPlayed(parseFloat(e / 100))
  }

  const onSeekMouseDown = (e)=>{
    setSeeking(true)

  }
  const onSeekMouseUp = (e)=>{
    setSeeking(false)
    playerRef.current.seekTo(e / 100)
  }
  const currentTime = playerRef.current ? playerRef.current.getCurrentTime() : '00:00'
  const duration = playerRef.current ? playerRef.current.getDuration() : '00:00'

  const elapseTime = format(currentTime)
  const totalTime = format(duration)

  const deleteTheVideo = (videoId)=>{
    setLoading(true)
    deleteVideo(firebaseDb,videoId)
    navigate('/', {replace : true})
  }

  if(loading) return <Spinner/>
  return (
    <Flex width={'full'}height='auto'justifyContent={'center'}alignItems='center'direction={'column'}py='2'px={'4'}>
        <Flex alignItems={'center'}width='full'my={'4'}>
          <Link to='/'>
            <IoMdHome fontSize={25}/>
          </Link>
          <Box width={'1px'}height='25px'bg={'gray.500'} mx='2'></Box>
          <Text>{videoInfo?.title}</Text>
        </Flex>
        {/*main grif gor video */}
        <Grid templateColumns={'repeat(4,1fr)'} gap='2' width={'100%'}>
          <GridItem width={'100%'}colSpan='3'p='2'>
            <Flex width={'full'} position='relative' ref={playerContainer}>
              <ReactPlayer
              url={videoInfo?.videoUrl}
              height='100'
              width={'100'}
              playing={isPlaying}
              muted={muted}
              volume={volume}
              ref={playerRef}
              onProgress={handleProgress}
              />
              {/*contorols for video */}
              <Flex position={'absolute'}top='0'bottom={'0'}right='0'left={'0'} direction='column' justifyContent='space-between'alignItems={'center'}cursor='pointer'zIndex={1}>
                {/*play icon */}
                <Flex onClick={()=>{setIsPlaying(!isPlaying)}} alignItems={'center'}justifyContent='center'width={'full'}height='full'>
                  {!isPlaying && (
                    <IoMdPlay fontSize={25}/>
                  )}
                </Flex>
                {/*progres controls */}
                <Flex width={'full'}alignItems='center'direction={'column'}px='4'bg='linear(to-t,blackAlpha.900, blackAlpha.500,blackAlpha.50'>
                  <Slider onChange={handleSeekChange}  onMouseDown={onSeekMouseDown} onChangeEnd={onSeekMouseUp} aria-label='slider-ex-4' value={played * 100} min={0}max={100}>
                  <SliderTrack bg={'teal.50'}>
                    <SliderFilledTrack bg={'teal.300'}/>
                  </SliderTrack>
                  <SliderThumb boxSize={3} bg={'teal.300'} />
                    </Slider>
                    {/*other contlores */}
                    <Flex width={'full'} alignItems='center'my={'2'} gap={10}>
                        <MdOutlineReplay10 onClick={handleBack} fontSize={30} cursor='pointer'/>
                        <Box onClick={()=>{setIsPlaying(!isPlaying)}}>
                          {!isPlaying ? <IoMdPlay fontSize={25}/> : <IoMdPause fontSize={25}/>}
                        </Box>
                        <MdForward10 onClick={handleForward} fontSize={30} cursor='pointer'/>
                        {/*volume contlors */}
                        <Flex alignItems={'center'}>
                          <Box onClick={()=>{setMuted(!muted)}}>
                            {!muted ? <MdVolumeUp fontSize={30}/> : <MdVolumeOff fontSize={30}/>}
                          </Box>
                          <Slider onChangeStart={onvolumechange}onChangeEnd={onvolumechange} aria-label='slider-ex-1' defaultValue={volume * 100}min={0}max={'100'} size='sm'width={16}mx='2'>
                           <SliderTrack bg={'teal.50'}>
                           <SliderFilledTrack bg={'teal.300'}/>
                           </SliderTrack>
                           <SliderThumb boxSize={2} bg={'teal.300'} />
                           </Slider>
                        </Flex>
                        {/*time */}
                        <Flex alignItems={'center'}gap='2'>
                          <Text fontSize={'16'}>{elapseTime}</Text>
                          <Text fontSize={'16'}>/</Text>
                          <Text fontSize={'16'}>{totalTime}</Text>
                        </Flex>
                        <Image src={Logo} width='20px' ml={'auto'}/>
                        <MdFullscreen onClick={()=>{screenfull.toggle(playerContainer.current)}} fontSize={'30'}/>
                    </Flex>
                </Flex>
              </Flex>
            </Flex>
            {/*video sescrioption */}
            {
              videoInfo?.description && (
                <Flex my={'6'} direction='column'>
                  <Text fontSize={25} fontWeight='semibold'>Description</Text>
                  {HTMLReactParser(videoInfo?.description)}
                </Flex>
              )
            }
          </GridItem>
          <GridItem width={'100%'}colSpan='1'p='2'>
            {userInfo && (
              <Flex direction={'column'} width='full'>
                <Flex alignItems={'center'} width='full'>
                <Image src={userInfo?.photoURL} width='50px' height={'50px'} rounded='full'/>
                <Flex direction={'column'} ml='3'>
                  <Flex alignItems={'center'}>
                    <Text>{userInfo?.displayName}</Text>
                    <FcApproval />
                  </Flex>
                  {videoInfo?.id && (
                    <Text fontSize={12}>
                       {moment(new Date(parseInt(videoInfo.id)).toISOString()).fromNow()}
                    </Text>
                  )}
                </Flex>
                </Flex>
                {/*action buttons*/}
                <Flex justifyContent={'space-around'} mt={6}>
                    {
                      userInfo?.uid === localUser.uid && (
                        <Box my={5} color='red.300'>
                          <IoMdTrash onClick={()=> deleteTheVideo(videoId)} fontSize={25} cursor='pointer'/>
                        </Box>
                      )
                    } 
                    <a href={videoInfo.videoUrl} onClick={(e)=> e.stopPropagation()} download>
                      <Button colorScheme={'whatsapp'} rounded='full' my={2}>
                        Free download
                      </Button>
                    </a>
                </Flex>
              </Flex>
            )}
          </GridItem>
        </Grid>
          {feeds && (
            <Flex direction={'column'} width='full' my='6'>
              <Text fontWeight={'semibold'}>Recommended Videos</Text>
              <RecommendedVideo feeds={feeds}/>
            </Flex>
          )}
    </Flex>
  )
}
