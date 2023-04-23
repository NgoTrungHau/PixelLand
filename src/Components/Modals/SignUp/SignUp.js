import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '~/components/Button';
import styles from '../Modal.module.scss';
import { register, reset } from '~/features/auth/authSlice';

const cx = classNames.bind(styles);

function ModalSignUp() {
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
    email: '',
    password: '',
    password2: '',
  });

  const { username, email, password, password2 } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleFormData = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error('Passwords do not match');
    } else {
      const userData = {
        username,
        email,
        password,
      };

      dispatch(register(userData));
    }
  };

  if (isLoading) {
    return <FontAwesomeIcon icon={faSpinner} />;
    // return (
    //   <div className={cx('wrapper')}>
    //     <Button
    //       signup
    //       up
    //       leftIcon={<FontAwesomeIcon icon={faUser} />}
    //       onClick={toggleModal}
    //     >
    //       Sign Up
    //     </Button>
    //     {modal && (
    //       <div className={cx('modal')}>
    //         <div onClick={toggleModal} className={cx('overlay')}></div>
    //         <div className={cx('modal-content')}>
    //           <FontAwesomeIcon icon={faSpinner} />
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // );
  }

  return (
    <div className={cx('wrapper')}>
      <Button
        signup
        up
        leftIcon={<FontAwesomeIcon icon={faUser} />}
        onClick={toggleModal}
      >
        Sign Up
      </Button>
      {modal && (
        <div className={cx('modal')}>
          <div onClick={toggleModal} className={cx('overlay')}></div>
          <div className={cx('modal-content')}>
            <div className="heading">
              <h2>Create an account</h2>
              <p>Become part of pixel art community</p>
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
                  placeholder="Username"
                  onChange={handleFormData}
                />
              </div>
              <div className="form-group">
                <label
                  className="d-flex justify-content-left"
                  htmlFor="auth-username-signup"
                >
                  Email:
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={email}
                  placeholder="Email"
                  onChange={handleFormData}
                />
              </div>
              <div className="form-group">
                <label
                  className="d-flex justify-content-left"
                  htmlFor="auth-username-signup"
                >
                  Password:
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={password}
                  placeholder="Password"
                  onChange={handleFormData}
                />
              </div>
              <div className="form-group">
                <label
                  className="d-flex justify-content-left"
                  htmlFor="auth-username-signup"
                >
                  Comfirm password:
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password2"
                  name="password2"
                  value={password2}
                  placeholder="Comfirm"
                  onChange={handleFormData}
                />
              </div>

              <div className="form-group">
                <Button primary type="submit">
                  Create account
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

export default ModalSignUp;
