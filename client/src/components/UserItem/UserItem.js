/* eslint-disable jsx-a11y/anchor-is-valid */
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Avatar from '~/components/Avatar';
import styles from './UserItem.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function UserItem({ className, user }) {
  return (
    <li className={classNames(className)}>
      <div className={cx('wrapper')}>
        <Link to={`/${user._id}`}>
          <div className={cx('user')}>
            <Avatar avatar={user.avatar?.url} small />
            <div className={cx('info')}>
              <span>
                <span className={cx('name')}>{user.username}</span>
                <span className={cx('username')}>{'@' + user.username}</span>
              </span>
            </div>
          </div>
        </Link>
      </div>
    </li>
  );
}

UserItem.propTypes = {
  user: PropTypes.object,
};

export default UserItem;
