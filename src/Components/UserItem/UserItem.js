/* eslint-disable jsx-a11y/anchor-is-valid */
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Avatar from '~/components/Avatar';
import styles from './UserItem.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function UserItem({ className, data }) {
  return (
    <li className={classNames(className)}>
      <div className={cx('wrapper')}>
        <div className={cx('user')}>
          <Link to={`/${data.username}`}>
            <Avatar avatar={data.avatar} small />
          </Link>
          <div className={cx('info')}>
            <Link to={`/${data.username}`}>
              <span>
                <span className={cx('name')}>{data.username}</span>
                <span className={cx('username')}>{'@' + data.username}</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}

UserItem.propTypes = {
  data: PropTypes.object,
};

export default UserItem;
