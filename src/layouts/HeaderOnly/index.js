import classNames from 'classnames/bind';
import Header from '~/layouts/components/Header';
import styles from '~/layouts/DefaultLayout/DefaultLayout.module.scss';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  return (
    <div>
      <Header />
      <div className={cx('container')}>
        <div className={cx('content')}>{children}</div>
      </div>
    </div>
  );
}

export default DefaultLayout;
