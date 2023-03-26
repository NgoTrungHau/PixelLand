import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '../Modal.module.scss';
import Button from '~/components/Button';
import * as loginServices from '~/Services/loginService';

const cx = classNames.bind(styles);

function ModalLogin() {
  const [modal, setModal] = useState(false);

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    password2: '',
  });

  const { email, password } = formData;

  const toggleModal = () => {
    setModal(!modal);
  };

  useEffect(() => {
    if (modal) {
      document.body.classList.add('active-modal');
    } else {
      document.body.classList.remove('active-modal');
    }
  }, [modal]);

  const handleFormData = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const loginUser = async (e) => {
    e.preventDefault();

    const result = await loginServices.login(email, password);

    if (result) {
      alert('login successful');
      window.location.href = '/';
    } else {
      alert('pls check ur email and password');
    }
  };

  return (
    <div className={cx('wrapper')}>
      <Button
        login
        up
        leftIcon={<FontAwesomeIcon icon={faArrowRightToBracket} />}
        onClick={toggleModal}
      >
        Log In
      </Button>
      {modal && (
        <div className={cx('modal')}>
          <div onClick={toggleModal} className={cx('overlay')}></div>
          <div className={cx('modal-content')}>
            <div className="heading">
              <h2>Log in</h2>
              <p>Welcome back!</p>
            </div>
            <form onSubmit={loginUser}>
              <div className="form-group">
                <label
                  className="d-flex justify-content-left"
                  htmlFor="auth-username-signup"
                >
                  Email:
                </label>
                <input
                  value={email}
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  onChange={handleFormData}
                ></input>
              </div>
              <div className="form-group">
                <label
                  className="d-flex justify-content-left"
                  htmlFor="auth-username-signup"
                >
                  Password:
                </label>
                <input
                  value={password}
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={handleFormData}
                ></input>
              </div>
              <div className="form-group">
                <Button primary type="submit">
                  Login
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

export default ModalLogin;
