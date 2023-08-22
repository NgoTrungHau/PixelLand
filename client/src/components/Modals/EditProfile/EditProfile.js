import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import imageCompression from 'browser-image-compression';

import Button from '~/components/Button';
import styles from '../Modal.module.scss';
import { editProfile } from '~/features/auth/authSlice';
import SpinIcon from '~/components/SpinIcon';
import Avatar from '~/components/Avatar';

const cx = classNames.bind(styles);

function ModalEditProfile() {
  const [modal, setModal] = useState(false);
  const [avt, setAvt] = useState('');
  const [bg, setBg] = useState('');

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

  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  const [formData, setFormData] = useState({
    username: '',
    avatar: null,
    background: null,
    bio: '',
  });

  const { username, bio } = formData;

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [user, isError, isSuccess, message, dispatch]);

  useEffect(() => {
    setFormData({ username: user.username, bio: user.bio });
  }, [user]);

  const handleAvatar = async (e) => {
    const file = e.target.files[0];

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = function () {
        setAvt(reader.result);
        setFormData((prevState) => ({ ...prevState, avatar: reader.result }));
      };
    } catch (error) {
      console.error(error);
    }

    e.target.value = '';
  };
  const handleBackground = async (e) => {
    const file = e.target.files[0];

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = function () {
        setBg(reader.result);
        setFormData((prevState) => ({
          ...prevState,
          background: reader.result,
        }));
      };
    } catch (error) {
      console.error(error);
    }

    e.target.value = '';
  };

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
                  <label className="d-flex justify-content-left">Avatar:</label>
                  <label
                    htmlFor="avatar"
                    className="d-flex justify-content-center"
                  >
                    <Avatar avatar={avt ? avt : user.avatar?.url} XL onChange />
                    <input
                      type="file"
                      className="form-control"
                      id="avatar"
                      accept="image/*"
                      onChange={handleAvatar}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                <div className="form-group">
                  <label className="d-flex justify-content-left">
                    Background Image:
                  </label>
                  <label
                    htmlFor="background"
                    className="d-flex justify-content-center"
                  >
                    <img
                      src={bg ? bg : user.background?.url}
                      alt=""
                      style={{ width: 400, height: 200 }}
                    />
                    <input
                      type="file"
                      className="form-control"
                      id="background"
                      accept="image/*"
                      onChange={handleBackground}
                      style={{ display: 'none' }}
                    />
                  </label>
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
