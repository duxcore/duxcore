// concider this the component where you do auth
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { authModule } from '../modules/authentication'
import styles from '../styles/Home.module.scss'
import { createContext, useState } from 'react'

// creating the context 
export const AuthContext = createContext<{
  // all of these variables should be 
  // defined and given value to in the 
  // default export from this file
  isAuthed: boolean,
  authMetaData: any,
}>({
  isAuthed: false,
  authMetaData: {}
});

// this is the default export, 
// so define all the variables you need in the context
// in this function
export default function Home() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [authMetaData, setAuthMetaData] = useState({});

  return (
    <>
      Index Page
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const authMeta = await authModule.fetchAuthMeta(context);
}
