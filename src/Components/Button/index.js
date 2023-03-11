import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

const Button = forwardRef(
  (
    {
      to,
      href,
      primary = false,
      white = false,
      up = false,
      rounded = false,
      type,
      children,
      className,
      image,
      leftIcon,
      rightIcon,
      onClick,
      passProps,
    },
    ref,
  ) => {
    let CompBut = 'button';
    let classN = cx('wrapper', {
      [className]: className,
      primary,
      white,
      rounded,
      up,
    });
    const props = {
      onClick,
      ...passProps,
    };

    if (to) {
      props.to = to;
      CompBut = Link;
    } else if (href) {
      props.href = href;
      CompBut = 'a';
    }
    if (type) {
      classN = cx('wrapper', type, {
        [className]: className,
        primary,
        white,
        rounded,
        up,
      });
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
  primary: PropTypes.bool,
  white: PropTypes.bool,
  up: PropTypes.bool,
  rounded: PropTypes.bool,
  type: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  image: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  onClick: PropTypes.func,
};

export default Button;
