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
    switch (data.action) {
      case 'Edit Art':
        return 'edit-art';
      case 'Delete Art':
        return 'delete-art';
      case 'Edit Comment':
        return 'edit-cmt';
      case 'Delete Comment':
        return 'delete-cmt';
      default:
        return;
    }
  };

  if (data.modal) {
    return (
      <div onClick={onClick}>
        <Modal modalType={renderModalType()} sz="small" data={data} isChild>
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
    <>
      {data.divider && <div className={cx('divider')}></div>}
      <Button
        className={classes}
        white
        image={data.image}
        leftIcon={data.leftIcon}
        rightIcon={data.rightIcon}
        to={data.to}
        onClick={data.divider ? onClick : data.onClick}
      >
        {data.title}
      </Button>
    </>
  );
}

MenuItem.propTypes = {
  data: PropTypes.object,
  onClick: PropTypes.func,
};

export default MenuItem;
