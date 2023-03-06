/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from 'classnames/bind';
import styles from './UserItem.module.scss';

const cx = classNames.bind(styles);

function UserItem() {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('user')}>
        <img
          className={cx('avatar')}
          src="https://cdn.pixilart.com/images/user/profile/large/1b3b80606abab6f.webp?v=1677879129"
          alt="anasabdin"
        />
        <div className={cx('info')}>
          <a href="#">
            <span>
              <span className={cx('name')}>anasabdin</span>
              <span className={cx('username')}>@anasabdin</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default UserItem;
