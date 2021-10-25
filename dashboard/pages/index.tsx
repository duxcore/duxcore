import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { authModule } from '../modules/authentication'
import styles from '../styles/Home.module.scss'

export default function Home() {
  return (
    <>
      Index Page
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const authMeta = await authModule.fetchAuthMeta(context);
}
