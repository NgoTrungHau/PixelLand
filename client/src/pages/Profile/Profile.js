import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import CreatePost from '~/components/Post/PostButton/CreatePost';
import Info from '~/components/Profile/Info';
import { getUser } from '~/features/profile/profileSlice';
import styles from './Profile.module.scss';
import PostList from '~/components/Post/PostList';

const cx = classNames.bind(styles);

function Profile() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
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
    <div className={cx('profile')}>
      <Info id={id} isAuth={isAuth} profile={userInfo} dispatch={dispatch} />
      <div className={cx('container')}>
        <div className={cx('content')}>
          <div className={cx('about')}>
            <div className={cx('detail')}>
              <h2>About</h2>
              <p>{userInfo.bio}</p>
            </div>
          </div>
          <div className={cx('post')}>
            <CreatePost />
            <PostList user_id={user._id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
