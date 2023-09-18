import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Button from '~/components/Button/';
import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

function MenuItem({ data, onClick }) {
  const classes = cx('menu-item');

  if (data.divider) {
    return (
      <>
        <div className={cx('divider')}></div>
        <Button
          className={classes}
          white
          image={data.image}
          leftIcon={data.leftIcon}
          rightIcon={data.rightIcon}
          to={data.to}
          onClick={onClick}
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
      leftIcon={data.leftIcon}
      rightIcon={data.rightIcon}
      to={data.to}
      onClick={onClick}
    >
      {data.title}
    </Button>
  );
}

MenuItem.propTypes = {
  data: PropTypes.object,
  onClick: PropTypes.func,
};

export default MenuItem;
