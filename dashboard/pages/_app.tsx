import { AppProps } from 'next/dist/shared/lib/router/router'
import { AuthProvider } from '../modules/AuthProvider'
import '../styles/global.css'

function MyApp({ Component, pageProps }: AppProps) {
  const Comp: any = Component;

  console.log(Comp.requiresAuth)
  return (
    <AuthProvider requiresAuth={!!Comp.requiresAuth}>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
