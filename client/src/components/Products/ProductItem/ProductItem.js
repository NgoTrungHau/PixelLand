import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

// scss
import styles from './ProductItem.module.scss';
// components
import Image from '~/components/Image';
// features
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function ProductItem({ key, product }) {
  const isGif = product?.media?.url.toLowerCase().endsWith('.gif');

  if (!product) {
    return null;
  }

  return (
    <div className={cx('item-card')} key={product.product?._id}>
      <div className={cx('img-thumb')}>
        <Image src={product.media?.url} alt="" />
        {isGif && <div className={cx('isGif')}>GIF</div>}
        <div className={cx('price')}>
          <span>${product.price ? product.price : 'Free'} +</span>
        </div>
      </div>
      <div className={cx('item-detail')}>
        <div className={cx('info-detail')}>
          <Link to={`/${product.author._id}`} className={cx('creator')}>
            by {product.author.username}
          </Link>
          <div className={cx('title')}>
            <span>{product?.title}</span>
          </div>
          <div className={cx('description')}>
            <span>
              {product.description.length > 50
                ? `${product.description.substring(0, 50)}...`
                : product.description}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

ProductItem.propTypes = {
  product: PropTypes.object,
};

export default ProductItem;
