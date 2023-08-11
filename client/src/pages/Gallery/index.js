import classNames from 'classnames';

import ArtList from '~/components/ArtList/';
import styles from './Gallery.module.scss';

const cx = classNames.bind(styles);

function Gallery() {
  return (
    <div className={cx('wrapper')}>
      <h1>Gallery</h1>
      <ArtList></ArtList>
    </div>
  );
}

export default Gallery;
