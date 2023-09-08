import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import styles from '../Modal.module.scss';
import Button from '~/components/Button';
import { login, reset } from '~/features/auth/authSlice';

const cx = classNames.bind(styles);

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isError, isSuccess, message } = useSelector(
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

  const loginSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  return (
    <div className={cx('wrapper')}>
      <div className="heading">
        <h2>Log in</h2>
        <p>Welcome back!</p>
      </div>
      <form onSubmit={loginSubmit}>
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
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={password}
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
    </div>
  );
}

export default LoginForm;
