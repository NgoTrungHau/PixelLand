import classNames from 'classnames/bind';
import Button from '~/components/Button';
import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

function MenuItem({ data }) {
  const classes = cx('menu-item');

  if (data.divider) {
    return (
      <>
        <div className={cx('divider')}></div>
        <Button
          className={classes}
          white
          image={data.image}
          rightIcon={data.icon}
          to={data.to}
        >
          {data.title}
        </Button>
      </>
    );
  }
  return (
    <Button
      className={classes}
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
