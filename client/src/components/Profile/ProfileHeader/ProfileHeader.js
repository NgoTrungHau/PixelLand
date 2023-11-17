import classNames from 'classnames/bind';
// React
import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Font awesome
import {
  faMugSaucer,
  faUserCheck,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// scss
import styles from './ProfileHeader.module.scss';
// components
import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import Image from '~/components/Image';
import Modal from '~/components/Modals/Modal';
// features
import { ProfileContext } from '~/pages/Profile/Profile';

const cx = classNames.bind(styles);

function ProfileHeader({ id, isAuth, profile }) {
  const location = useLocation();
  const { isFollow, handleFollow } = useContext(ProfileContext);

  const currentPath = location.pathname; //

  return (
    <div className={cx('profile-header')}>
      <div className={cx('profile-background')}>
        <div className={cx('back-ground')}>
          {profile?.background?.url && (
            <Image src={profile.background?.url} alt="" />
          )}
        </div>
      </div>
      <div className={cx('profile-user')} key={profile._id}>
        <div className={cx('avatar')}>
          {profile?.avatar?.url && (
            <Avatar avatar={profile.avatar?.url} to={profile._id} profile />
          )}
        </div>
        <div className={cx('info-user')}>
          <div className={cx('info')}>
            <h1>{profile.username}</h1>
            {/* {profile?.followers?.length > 0 && (
              <div className={cx('supporters')}>
                {profile.followers.length + ' Supporters'}
              </div>
            )} */}

            {profile?.followers?.length > 0 && (
              <div className={cx('followers')}>
                {profile.followers.length + ' Followers'}
              </div>
            )}
          </div>
          <div className={cx('profile-btns')}>
            {profile?.contributor && (
              <Button
                btnType="red"
                sz="lg"
                leftIcon={<FontAwesomeIcon icon={faMugSaucer} />}
              >
                Donate
              </Button>
            )}
            {!isAuth ? (
              !isFollow ? (
                <Button
                  btnType="gray-light"
                  sz="lg"
                  leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
                  onClick={handleFollow}
                >
                  Follow
                </Button>
              ) : (
                <Button
                  btnType="gray-light"
                  sz="lg"
                  leftIcon={<FontAwesomeIcon icon={faUserCheck} />}
                  onClick={handleFollow}
                ></Button>
              )
            ) : (
              <Modal modalType="editProfile" />
            )}
          </div>
        </div>
      </div>

      <div className={cx('tab-profile')}>
        <Link
          to={`/profile/${id}`}
          className={cx(
            'tab',
            currentPath === `/profile/${id}` && 'tab-active',
          )}
        >
          About
        </Link>
        {/* <Link
          to={`/profile/${id}/membership`}
          className={cx(
            'tab',
            currentPath === `/profile/${id}/membership` && 'tab-active',
          )}
        >
          Membership
        </Link> */}
        <Link
          to={`/profile/${id}/gallery`}
          className={cx(
            'tab',
            currentPath === `/profile/${id}/gallery` && 'tab-active',
          )}
        >
          Gallery
        </Link>
        {/* <Link
          to={`/profile/${id}/posts`}
          className={cx('tab', currentPath === `/profile/${id}/posts` && 'tab-active')}
        >
          Posts
        </Link> */}
        {/* <Link
          to={`/profile/${id}/shop`}
          className={cx('tab', currentPath === `/profile/${id}/shop` && 'tab-active')}
        >
          Shop
        </Link> */}
      </div>
    </div>
  );
}

export default ProfileHeader;
