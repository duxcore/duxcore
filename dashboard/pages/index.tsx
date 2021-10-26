// concider this the component where you do auth
import { useContext } from 'react'
import { Loading } from '../modules/Loading/Loading'
import { AuthContext } from '../modules/AuthProvider'

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