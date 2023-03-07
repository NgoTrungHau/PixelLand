import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

function Button({
  to,
  href,
  primary = false,
  white = false,
  type,
  up = false,
  children,
  className,
  image,
  leftIcon,
  rightIcon,
  onClick,
  passProps,
}) {
  let CompBut = 'button';
  let classN = cx('wrapper', { [className]: className, primary, white, up });
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
      up,
    });
  }
  const classes = classN;

  return (
    <CompBut className={classes} {...props}>
      {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
      {image && <img className={cx('image')} src={image} alt="" />}

      <span className={cx('title')}>{children}</span>
      {rightIcon && <span className={cx('icon')}>{rightIcon}</span>}
    </CompBut>
  );
}

export default Button;
