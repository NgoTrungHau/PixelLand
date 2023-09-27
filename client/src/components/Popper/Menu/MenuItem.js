import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

// css
import styles from './Menu.module.scss';
// components
import Button from '~/components/Button/';
import Modal from '~/components/Modals/Modal';

const cx = classNames.bind(styles);

function MenuItem({ data, onClick }) {
  const classes = cx('menu-item');

  const renderModalType = () => {
    switch (data.title) {
      case 'Edit':
        return 'edit-art';
      case 'Delete':
        return 'delete-art';
    }
  };

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
  if (data.modal) {
    return (
      <div onClick={onClick}>
        <Modal modalType={renderModalType()} sz="small" data={data}>
          <Button
            className={cx('full', classes)}
            white
            image={data.image}
            leftIcon={data.leftIcon}
            rightIcon={data.rightIcon}
            to={data.to}
          >
            {data.title}
          </Button>
        </Modal>
      </div>
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
      onClick={data.onClick}
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
