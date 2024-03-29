import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Header from '~/layouts/components/Header';
import styles from './DefaultLayout.module.scss';
import Sidebar from '~/layouts/components/Sidebar';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  // const handleMouseEnter = (e) => {
  //   e.target.style.overflowY = 'auto';
  // };
  // const handleMouseLeave = (e) => {
  //   e.target.style.overflowY = 'hidden';
  // };

  return (
    <>
      <Header />

      <div className={cx('container')}>
        <Sidebar />
        <div
          className={cx('content')}
          // onMouseEnter={handleMouseEnter}
          // onMouseLeave={handleMouseLeave}
        >
          {children}
        </div>
      </div>
    </>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DefaultLayout;
