import classNames from 'classnames/bind';
// React
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form validation
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';

//scss
import mstyles from '../Modal.module.scss';
import styles from './SignUp.module.scss';
// components
import Button from '~/components/Button';
// features
import SpinIcon from '~/components/SpinIcon';
import { register, reset } from '~/features/auth/authSlice';

const cx = classNames.bind(styles);
const mcx = classNames.bind(mstyles);

function SignUpForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const SignUpSchema = Yup.object().shape({
    username: Yup.string().required('Required'),
    email: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], "Passwords don't match.") // The error message is shown if the values don't match
      .required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: SignUpSchema,
    onSubmit: async () => {
      console.log(formik.values);
      await dispatch(register(formik.values));
      formik.resetForm();
    },
  });

  return (
    <>
      <div className={mcx('heading')}>
        <h2>Create an account</h2>
        <p>Become part of art community</p>
      </div>
      <div className={cx('wrapper')}>
        <Formik
          initialValues={formik.initialValues}
          validationSchema={SignUpSchema}
          onSubmit={formik.handleSubmit}
        >
          <form onSubmit={formik.handleSubmit}>
            <div className={mcx('form-field')}>
              <label
                className="d-flex justify-content-left"
                htmlFor="auth-username-signup"
              >
                Username:
              </label>
              <input
                type="text"
                className="form-control"
                value={formik.values.username}
                id="username"
                name="username"
                placeholder="Username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.errors.username && formik.touched.username && (
              <p className={mcx('mess-error')}>{formik.errors.username}</p>
            )}
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
              />
            </div>
            {formik.errors.email && formik.touched.email && (
              <p className={mcx('mess-error')}>{formik.errors.email}</p>
            )}
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
              />
            </div>
            {formik.errors.password && formik.touched.password && (
              <p className={mcx('mess-error')}>{formik.errors.password}</p>
            )}
            <div className={mcx('form-field')}>
              <label
                className="d-flex justify-content-left"
                htmlFor="auth-username-signup"
              >
                Comfirm password:
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                placeholder="Comfirm"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.errors.confirmPassword &&
              formik.touched.confirmPassword && (
                <p className={mcx('mess-error')}>
                  {formik.errors.confirmPassword}
                </p>
              )}
            <div className={cx('btn-submit')}>
              <Button primary type="submit">
                {isLoading ? <SpinIcon /> : 'Create account'}
              </Button>
            </div>
          </form>
        </Formik>
      </div>
    </>
  );
}

export default SignUpForm;
