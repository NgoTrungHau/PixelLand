import PropTypes from 'prop-types';
// classNames
import classNames from 'classnames/bind';
// react
import { forwardRef } from 'react';
import { Link, NavLink } from 'react-router-dom';

// css
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

const Button = forwardRef(
  (
    {
      to,
      href,
      type,
      disabled,
      navlink = false,
      btnType,
      login = false,
      signup = false,
      upload = false,
      up = false,
      rounded = false,
      children,
      className,
      sz,
      image,
      leftIcon,
      rightIcon,
      onClick,
      passProps,
    },
    ref,
  ) => {
    let CompBut = 'button';
    let classN = cx('wrapper', sz, btnType, {
      [className]: className,
      login,
      signup,
      upload,
      rounded,
      up,
    });
    const props = {
      onClick,
      type,
      disabled,
      ...passProps,
    };

    if (to) {
      if (navlink) {
        CompBut = NavLink;
        classN = (nav) =>
          cx('wrapper', sz, btnType, {
            [className]: className,
            rounded,
            up,
            active: nav.isActive,
          });
      } else {
        CompBut = Link;
      }

      props.to = to;
    } else if (href) {
      props.href = href;
      CompBut = 'a';
    }
    const classes = classN;
    return (
      <CompBut ref={ref} className={classes} {...props}>
        {leftIcon && <i className={cx('icon')}>{leftIcon}</i>}
        {image && <img className={cx('image')} src={image} alt="" />}
        {children && <span className={cx('title')}>{children}</span>}
        {rightIcon && <i className={cx('icon')}>{rightIcon}</i>}
      </CompBut>
    );
  },
);

Button.propTypes = {
  to: PropTypes.string,
  href: PropTypes.string,
  disabled: PropTypes.bool,
  navlink: PropTypes.bool,
  btnType: PropTypes.oneOf([
    'primary',
    'white',
    'gray',
    'gray-light',
    'red',
    'login',
    'signup',
    'upload',
  ]),
  up: PropTypes.bool,
  rounded: PropTypes.bool,
  type: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  sz: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  image: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  onClick: PropTypes.func,
};

export default Button;
