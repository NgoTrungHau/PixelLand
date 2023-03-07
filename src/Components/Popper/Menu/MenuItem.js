import classNames from 'classnames/bind';
import Button from '~/Components/Button';
import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

function MenuItem({ data }) {
  return (
    <Button
      className={cx('menu-item')}
      white
      image={data.image}
      rightIcon={data.icon}
      to={data.to}
    >
      {data.title}
    </Button>
  );
}

export default MenuItem;
