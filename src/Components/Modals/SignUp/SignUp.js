import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '~/components/Button';
import styles from '../Modal.module.scss';
import * as registerServices from '~/Services/registerService';

const cx = classNames.bind(styles);

function ModalSignUp() {
  const [modal, setModal] = useState(false);

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    password2: '',
  });

  const { userName, email, password, password2 } = formData;

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

  const registerUser = async (e) => {
    e.preventDefault();

    const result = await registerServices.register(userName, email, password);
    console.log(result);
  };

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
            <form onSubmit={registerUser}>
              <div className="form-group">
                <label
                  className="d-flex justify-content-left"
                  htmlFor="auth-username-signup"
                >
                  Username:
                </label>
                <input
                  value={userName}
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  onChange={handleFormData}
                ></input>
              </div>
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
                <label
                  className="d-flex justify-content-left"
                  htmlFor="auth-username-signup"
                >
                  Comfirm password:
                </label>
                <input
                  value={password2}
                  type="password"
                  className="form-control"
                  placeholder="Comfirm"
                  onChange={handleFormData}
                ></input>
              </div>

              <div className="form-group ">
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
