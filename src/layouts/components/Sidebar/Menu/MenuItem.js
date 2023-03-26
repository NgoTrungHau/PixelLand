import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import styles from './Menu.module.scss';
import Image from '~/components/Image';

const cx = classNames.bind(styles);

function MenuItem({ title, to, icon, image, divider = false }) {
  if (divider) {
    return (
      <>
        <div className={cx('divider')}></div>
        <NavLink
          className={(nav) => cx('menu-item', { active: nav.isActive })}
          to={to}
        >
          {icon && <i className={cx('icon')}>{icon}</i>}
          {image && <Image className={cx('image')} src={image} alt="" />}
          <span className={cx('title')}>{title}</span>
        </NavLink>
      </>
    );
  }
  return (
    <NavLink
      className={(nav) => cx('menu-item', { active: nav.isActive })}
      to={to}
    >
      {icon && <i className={cx('icon')}>{icon}</i>}
      {image && <Image className={cx('image')} src={image} alt="" />}
      <span className={cx('title')}>{title}</span>
    </NavLink>
  );
}

MenuItem.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  icon: PropTypes.node,
  image: PropTypes.node,
  divider: PropTypes.bool,
};

export default MenuItem;
