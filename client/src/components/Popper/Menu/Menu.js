import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout, reset } from '~/features/auth/authSlice';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import MenuItem from './MenuItem';
import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

function Menu({ children, items = [], hideOnClick = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  const renderItems = () => {
    return items.map((item, index) => (
      <MenuItem
        key={index}
        data={item}
        onClick={item.title === 'Logout' ? onLogout : null}
      />
    ));
  };

  return (
    // Using a wrapper <div> tag around the reference element solves
    // this by creating a new parentNode context.
    <div>
      <Tippy
        interactive
        delay={[0, 700]}
        offset={[0, 15]}
        hideOnClick={hideOnClick}
        placement="bottom-end"
        render={(attrs) => (
          <div className={cx('menu-profile')} tabIndex="-1" {...attrs}>
            <PopperWrapper>{renderItems()}</PopperWrapper>
          </div>
        )}
      >
        {children}
      </Tippy>
    </div>
  );
}

Menu.propTypes = {
  children: PropTypes.node.isRequired,
  items: PropTypes.array,
  hideOnClick: PropTypes.bool,
};

export default Menu;
