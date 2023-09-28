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
import { createPortal } from 'react-dom';
import EditArt from '../Art/EditArt/EditArt';

export const ModalToggleContext = createContext(() => {});

const cx = classNames.bind(styles);
let scrollPosition = 0;

function Modal({ modalType, data, sz, children, isChild }) {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal((prevModal) => !prevModal);
  };

  useEffect(() => {
    const body = document.body;

    if (modal) {
      scrollPosition = window.scrollY;
      body.style.overflowY = 'scroll';
      body.style.position = 'fixed';
      body.style.scrollbarGutter = 'stable';
      body.style.top = `-${scrollPosition}px`;
    } else if (!isChild) {
      body.style.overflowY = 'auto';
      body.style.position = 'static';
      window.scrollTo(0, scrollPosition);
    } else {
      body.style.overflowY = 'auto';
      body.style.position = 'static';
      window.scrollTo(0, scrollPosition);
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
      case 'edit-art':
        return <>{cloneElement(children, { onClick: toggleModal })}</>;
      case 'delete-art':
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
      case 'edit-art':
        return <EditArt art={data.art} />;
      case 'delete-art':
        return (
          <>
            <div className={cx('heading')}>Delete Art</div>
            <div className="d-flex justify-content-center align-item-center">
              Do you really want to delete this art?
            </div>
            <div className="d-flex justify-content-end">
              <Button gray onClick={toggleModal}>
                Cancel
              </Button>
              <Button primary onClick={data.onClick}>
                Delete
              </Button>
            </div>
          </>
        );
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
        {modal &&
          createPortal(
            <div className={cx('modal')}>
              <div onClick={toggleModal} className={cx('overlay')}></div>
              <div className={cx('modal-content', sz)}>
                {renderChildrenModal()}
                <Button className={cx('close-modal')} onClick={toggleModal}>
                  <FontAwesomeIcon icon={faXmark} />
                </Button>
              </div>
            </div>,
            document.body,
          )}
      </ModalToggleContext.Provider>
    </div>
  );
}

Modal.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
  sz: PropTypes.string,
  isChild: PropTypes.bool,
  modalType: PropTypes.oneOf([
    'login',
    'signup',
    'upload',
    'art-detail',
    'edit-art',
    'delete-art',
    'editProfile',
  ]).isRequired,
};

export default Modal;
