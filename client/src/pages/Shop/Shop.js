import classNames from 'classnames/bind';
// React
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';

// scss
import styles from './Shop.module.scss';
// components
import ProductList from '~/components/Products/ProductList/ProductList';
// features
import { getProducts, reset } from '~/features/products/productSlice';

const cx = classNames.bind(styles);

function Shop() {
  const navigate = useNavigate(); // Get the navigate object

  const [page, setPage] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('All Products');
  const [selectedCategory, setSelectedCategory] = useState('ARTS');
  const [categoryDescription, setCategoryDescription] = useState(
    'An exclusive collection of unique and expressive artworks created by talented artists.',
  );
  const loadingProductsRef = useRef(false); // reference for API call status

  const dispatch = useDispatch();

  const { user, hasCheckedUser } = useSelector((state) => state.auth);
  const { isProductsLoading } = useSelector((state) => state.products);

  useEffect(() => {
    // Dispatch the reset action when the component mounts
    dispatch(reset());
  }, [dispatch]);
  useEffect(() => {
    const handleScroll = () => {
      if (
        !isProductsLoading &&
        window.innerHeight + document.documentElement.scrollTop + 1 >=
          document.documentElement.scrollHeight
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isProductsLoading]);
  useEffect(() => {
    if (hasCheckedUser && !loadingProductsRef.current) {
      loadingProductsRef.current = true; // set loading to true before API call

      if (user) {
        dispatch(getProducts(page, selectedCategory, selectedFilter)).then(
          () => {
            loadingProductsRef.current = false; // set loading to false after API call
          },
        );
      }
    }
  }, [page, selectedCategory, selectedFilter, hasCheckedUser, user, dispatch]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory.name);
    setCategoryDescription(newCategory.description);
    navigate(`/shop/${newCategory.name.toLowerCase()}`);
  };
  const handleFilterChange = (newFilter) => {
    setSelectedFilter(newFilter);
  };
  return (
    <div className={cx('wrapper')}>
      {/* <div className={cx('wallpaper')}>
        <h1>Shop for art from creators you love</h1>
      </div> */}
      <Routes>
        {/* Route for the default shop page */}
        <Route
          index
          element={
            <ProductList
              category={selectedCategory}
              categoryDescription={categoryDescription}
              filter={selectedFilter}
              onPageChange={handlePageChange}
              onCategoryChange={handleCategoryChange}
              onFilterChange={handleFilterChange}
            />
          }
        />
        {/* Route for the category-specific shop page */}
        <Route
          path="/:category"
          element={
            <ProductList
              category={selectedCategory}
              categoryDescription={categoryDescription}
              filter={selectedFilter}
              onPageChange={handlePageChange}
              onCategoryChange={handleCategoryChange}
              onFilterChange={handleFilterChange}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default Shop;
