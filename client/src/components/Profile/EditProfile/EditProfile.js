import classNames from 'classnames/bind';
// react
import { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactTextareaAutosize from 'react-textarea-autosize';
// form validation
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';

// scss
import mstyles from '~/components/Modals/Modal.module.scss';
import styles from './EditProfile.module.scss';
// components
import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import SpinIcon from '~/components/SpinIcon';
import Image from '~/components/Image';
// features
import { ModalToggleContext } from '../../Modals/Modal';
import { editProfile } from '~/features/profile/profileSlice';

const mcx = classNames.bind(mstyles);
const cx = classNames.bind(styles);

function EditProfileForm({ settings = false }) {
  const toggleModal = useContext(ModalToggleContext);
  const { profile, isLoading } = useSelector((state) => state.profile);
  const [avt, setAvt] = useState(profile.avatar?.url);
  const [bg, setBg] = useState(profile.background?.url);

  const dispatch = useDispatch();

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    formik.setFieldValue('avatar', file);
    try {
      const url = URL.createObjectURL(file);
      setAvt(url);
    } catch (error) {
      console.error(error);
    }
  };
  const handleBackground = async (e) => {
    const file = e.target.files[0];
    formik.setFieldValue('background', file);
    try {
      const url = URL.createObjectURL(file);
      setBg(url);
    } catch (error) {
      console.error(error);
    }
  };

  const FILE_SIZE_LIMIT = 10240 * 1024; // 1MB
  const SUPPORTED_FORMATS = [
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/png',
  ];
  const ProfileSchema = Yup.object().shape({
    id: Yup.string(),
    username: Yup.string(),
    description: Yup.string(),
    avatar: Yup.mixed()
      .nullable()
      .notRequired()
      .test('fileSize', 'File too large', (value) =>
        value ? value.size <= FILE_SIZE_LIMIT : true,
      )
      .test('type', 'Unsupported Format', (value) => {
        return value ? SUPPORTED_FORMATS.includes(value.type) : true;
      }),
    background: Yup.mixed()
      .nullable()
      .notRequired()
      .test('fileSize', 'File too large', (value) =>
        value ? value.size <= FILE_SIZE_LIMIT : true,
      )
      .test('type', 'Unsupported Format', (value) => {
        return value ? SUPPORTED_FORMATS.includes(value.type) : true;
      }),
  });

  const formik = useFormik({
    initialValues: {
      id: profile?._id,
      username: profile?.username,
      description: profile?.description,
      avatar: null,
      background: null,
    },
    validationSchema: ProfileSchema,
    onSubmit: async () => {
      console.log('submit');
      const formData = {
        id: formik.values.id,
        username: formik.values.username,
        description: formik.values.description,
        avatar: formik.values.avatar,
        background: formik.values.background,
      };

      await dispatch(editProfile(formData));
      toggleModal();
    },
  });

  return (
    <>
      {!settings && (
        <div className={mcx('heading')}>
          <h2>Edit Profile</h2>
        </div>
      )}
      <div className={cx('wrapper', settings && 'settings')}>
        <Formik
          initialValues={formik.initialValues}
          validationSchema={ProfileSchema}
          onSubmit={formik.handleSubmit}
        >
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <label className="d-flex justify-content-left">Avatar:</label>
              <label htmlFor="avatar" className="d-flex justify-content-center">
                <div className={cx('avatar')}>
                  {avt && <Avatar avatar={avt} to={profile._id} XL onChange />}
                </div>
                <input
                  type="file"
                  className="form-control"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  onChange={(e) => {
                    handleAvatar(e);
                  }}
                  hidden
                />
              </label>
            </div>

            <div className="form-group">
              <label className="d-flex justify-content-left">Background:</label>
              <label
                htmlFor="background"
                className="d-flex justify-content-center"
              >
                <div className={cx('background')}>
                  {bg && <Image src={bg} alt="" />}
                </div>
                <input
                  type="file"
                  className="form-control"
                  id="background"
                  name="background"
                  accept="image/*"
                  onChange={(e) => {
                    handleBackground(e);
                  }}
                  hidden
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
                id="username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="form-group">
              <label
                className="d-flex justify-content-left"
                htmlFor="auth-username-signup"
              >
                Description:
              </label>
              <ReactTextareaAutosize
                type="text"
                className="form-control"
                id="description"
                name="description"
                minRows={4} // minimum number of rows
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className={cx('save-btn')}>
              <Button
                btnType="primary"
                type="submit"
                onClick={formik.handleSubmit}
              >
                {isLoading ? <SpinIcon /> : 'Save'}
              </Button>
            </div>
          </form>
        </Formik>
      </div>
    </>
  );
}

export default EditProfileForm;
