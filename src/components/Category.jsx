import { Box, Button, Flex, Tooltip, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import { categories} from '../data'

export default function Category({data}) {
  const { colorMode} = useColorMode()
  const bg = useColorModeValue('red.500', 'red.200')
  return (
    <Flex cursor={'pointer'} my='5'>
      <Link to={`/category/${data.name}`}>
       <Tooltip hasArrow label={data.name} bg={bg} placement="right-end" closeDelay={300} arrowSize='5'>
       <Box fontSize={25}>{data.iconSrc}</Box>
       </Tooltip>
      </Link>
    </Flex>
  )
}
