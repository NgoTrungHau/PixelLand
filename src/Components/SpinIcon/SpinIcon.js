import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './SpinIcon.module.scss';

const cx = classNames.bind(styles);

function SpinIcon({ type }) {
  return type ? (
    <FontAwesomeIcon className={cx({ type })} icon={faSpinner} />
  ) : (
    <div className={cx('spin-icon')}>
      <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />
    </div>
  );
}

SpinIcon.propTypes = {
  type: PropTypes.string,
};

export default SpinIcon;
