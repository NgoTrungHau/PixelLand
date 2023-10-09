import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './Avatar.module.scss';
import Image from '~/components/Image';

const cx = classNames.bind(styles);

function Avatar({
  className,
  avatar,
  XL = false,
  large = false,
  medium = false,
  small = false,
  profile = false,
}) {
  return (
    <div>
      <Image
        src={avatar}
        className={cx('user-avatar', {
          [className]: className,
          XL,
          large,
          medium,
          small,
          profile,
        })}
        alt="user"
      />
    </div>
  );
}

Avatar.propTypes = {
  avatar: PropTypes.string,
  profile: PropTypes.bool,
  XL: PropTypes.bool,
  large: PropTypes.bool,
  medium: PropTypes.bool,
  small: PropTypes.bool,
};

export default Avatar;
