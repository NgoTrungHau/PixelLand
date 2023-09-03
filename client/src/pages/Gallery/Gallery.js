import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import ArtList from '~/components/ArtList/';
import styles from './Gallery.module.scss';

const cx = classNames.bind(styles);

function Gallery() {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('picture-of-the-year')}>
        <img src="https://images.spiderum.com/sp-images/e23fb6106b6311e79bfac15c19b53ca4.png" />
        <div className={cx('ribbon')}>
          <FontAwesomeIcon icon={faStar}></FontAwesomeIcon> Picture of the Year
        </div>
      </div>
      <ArtList />
    </div>
  );
}

export default Gallery;
