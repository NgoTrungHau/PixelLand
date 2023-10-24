import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
// React
import { forwardRef, useState } from 'react';
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
  (
    {
      src,
      className,
      controls = false,
      thumbnail = false,
      cmt = false,
      ...props
    },
    ref,
  ) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const togglePlay = () => {
      setIsPlaying(!isPlaying);
    };
    const handlePlay = () => {
      togglePlay();
      videoRef.current.play();
    };

    console.log(thumbnail);

    return (
      <div
        className={cx('wrapper', cmt && 'modal-wrapper', {
          [className]: className,
        })}
        ref={ref}
      >
        {thumbnail && (
          <div className={cx('thumb-play-btn', cmt && 'cmt-thumb')}>
            <Button type="button" disabled={thumbnail} onClick={handlePlay}>
              <FontAwesomeIcon icon={faPlayCircle} />
            </Button>
          </div>
        )}

        <video ref={videoRef} controls={!thumbnail && controls} {...props}>
          <source src={src} />
        </video>
      </div>
    );
  },
);

Video.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
  controls: PropTypes.bool,
  thumbnail: PropTypes.bool,
  cmt: PropTypes.bool,
};

export default Video;
