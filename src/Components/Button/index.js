// import { forwardRef } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

function Button({
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
}) {
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
    <CompBut className={classes} {...props}>
      {leftIcon && <i className={cx('icon')}>{leftIcon}</i>}
      {image && <img className={cx('image')} src={image} alt="" />}
      {children && <span className={cx('title')}>{children}</span>}
      {rightIcon && <i className={cx('icon')}>{rightIcon}</i>}
    </CompBut>
  );
}

export default Button;
