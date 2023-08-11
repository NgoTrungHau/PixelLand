import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import { ModalEditProfile } from '~/components/Modals/EditProfile';

import styles from './Info.module.scss';

const cx = classNames.bind(styles);

function Info({ id, isAuth, profile, dispatch }) {
  return (
    <div className={cx('profile-header')}>
      <div
        className={cx('profile-background')}
        style={{ backgroundImage: `url(${profile.background})` }}
      ></div>
      <div className={cx('info')} key={profile._id}>
        <div className={cx('avatar')}>
          <Link to={`/profile/${profile._id}`}>
            <Avatar avatar={profile.avatar} profile />
          </Link>
        </div>
        <div className={cx('info-user')}>
          <h1>{profile.username}</h1>
          {!isAuth ? (
            <Button primary leftIcon={<FontAwesomeIcon icon={faUserPlus} />}>
              Follow
            </Button>
          ) : (
            <ModalEditProfile />
          )}
        </div>
      </div>
    </div>
  );
}

export default Info;
