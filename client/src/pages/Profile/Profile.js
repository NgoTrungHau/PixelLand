import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';

import CreatePost from '~/components/Post/PostButton/CreatePost';
import PostList from '~/components/Post/PostList';
import ProfileHeader from '~/components/Profile/ProfileHeader';
import { getUser } from '~/features/profile/profileSlice';
import styles from './Profile.module.scss';
import { getUserPosts } from '~/features/posts/postSlice';
import { ArtList } from '~/components/Art';
import { getUserArts } from '~/features/arts/artSlice';

const cx = classNames.bind(styles);

function Profile() {
  const { id } = useParams();
  const [page, setPage] = useState(0);
  const location = useLocation();

  const currentPath = location.pathname; //
  const loadingUsersRef = useRef(false); // reference for API call status
  const loadingPostsRef = useRef(false); // reference for API call status
  const loadingArtsRef = useRef(false); // reference for API call status

  const dispatch = useDispatch();
  const { user, hasCheckedUser } = useSelector((state) => state.auth);
  const { isPostsLoading } = useSelector((state) => state.posts);
  const { isArtsLoading } = useSelector((state) => state.arts);

  const { profile } = useSelector((state) => state.profile);

  const [isAuth, setIsAuth] = useState(true);
  useEffect(() => {
    if (id === user._id) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, [id, user]);
  useEffect(() => {
    if (hasCheckedUser && !loadingUsersRef.current) {
      loadingUsersRef.current = true; // set loading to true before API call

      dispatch(getUser(id)).then(() => {
        loadingUsersRef.current = false; // set loading to false after API call
      });
    }
  }, [id, hasCheckedUser, dispatch]);

  useEffect(() => {
    setPage(0);
  }, [currentPath]);
  useEffect(() => {
    const handleScroll = () => {
      if (
        (!isPostsLoading || !isArtsLoading) &&
        window.innerHeight + document.documentElement.scrollTop + 1 >=
          document.documentElement.scrollHeight
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPostsLoading, isArtsLoading]);
  useEffect(() => {
    if ((!loadingPostsRef.current || !loadingArtsRef.current) && profile) {
      if (currentPath === `/${id}/posts`) {
        loadingPostsRef.current = true; // set loading to true before API call

        dispatch(getUserPosts({ profile_id: id, page: page })).then(() => {
          loadingPostsRef.current = false; // set loading to false after API call
        });
      }
      if (currentPath === `/${id}/gallery`) {
        loadingArtsRef.current = true; // set loading to true before API call

        dispatch(getUserArts({ profile_id: id, page: page })).then(() => {
          loadingArtsRef.current = false; // set loading to false after API call
        });
      }
    }
  }, [currentPath, id, profile, page, user, dispatch]);

  return (
    <div className={cx('wrapper')}>
      <ProfileHeader id={id} isAuth={isAuth} profile={profile} />
      <div className={cx('container')}>
        <div className={cx('content')}>
          <Routes>
            <Route
              index
              element={
                <>
                  <div className={cx('about')}>
                    <div className={cx('detail')}>
                      <h2>About</h2>
                      <p>{profile?.bio}</p>
                    </div>
                  </div>
                  <div className={cx('intro')}>
                    <div className={cx('detail')}>Profile Intro</div>
                  </div>
                </>
              }
            />
            {/* <Route path="membership" element={<div>Membership</div>} /> */}
            <Route path="gallery" element={<ArtList profile />} />
            <Route
              path="posts"
              element={
                <div className={cx('creator-content')}>
                  {id === user?._id && <CreatePost />}
                  <PostList />
                </div>
              }
            />
            <Route path="shop" element={<div>Shop</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Profile;
