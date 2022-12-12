import { SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import VideoPin from './VideoPin'

export default function RecommendedVideo({feeds}) {
  return (
    <SimpleGrid minChildWidth='300px' autoColumns={'max-content'} px='2' overflow={'hidden'} spacing='40px' width={'full'}>
      {feeds && feeds.map((data)=>(
        <VideoPin key={data.id} maxWidth={420} height='80px' data={data}/>
      ))}
    </SimpleGrid>
  )
}
