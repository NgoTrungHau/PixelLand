import classNames from 'classnames/bind';
// React
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form validation
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';

// scss
import mstyles from '../Modal.module.scss';
import styles from './Login.module.scss';
// components
import Button from '~/components/Button';
// features
import SpinIcon from '~/components/SpinIcon';
import { login, reset } from '~/features/auth/authSlice';

const cx = classNames.bind(styles);
const mcx = classNames.bind(mstyles);

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isSuccess, message, navigate, dispatch]);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async () => {
      await dispatch(login(formik.values));
      formik.resetForm();
    },
  });

  return (
    <>
      <div className={mcx('heading')}>
        <h2>Log in</h2>
        <p>Welcome back!</p>
      </div>
      <div className={cx('wrapper')}>
        <Formik
          initialValues={formik.initialValues}
          validationSchema={LoginSchema}
          onSubmit={formik.handleSubmit}
        >
          <form onSubmit={formik.handleSubmit}>
            <div className={mcx('form-field')}>
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
                value={formik.values.email}
                placeholder="Email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              ></input>
            </div>
            <div className={mcx('form-field')}>
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
                value={formik.values.password}
                placeholder="Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              ></input>
            </div>
            <div className={cx('btn-submit')}>
              <Button btnType="primary" type="submit">
                {isLoading ? <SpinIcon /> : 'Login'}
              </Button>
            </div>
          </form>
        </Formik>
      </div>
    </>
  );
}

export default LoginForm;
