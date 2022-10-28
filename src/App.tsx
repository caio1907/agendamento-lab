import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Loader from './components/Loader';
import Login from './screens/Login';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './services/firebase';
import { loadCurrentUser } from './utils/user';
import { setLoading } from './utils/loadingState';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import screens from './screens';
import Layout from './components/Layout';

const App:React.FC = () => {

  const [logged, setLogged] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, result => {
      if(result) {
        loadCurrentUser()
        .finally(() => {
          setLogged(true);
          setLoading(false)
        });
      } else {
        setLogged(false)
        setLoading(false)
      }
    })
  }, []);

  const logOut = () => {
    signOut(auth);
  }

  return (
    <BrowserRouter>
      <Loader/>
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT}/>
      {!logged ? (
        <Routes>
          <Route path='/' element={<Login/>}/>
        </Routes>
      ) : (
        <>
          <Layout {...{logOut}}>
            <Routes>
              {screens.map((screen, index) => (
                <Route
                  key={index}
                  path={screen.path}
                  element={screen.component}
                />
              ))}
            </Routes>
          </Layout>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
