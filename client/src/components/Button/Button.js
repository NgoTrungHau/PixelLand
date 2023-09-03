import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import classNames from 'classnames/bind';
import { Link, NavLink } from 'react-router-dom';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

const Button = forwardRef(
  (
    {
      to,
      href,
      type,
      navlink = false,
      primary = false,
      white = false,
      gray = false,
      grayLight = false,
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
    let classN = cx('wrapper', sz, {
      [className]: className,
      primary,
      white,
      gray,
      grayLight,

      login,
      signup,
      upload,
      rounded,
      up,
    });
    const props = {
      onClick,
      type,
      ...passProps,
    };

    if (to) {
      if (navlink) {
        CompBut = NavLink;
        classN = (nav) =>
          cx('wrapper', sz, {
            [className]: className,
            primary,
            white,
            gray,
            grayLight,

            sz,
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
  navlink: PropTypes.bool,
  primary: PropTypes.bool,
  white: PropTypes.bool,
  gray: PropTypes.bool,
  login: PropTypes.bool,
  signup: PropTypes.bool,
  upload: PropTypes.bool,
  up: PropTypes.bool,
  rounded: PropTypes.bool,
  type: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  sz: PropTypes.string,
  image: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  onClick: PropTypes.func,
};

export default Button;
