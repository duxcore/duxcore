import { FC, useContext } from 'react'
import { Loading } from '../modules/Loading/Loading';
import { AuthContext } from '../modules/AuthProvider';

export const Test: FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext.isAuthed) {
    return (
      <div>
        <Loading />
      </div>);
  }

  return (
    <div>
      authed: {JSON.stringify(authContext.isAuthed)} <br />
      metadata: {JSON.stringify(authContext.authMetaData)}
    </div>
  )
}

export default Test;