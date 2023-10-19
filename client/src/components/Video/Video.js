import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
// React
import { forwardRef } from 'react';
// Font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-regular-svg-icons';

// scss
import styles from './Video.module.scss';
// components
import Button from '../Button';
import { useRef } from 'react';

const cx = classNames.bind(styles);

const Video = forwardRef(
  ({ src, className, controls = false, thumbnail = false, ...props }, ref) => {
    const videoRef = useRef();
    const handlePlay = () => {
      videoRef.current.play();
      controls = !controls;
    };
    return (
      <div className={cx('wrapper', { [className]: className })} ref={ref}>
        <Button
          className={cx('thumb-play-btn')}
          type="button"
          disabled={!thumbnail}
          onClick={handlePlay}
        >
          <FontAwesomeIcon icon={faPlayCircle} />
        </Button>

        <video
          ref={videoRef}
          src={src}
          controls={thumbnail && controls}
          {...props}
        />
      </div>
    );
  },
);

Video.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
  controls: PropTypes.bool,
  thumbnail: PropTypes.bool,
};

export default Video;
