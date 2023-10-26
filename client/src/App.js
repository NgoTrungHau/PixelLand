import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DefaultLayout, { HeaderOnly } from '~/layouts';
import Gallery from '~/pages/Gallery';
import { publicRoutes } from '~/routes';
import { scrollToTop as ScrollToTop } from './hooks';

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
  );
}

export default App;
