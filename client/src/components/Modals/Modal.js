import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { cloneElement, createContext, useEffect, useState } from 'react';
import {
  faArrowRightToBracket,
  faArrowUpFromBracket,
  faXmark,
  faUser,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Modal.module.scss';
import Button from '../Button';
import { UploadArt } from '../Art';
import LoginForm from './Login';
import SignUpForm from './SignUp';
import EditProfileForm from './EditProfile';
import ArtDetail from '../Art/ArtDetail';

export const ModalToggleContext = createContext(() => {});

const cx = classNames.bind(styles);

function Modal({ modalType, data, sz, children }) {
  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
    // console.log(!modal);
  };

  useEffect(() => {
    if (modal) {
      document.body.style.overflowY = 'scroll';
      document.body.style.position = 'fixed';
      document.body.style.left = '0';
      document.body.style.right = '0';
    } else {
      document.body.style.overflowY = 'auto';
      document.body.style.position = 'static';
    }
  }, [modal]);
  const renderBtnModal = () => {
    switch (modalType) {
      case 'signup':
        return (
          <Button
            signup
            up
            leftIcon={<FontAwesomeIcon icon={faUser} />}
            onClick={toggleModal}
          >
            Sign Up
          </Button>
        );
      case 'login':
        return (
          <Button
            login
            up
            leftIcon={<FontAwesomeIcon icon={faArrowRightToBracket} />}
            onClick={toggleModal}
          >
            Log In
          </Button>
        );
      case 'upload':
        return (
          <Button
            upload
            up
            type="button"
            leftIcon={<FontAwesomeIcon icon={faArrowUpFromBracket} />}
            onClick={toggleModal}
          />
        );
      case 'art-detail':
        return <>{cloneElement(children, { onClick: toggleModal })}</>;
      case 'editProfile':
        return (
          <Button
            gray
            leftIcon={<FontAwesomeIcon icon={faPen} />}
            onClick={toggleModal}
          >
            Edit Profile
          </Button>
        );
      default:
        return <button onClick={toggleModal} />;
    }
  };
  const renderChildrenModal = () => {
    switch (modalType) {
      case 'signup':
        return <SignUpForm />;
      case 'login':
        return <LoginForm />;
      case 'upload':
        return <UploadArt />;
      case 'art-detail':
        return <ArtDetail art={data} />;
      case 'editProfile':
        return <EditProfileForm />;
      default:
        return null;
    }
  };

  return (
    <div className={cx('wrapper')}>
      <ModalToggleContext.Provider value={toggleModal}>
        {renderBtnModal()}
        {modal && (
          <div className={cx('modal')}>
            <div onClick={toggleModal} className={cx('overlay')}></div>
            <div className={cx('modal-content', sz)}>
              {renderChildrenModal()}
              <Button className={cx('close-modal')} onClick={toggleModal}>
                <FontAwesomeIcon icon={faXmark} />
              </Button>
            </div>
          </div>
        )}
      </ModalToggleContext.Provider>
    </div>
  );
}

Modal.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
  sz: PropTypes.string,
  modalType: PropTypes.oneOf([
    'login',
    'signup',
    'upload',
    'art-detail',
    'editProfile',
  ]).isRequired,
};

export default Modal;