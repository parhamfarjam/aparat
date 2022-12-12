import { Flex, Progress, Text } from '@chakra-ui/react'
import React from 'react'
import { Circles } from 'react-loader-spinner'
export default function Spinner({msg,progress}) {
  return (
    <Flex
    justifyContent={'center'}
    alignItems='center'
    direction={'column'}
    height='full'
    px={10}
    >
        <Circles color='#008fff' height={80} width={80}/>
        <Text >
            {msg}
        </Text>
        {progress && (
            <Progress
             hasStripe
             
             width='lg'
             isAnimated
             mt={50}
            value={Number.parseInt(progress)} />
        )}
    </Flex>
  )
}
