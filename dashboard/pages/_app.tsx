import { AuthProvider } from '../modules/AuthProvider'
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  console.log(Component.requiresAuth)
  return (
    <AuthProvider requiresAuth={!!Component.requiresAuth}>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
