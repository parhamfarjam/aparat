import React, { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Home from './container/Home'
import Login from './container/Login'
import { fetchUser, userAccessToken } from './utils/fetchUser'

export default function App() {
    const [user,setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(()=>{
        const accessToken = userAccessToken()
        if(!accessToken){
            navigate('/login',{replace : true})
        }else{
            const [userinfo] = fetchUser()
            setUser(userinfo)
        }
    })
  return (
    <div>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/*' element={<Home user={user}/>}/>
      </Routes>
    </div>
  )
}
