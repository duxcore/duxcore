// concider this the component where you do auth
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useContext } from 'react'
import { Loading } from '../modules/Loading/Loading'
import { authModule } from '../modules/authentication'
import { AuthContext } from '../modules/AuthProvider'
import styles from '../styles/Home.module.scss'



export default function Home() {
  const authContext = useContext(AuthContext);
  if (!authContext.isAuthed) {
    return (
      <div>
        <Loading />
      </div>);
  }
  return (
    <>
      Index Page
    </>
  )
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const authMeta = await authModule.fetchAuthMeta(context);
// }