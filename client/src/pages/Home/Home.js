import classNames from 'classnames/bind';
// React
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';

// scss
import styles from './Home.module.scss';
// components
import CreatePost from '~/components/Post/PostButton/CreatePost';
import PostList from '~/components/Post/PostList';
// features
import { getPosts, reset } from '~/features/posts/postSlice';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import EditProfile from '~/components/Profile/EditProfile';
import { getProfile } from '~/features/profile/profileSlice';
import PaymentMethods from '~/components/Payment/PaymentMethods';

const cx = classNames.bind(styles);

function Home() {
  const [page, setPage] = useState(0);
  const [selectedTab, setSelectedTab] = useState('Payment');
  const tabs = ['Payment', 'Profile'];
  const loadingPostsRef = useRef(false); // reference for API call status

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation hook to get the current location

  const { user, hasCheckedUser } = useSelector((state) => state.auth);
  const { isPostsLoading } = useSelector((state) => state.posts);
  useEffect(() => {
    // Dispatch the reset action when the component mounts
    dispatch(reset());
    dispatch(getProfile(user._id));
  }, [dispatch]);
  useEffect(() => {
    if (location.pathname === `/settings`) {
      navigate(`/settings/payment`);
    }
  }, [location]);
  useEffect(() => {
    const handleScroll = () => {
      if (
        !isPostsLoading &&
        window.innerHeight + document.documentElement.scrollTop + 1 >=
          document.documentElement.scrollHeight
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPostsLoading]);
  useEffect(() => {
    if (hasCheckedUser && !loadingPostsRef.current) {
      loadingPostsRef.current = true; // set loading to true before API call

      if (user) {
        dispatch(getPosts(page)).then(() => {
          loadingPostsRef.current = false; // set loading to false after API call
        });
      }
    }
  }, [page, hasCheckedUser, user, dispatch]);

  const handleTab = (tab) => {
    setSelectedTab(tab);
    navigate(`/settings/${tab.toLowerCase()}`);
  };

  if (!user) {
    return null;
  }

  return (
    <div className={cx('wrapper')}>
      <Routes>
        <Route
          index
          element={
            <>
              <div className={cx('create-post')}>
                <CreatePost />
              </div>
              <PostList />
            </>
          }
        />
        <Route
          index
          path="/settings/:tab"
          element={
            <>
              <div className={cx('settings')}>
                <h1>Settings</h1>
                <div className={cx('settings-tabs')}>
                  {tabs.map((tab, index) => (
                    <div
                      className={cx('tab', {
                        'tab-active': selectedTab === tab,
                      })}
                      key={index}
                      onClick={() => handleTab(tab)}
                    >
                      {tab}
                    </div>
                  ))}
                </div>
                {selectedTab === 'Profile' && <EditProfile settings />}
                {selectedTab === 'Payment' && (
                  <div className={cx('tab-content')}>
                    <PaymentMethods />
                  </div>
                )}
              </div>
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default Home;
