'use client'
import Image from 'next/image'
import styles from './page.module.css'
import Landing from '../components/Landing'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, app } from '@/utils/firebase'
import HomePage from '../components/HomePage'
import { useState } from 'react'
import Loading from '@/components/Loading'




export default function Home() {
    const [user, loading, error] = useAuthState(auth)
    

  return (
    <div>
      {user ? <HomePage auth={auth} app={app} /> : ( loading ? <Loading/> : <Landing auth={auth} app={app} />)}
    </div>
  )
}
