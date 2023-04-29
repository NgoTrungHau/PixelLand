import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './Avatar.module.scss';
import Image from '~/components/Image';

const cx = classNames.bind(styles);

function Avatar({
  avatar,
  large = false,
  medium = false,
  small = false,
  profile = false,
}) {
  return (
    <Image
      src={avatar}
      className={cx('user-avatar', { large, medium, small, profile })}
      alt="user"
    />
  );
}

Avatar.propTypes = {
  user: PropTypes.string,
  profile: PropTypes.bool,
  large: PropTypes.bool,
  medium: PropTypes.bool,
  small: PropTypes.bool,
};

export default Avatar;
