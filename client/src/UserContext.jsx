import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

export const Context = createContext()

const UserContext = ({children}) => {
    const [user, setUser] = useState(null)
    const [ready, setReady] = useState(false)
    const [fetching, setFetching] = useState(0)

    useEffect(()=>{
        if(!user){
            axios.get("/profile").then(({data})=>{
                setUser(data)
                setReady(true)
            })
        }
    })
  return (
    <Context.Provider value={{user, setUser, ready, setReady, fetching, setFetching}}>
        {children}
    </Context.Provider>
  )
}

export default UserContext