import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './Avatar.module.scss';
import Image from '~/components/Image';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Avatar({
  className,
  avatar,
  to,
  XL = false,
  large = false,
  medium = false,
  small = false,
  profile = false,
}) {
  return (
    <Link
      to={`/profile/${to}`}
      className={cx('user-avatar', {
        [className]: className,
        XL,
        large,
        medium,
        small,
        profile,
      })}
    >
      <Image src={avatar ? avatar : ''} alt="user" />
    </Link>
  );
}

Avatar.propTypes = {
  avatar: PropTypes.string,
  to: PropTypes.string,
  profile: PropTypes.bool,
  XL: PropTypes.bool,
  large: PropTypes.bool,
  medium: PropTypes.bool,
  small: PropTypes.bool,
};

export default Avatar;
