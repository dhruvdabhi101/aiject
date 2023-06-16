'use client'
import Image from 'next/image'
import styles from './page.module.css'
import Landing from '../components/Landing'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, app } from '@/utils/firebase'
import HomePage from '../components/HomePage'




export default function Home() {

  const [user] = useAuthState(auth)
  return (
    <div>
      {user ? <HomePage auth={auth} app={app} /> : <Landing auth={auth} app={app} />}
    </div>
  )
}
