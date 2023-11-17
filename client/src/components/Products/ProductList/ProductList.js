import classNames from 'classnames/bind';
// React
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// other

// scss
import styles from './ProductList.module.scss';
// components
import ProductItem from '../ProductItem/ProductItem';
// features
import Button from '~/components/Button';
import Menu from '~/components/Popper/Menu';

const cx = classNames.bind(styles);

function ProductList({
  category,
  categoryDescription,
  filter,
  onCategoryChange,
  onFilterChange,
  onPageChange,
}) {
  const filtersOptions = [
    'All Products',
    'Product Name',
    'For Members Only',
    'Newest First',
    'Oldest First',
    'Low to High',
    'High to Low',
  ];
  const categories = [
    {
      name: 'ARTS',
      description:
        'An exclusive collection of unique and expressive artworks created by talented artists.',
    },
    {
      name: 'SHIRTS',
      description:
        'T-shirts, tanks, sweaters, and more for men, women, and youth.',
    },
    {
      name: 'BAGS',
      description:
        'Bags for your books, groceries and all your little everyday items.',
    },
    {
      name: 'MUGS',
      description:
        'Ceramic mugs in a variety of sizes, including made in USA options.',
    },

    {
      name: 'WALL ARTS',
      description:
        'Decorative wall hangings that include posters, canvas, frames and photo prints.',
    },
    {
      name: 'PILLOWS',
      description:
        'Cushions for decorative and practical use, made, cut and sewn in-house.',
    },
    {
      name: 'TOWELS',
      description:
        'Super soft beach blankets and towels that are all-over printed for bold, crisp designs.',
    },
    {
      name: 'PHONE-CASES',
      description: 'Hard protective cases for iPhone & Samsung devices.',
    },
    {
      name: 'ACCESSORIES',
      description: 'Stickers, Mouse pads, Jigsaw and more!',
    },
  ];

  const { products, isProductsLoading, isError, message } = useSelector(
    (state) => state.products,
  );

  const cards_sample = Array(6)
    .fill(undefined)
    .map((a, i) => <div className={cx('card-thumb-sample')} key={i}></div>);

  // useEffect
  useEffect(() => {
    if (isError && message) {
      toast.error(message);
    }
  }, [message, isError]);

  const handleFilterSelect = (filter) => {
    onFilterChange(filter);
    onPageChange(0);
  };

  const handleCategorySelect = (category) => {
    onCategoryChange(category);
    onPageChange(0);
  };

  const renderFilters = (filters) => {
    return filters.map((filter) => {
      return {
        title: filter,
        onClick: () => {
          handleFilterSelect(filter);
        },
      };
    });
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('products-category')}>
        {categories.map((item, index) => (
          <div
            className={cx('type', {
              'selected-type': category === item.name,
            })}
            onClick={() => handleCategorySelect(item)}
            key={index}
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className={cx('category-title')}>
        <div className={cx('title')}>{category}</div>
        <div className={cx('description')}>{categoryDescription}</div>
      </div>
      <div className={cx('container')}>
        <div className={cx('left-content')}>
          <div className={cx('create-product')}>
            <Button btnType="white"> Add product +</Button>
          </div>
          <div className={cx('category')}>
            <div className={cx('panel-header')}>Categories</div>
            <div className={cx('panel-body')}>
              {categories.map((item, index) => (
                <div
                  className={cx('category-item', {
                    'selected-category': category === item.name,
                  })}
                  onClick={() => handleCategorySelect(item)}
                  key={index}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={cx('right-content')}>
          <div className={cx('product-filters')}>
            <div className={cx('filter')}>
              <Menu
                items={renderFilters(filtersOptions)}
                offset={[0, 0]}
                bottom="bottom-start"
              >
                <div className={cx('style', 'more')}>{filter}</div>
              </Menu>
            </div>
          </div>
          <div className={cx('product-list')}>
            {products.length > 0 &&
              products.map((product, index) => (
                <ProductItem product={product} key={product._id} />
              ))}
            {isProductsLoading && cards_sample}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
