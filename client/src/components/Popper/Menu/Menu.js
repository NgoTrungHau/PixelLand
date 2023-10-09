import PropTypes from 'prop-types';
// classNames
import classNames from 'classnames/bind';
// react
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { cloneElement, useState } from 'react';
import Tippy from '@tippyjs/react/headless';

// css
import styles from './Menu.module.scss';
// component
import { Wrapper as PopperWrapper } from '~/components/Popper';
import MenuItem from './MenuItem';
// features
import { logout, reset } from '~/features/auth/authSlice';

const cx = classNames.bind(styles);

function Menu({ children, className, items = [], offset }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // show-hide when clicked
  const [isClicked, setClicked] = useState(false);

  const handleClick = () => setClicked(!isClicked);

  // logout
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
        onClick={() => {
          if (item.title === 'Logout') {
            onLogout();
          }
          setClicked(false);
        }}
      />
    ));
  };
  const childrenWithProps = cloneElement(children, {
    onClick: handleClick,
  });

  return (
    // Using a wrapper <div> tag around the reference element solves
    // this by creating a new parentNode context.
    <div className={className}>
      <Tippy
        interactive
        delay={[0, 700]}
        offset={offset}
        visible={isClicked}
        onClickOutside={() => setClicked(false)}
        placement="bottom-end"
        render={(attrs) => (
          <div className={cx('menu-profile')} tabIndex="-1" {...attrs}>
            <PopperWrapper>{renderItems()}</PopperWrapper>
          </div>
        )}
      >
        {childrenWithProps}
      </Tippy>
    </div>
  );
}

Menu.propTypes = {
  children: PropTypes.node.isRequired,
  classNames: PropTypes.string,
  items: PropTypes.array,
  hideOnClick: PropTypes.bool,
};

export default Menu;
