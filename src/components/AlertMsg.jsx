import { Alert, AlertTitle } from '@chakra-ui/react'
import React from 'react'

export default function AlertMsg({status,msg,icon}) {
  return (
    <div>
       <Alert status={`${status ? status : 'info'}`}>
    {icon}
    <AlertTitle ml={10}>{msg}</AlertTitle>
  </Alert>
    </div>
  )
}
