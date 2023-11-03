import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useParams } from 'react-router-dom';

import CreatePost from '~/components/Post/PostButton/CreatePost';
import PostList from '~/components/Post/PostList';
import ProfileHeader from '~/components/Profile/ProfileHeader';
import { getUser } from '~/features/profile/profileSlice';
import styles from './Profile.module.scss';

const cx = classNames.bind(styles);

function Profile() {
  const { id } = useParams();

  const { auth, profile } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState({});
  const [isAuth, setIsAuth] = useState(true);

  useEffect(() => {
    if (id === auth.user._id) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
      dispatch(getUser(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, auth, dispatch]);

  useEffect(() => {
    if (id === auth.user._id) {
      setUserInfo(auth.user);
    } else {
      setUserInfo(profile.user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.user, id, auth.user]);

  return (
    <div className={cx('wrapper')}>
      <ProfileHeader id={id} isAuth={isAuth} profile={userInfo} />
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
                      <p>{userInfo.bio}</p>
                    </div>
                  </div>
                  <div className={cx('creator-content')}>
                    <CreatePost />
                    <PostList />
                  </div>
                </>
              }
            />
            {/* <Route path="membership" element={<div>Membership</div>} /> */}
            <Route path="gallery" element={<div>Gallery</div>} />
            {/* <Route path="posts" element={<div>Posts</div>} /> */}
            <Route path="shop" element={<div>Shop</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Profile;
