import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '~/components/Button';
import styles from '../Modal.module.scss';
import { editProfile } from '~/features/auth/authSlice';
import SpinIcon from '~/components/SpinIcon';
import Avatar from '~/components/Avatar';

const cx = classNames.bind(styles);

function ModalEditProfile() {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'scroll';
    }
  }, [modal]);

  const [formData, setFormData] = useState({
    username: '',
    avatar: '',
    background: '',
    bio: '',
  });

  const { username, avatar, background, bio } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleFormData = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      username,
      avatar,
      background,
      bio,
    };

    dispatch(editProfile(userData));
  };

  if (isLoading) {
    return <SpinIcon />;
  }

  return (
    <div className={cx('wrapper')}>
      <Button
        gray
        leftIcon={<FontAwesomeIcon icon={faPen} />}
        onClick={toggleModal}
      >
        Edit Profile
      </Button>
      {modal && (
        <div className={cx('modal')}>
          <div onClick={toggleModal} className={cx('overlay')}></div>
          <div className={cx('modal-content')}>
            <div className="heading">
              <h2>Edit Profile</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label
                  className="d-flex justify-content-left"
                  htmlFor="auth-username-signup"
                >
                  Username:
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  id="username"
                  name="username"
                  placeholder={user.username}
                  onChange={handleFormData}
                />
              </div>
              <div className="form-group">
                <label
                  className="d-flex justify-content-left"
                  htmlFor="auth-username-signup"
                >
                  Avatar:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="avatar"
                  name="avatar"
                  value={avatar}
                  placeholder={user.avatar}
                  onChange={handleFormData}
                />
              </div>
              <div className="form-group">
                <Avatar avatar={user.avatar} large />
              </div>
              <div className="form-group">
                <label
                  className="d-flex justify-content-left"
                  htmlFor="auth-username-signup"
                >
                  Background Image:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="background"
                  name="background"
                  value={background}
                  placeholder={user.background}
                  onChange={handleFormData}
                />
              </div>
              <div className="form-group">
                <img
                  src={user.background}
                  alt=""
                  style={{ width: 400, height: 200 }}
                />
              </div>
              <div className="form-group">
                <label
                  className="d-flex justify-content-left"
                  htmlFor="auth-username-signup"
                >
                  Bio:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="bio"
                  name="bio"
                  value={bio}
                  placeholder={user.bio}
                  onChange={handleFormData}
                />
              </div>

              <div className="form-group">
                <Button primary type="submit">
                  Complete Edit
                </Button>
              </div>
            </form>
            <button className={cx('close-modal')} onClick={toggleModal}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModalEditProfile;
