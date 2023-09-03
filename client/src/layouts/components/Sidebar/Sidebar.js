import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';

import { faHouse, faImages, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Sidebar.module.scss';
import Menu, { MenuItem } from './Menu';
import config from '~/config';

const cx = classNames.bind(styles);

function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  const handleMouseEnter = (e) => {
    // console.log('scroll');
    e.target.style.overflowY = 'auto';
  };
  const handleMouseLeave = (e) => {
    // console.log('not scroll');
    e.target.style.overflowY = 'hidden';
  };

  return (
    <aside
      className={cx('wrapper')}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Menu>
        <MenuItem
          title="Home"
          to={config.routes.home}
          icon={<FontAwesomeIcon icon={faHouse}></FontAwesomeIcon>}
        />
        <MenuItem
          title={user.username}
          to={`/profile/${user._id}`}
          image={user.avatar?.url}
        />
        <MenuItem
          divider
          title="Gallery"
          to={config.routes.gallery}
          icon={<FontAwesomeIcon icon={faImages}></FontAwesomeIcon>}
        />
        <MenuItem
          title="Digital Art"
          to={config.routes.digital}
          icon={<FontAwesomeIcon icon={faImage}></FontAwesomeIcon>}
        />
      </Menu>
    </aside>
  );
}

export default Sidebar;
