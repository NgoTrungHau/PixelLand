/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from 'classnames/bind';
import Image from '~/components/Image';
import styles from './UserItem.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function UserItem({ className, data }) {
  return (
    <li className={classNames(className)}>
      <div className={cx('wrapper')}>
        <div className={cx('user')}>
          <Link to={`/${data.nickname}`}>
            <Image
              className={cx('avatar')}
              src={data.avatar}
              alt={data.full_name}
            />
          </Link>
          <div className={cx('info')}>
            <Link to={`/${data.nickname}`}>
              <span>
                <span className={cx('name')}>{data.full_name}</span>
                <span className={cx('username')}>{data.nickname}</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}

export default UserItem;
