import { Fragment, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

import { publicRoutes } from '~/routes';
import { scrollToTop as ScrollToTop } from './hooks';
import Gallery from '~/pages/Gallery';
import DefaultLayout, { HeaderOnly } from '~/layouts';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
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
            {
              Page = Gallery;
            }
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
  );
}

export default App;
