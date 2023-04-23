import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './Avatar.module.scss';
import Image from '~/components/Image';

const cx = classNames.bind(styles);

function Avatar({ avatar, large = false, medium = false, small = false }) {
  return (
    <Image
      src={avatar}
      className={cx('user-avatar', { large, medium, small })}
      alt="user"
    />
  );
}

Avatar.propTypes = {
  user: PropTypes.string,
  large: PropTypes.bool,
  medium: PropTypes.bool,
  small: PropTypes.bool,
};

export default Avatar;
