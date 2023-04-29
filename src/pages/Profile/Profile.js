import classNames from 'classnames/bind';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Profile.module.scss';
import Info from '~/components/Profile/Info';
import PostForm from '~/components/Post/PostForm';
import { getUser } from '~/features/profile/profileSlice';

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
  }, [profile.user, id]);

  return (
    <div className={cx('profile')}>
      <Info id={id} isAuth={isAuth} profile={userInfo} dispatch={dispatch} />
      <div className={cx('container')}>
        <div className="row">
          <div className="col-sm-12 col-md-3 col-lg-3 ">
            <div className={cx('detail')}>
              <h2>About</h2>
              <p>{userInfo.bio}</p>
            </div>
          </div>
          <div className="col-sm-12 col-md-10 col-lg-9">
            <PostForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
