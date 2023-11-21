// React
import { Fragment, useEffect, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import images from '~/assets/images';
import { publicRoutes } from '~/routes';
// components
import Image from './components/Image';
import DefaultLayout, { HeaderOnly } from '~/layouts';
import Gallery from '~/pages/Gallery';
// features
import { loadUser, logout, refreshToken } from './features/auth/authSlice';
import { scrollToTop as ScrollToTop } from './hooks';

function App() {
  const initialOptions = {
    clientId:
      'AYq5yDFtkGSDBjqcMpkXg9WXuLgw6FZOLWMbFRle9AI9Ib8sA_J1_K2ALbyhdZNtGnGYaw7yHbpGm6kC',
    currency: 'USD',
    intent: 'capture',
  };
  const dispatch = useDispatch();
  const loadingUserRef = useRef();

  const { user, isLoadingUser } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!loadingUserRef.current) {
      loadingUserRef.current = true; // set loading to true before API call
      dispatch(loadUser()).then(() => {
        loadingUserRef.current = false; // set loading to false after API call
        dispatch(refreshToken()).then((res) => {
          if (refreshToken.rejected.match(res)) {
            dispatch(logout());
          }
        });
      });
    }
  }, [dispatch]);
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        dispatch(refreshToken()).then((res) => {
          // check if refreshToken has been rejected
          if (refreshToken.rejected.match(res)) {
            // if yes, then dispatch logOut action
            dispatch(logout());
          }
        });
      } // Dispatch the refreshToken action every minute
    }, 60 * 5000); // 60 * 1000 ms == 1 minute

    return () => clearInterval(interval); // cleanup on unmount
  }, [dispatch, user]);
  if (isLoadingUser) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ width: '100vw', height: '100vh' }}
      >
        <Image alt="" src={images.logo} width="70" height="60" />
      </div>
    );
  }
  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            let Page = route.component;
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            if (!user) {
              Layout = HeaderOnly;
              Page = Gallery;
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <ScrollToTop />
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
        <ToastContainer />
      </div>
    </PayPalScriptProvider>
  );
}

export default App;
