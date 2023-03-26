import classNames from 'classnames/bind';
import { faHouse, faImages, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Sidebar.module.scss';
import Menu, { MenuItem } from './Menu';
import config from '~/config';

const cx = classNames.bind(styles);

function Sidebar({ data }) {
  return (
    <aside className={cx('wrapper')}>
      <Menu>
        <MenuItem
          title="Home"
          to={config.routes.home}
          icon={<FontAwesomeIcon icon={faHouse}></FontAwesomeIcon>}
        />
        <MenuItem
          title="anasabdin"
          to={config.routes.profile}
          image="https://cdn.pixilart.com/images/user/profile/large/1b3b80606abab6f.webp?v=1677879129"
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
