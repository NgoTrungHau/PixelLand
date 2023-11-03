import { faMugSaucer, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { Link, useLocation } from 'react-router-dom';

import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import Image from '~/components/Image';
import Modal from '~/components/Modals/Modal';
import styles from './ProfileHeader.module.scss';

const cx = classNames.bind(styles);

function ProfileHeader({ id, isAuth, profile }) {
  const location = useLocation();

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
          <Link to={`/${profile._id}`}>
            {profile?.avatar?.url && (
              <Avatar avatar={profile.avatar?.url} profile />
            )}
          </Link>
        </div>
        <div className={cx('info-user')}>
          <div className={cx('info')}>
            <h1>{profile.username}</h1>
            {profile?.followers?.length > 0 && (
              <div className={cx('supporters')}>
                {profile.followers.length + ' Supporters'}
              </div>
            )}

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
              <Button
                btnType="gray-light"
                sz="lg"
                leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
              >
                Follow
              </Button>
            ) : (
              <Modal modalType="editProfile" />
            )}
          </div>
        </div>
      </div>

      <div className={cx('tab-profile')}>
        <Link
          to={`/${id}`}
          className={cx('tab', currentPath === `/${id}` && 'tab-active')}
        >
          About
        </Link>
        {/* <Link
          to={`/${id}/membership`}
          className={cx(
            'tab',
            currentPath === `/${id}/membership` && 'tab-active',
          )}
        >
          Membership
        </Link> */}
        <Link
          to={`/${id}/gallery`}
          className={cx(
            'tab',
            currentPath === `/${id}/gallery` && 'tab-active',
          )}
        >
          Gallery
        </Link>
        <Link
          to={`/${id}/posts`}
          className={cx('tab', currentPath === `/${id}/posts` && 'tab-active')}
        >
          Posts
        </Link>
        <Link
          to={`/${id}/shop`}
          className={cx('tab', currentPath === `/${id}/shop` && 'tab-active')}
        >
          Shop
        </Link>
      </div>
    </div>
  );
}

export default ProfileHeader;
