import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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

  // const [avatar, setAvatar] = useState('');
  // const [background, setBackground] = useState('');

  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  const [formData, setFormData] = useState({
    username: '',
    avatar: '',
    background: '',
    bio: '',
  });

  const { username, avatar, background, bio } = formData;

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [user, isError, isSuccess, message, dispatch]);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  //   const changeAvatar = (e) => {
  //     const file = e.target.files[0]

  //     const err = checkImage(file)
  //     if(err) return dispatch({
  //         type: GLOBALTYPES.ALERT, payload: {error: err}
  //     })

  //     setAvatar(file)
  // }

  const handleFormData = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(editProfile(formData));
  };

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
            {isLoading ? (
              <SpinIcon />
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label
                    className="d-flex justify-content-left"
                    htmlFor="auth-username-signup"
                  >
                    Avatar:
                  </label>
                  <div className="d-flex justify-content-center">
                    <Avatar
                      avatar={avatar ? avatar : user.avatar}
                      XL
                      onChange
                    />
                  </div>
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
                  <label
                    className="d-flex justify-content-left"
                    htmlFor="auth-username-signup"
                  >
                    Background Image:
                  </label>
                  <div className="d-flex justify-content-center">
                    <img
                      src={background ? background : user.background}
                      alt=""
                      style={{ width: 400, height: 200 }}
                    />
                  </div>
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
                    Bio:
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="bio"
                    name="bio"
                    value={bio}
                    rows="4"
                    cols="50"
                    placeholder={user.bio}
                    onChange={handleFormData}
                  />
                </div>

                <div className="form-group">
                  <Button primary type="submit">
                    Save
                  </Button>
                </div>
              </form>
            )}
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
