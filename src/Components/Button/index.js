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
  leftIcon,
  onClick,
  passProps,
}) {
  let CompBut = 'button';
  let classN = cx('wrapper', { primary }, { white });
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
    classN = cx('wrapper', type, { primary }, { white }, { up });
  }
  const classes = classN;

  return (
    <CompBut className={classes} {...props}>
      {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
      <span>{children}</span>
    </CompBut>
  );
}

export default Button;
