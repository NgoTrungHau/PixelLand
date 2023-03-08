import classNames from 'classnames/bind';
import Header from '~/Components/Layout/components/Header';
import styles from '~/Components/Layout/DefaultLayout/DefaultLayout.module.scss';

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
