import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
// React
import { useState, forwardRef } from 'react';

//
import images from '~/assets/images';
// scss
import styles from './Image.module.scss';

const cx = classNames.bind(styles);

const Image = forwardRef(
  (
    {
      src,
      alt,
      className,
      preview = false,
      fallback: customFallback = images.noImage,
      ...props
    },
    ref,
  ) => {
    const [fallback, setFallback] = useState('');
    const handleError = () => {
      setFallback(customFallback);
    };

    return (
      <img
        className={cx('wrapper', { [className]: className, preview })}
        ref={ref}
        src={src || fallback}
        alt={alt}
        {...props}
        onError={handleError}
      />
    );
  },
);

Image.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  preview: PropTypes.bool,
  fallback: PropTypes.string,
};

export default Image;
