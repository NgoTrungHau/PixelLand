import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './Info.module.scss';
import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import Modal from '~/components/Modals/Modal';

const cx = classNames.bind(styles);

function Info({ id, isAuth, profile, dispatch }) {
  return (
    <div className={cx('profile-header')}>
      <div
        className={cx('profile-background')}
        style={{ backgroundImage: `url(${profile.background?.url})` }}
      ></div>
      <div className={cx('info')} key={profile._id}>
        <div className={cx('avatar')}>
          <Link to={`/profile/${profile._id}`}>
            <Avatar avatar={profile.avatar?.url} profile />
          </Link>
        </div>
        <div className={cx('info-user')}>
          <h1>{profile.username}</h1>
          {!isAuth ? (
            <Button primary leftIcon={<FontAwesomeIcon icon={faUserPlus} />}>
              Follow
            </Button>
          ) : (
            <Modal modalType="editProfile" />
          )}
        </div>
      </div>
    </div>
  );
}

export default Info;
