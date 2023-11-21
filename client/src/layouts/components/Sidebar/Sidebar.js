import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';

import {
  faGear,
  faHouse,
  faListCheck,
  faStore,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem, faHandshake } from '@fortawesome/free-regular-svg-icons';

import Menu, { MenuItem } from './Menu';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  return (
    <aside className={cx('wrapper')}>
      <Menu>
        <MenuItem
          title="Home"
          to="/"
          icon={<FontAwesomeIcon icon={faHouse}></FontAwesomeIcon>}
        />
        <MenuItem
          title={user.username}
          to={`/profile/${user._id}`}
          image={user.avatar?.url}
        />
        <MenuItem
          title="Settings"
          to="/settings"
          icon={<FontAwesomeIcon icon={faGear}></FontAwesomeIcon>}
        />

        <div className={cx('divider-gray')}></div>
        <div className={cx('route-title')}>My support</div>
        <MenuItem
          title="Payments & Orders"
          to="/payments-orders"
          icon={<FontAwesomeIcon icon={faListCheck}></FontAwesomeIcon>}
        />
        <MenuItem
          title="My Supporters"
          to="/my-supporters"
          icon={<FontAwesomeIcon icon={faUsers}></FontAwesomeIcon>}
        />
        <div className={cx('divider-gray')}></div>
        <div className={cx('route-title')}>More ways to earn</div>
        <MenuItem
          title="Memberships"
          to="/memberships"
          icon={<FontAwesomeIcon icon={faGem}></FontAwesomeIcon>}
        />
        <MenuItem
          title="My Shop"
          to="/my-shop"
          icon={<FontAwesomeIcon icon={faStore}></FontAwesomeIcon>}
        />
        <MenuItem
          title="Commissions"
          to="/commissions"
          icon={<FontAwesomeIcon icon={faHandshake}></FontAwesomeIcon>}
        />
      </Menu>
    </aside>
  );
}

export default Sidebar;
