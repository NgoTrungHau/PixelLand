import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '~/components/Button';
import styles from '~/components/Modals/Modal.module.scss';
import editStyles from './EditArt.module.scss';
import { editArt } from '~/features/arts/artSlice';
import SpinIcon from '~/components/SpinIcon';
import { ModalToggleContext } from '../../Modals/Modal';
import Avatar from '~/components/Avatar';
import Image from '~/components/Image';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import ReactTextareaAutosize from 'react-textarea-autosize';

const cx = classNames.bind(styles);
const ecx = classNames.bind(editStyles);

function EditArt({ art }) {
  const toggleModal = useContext(ModalToggleContext);
  const [image, setImage] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.arts);

  const handleArt = async (e) => {
    const file = e.target.files[0];

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        setImage(reader.result);
        formik.setFieldValue('image', reader.result);
      };
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = (e) => {
    e.target.value = '';
    formik.resetForm();
    setImage('');
    toggleModal();
  };

  const ArtSchema = Yup.object().shape({
    id: Yup.string(),
    title: Yup.string(),
    description: Yup.string(),
    image: Yup.string().required('An image is required'),
  });

  const formik = useFormik({
    initialValues: {
      id: art._id,
      title: art.title,
      description: art.description,
      image: art.art?.url,
    },
    validationSchema: ArtSchema,
    onSubmit: async () => {
      await dispatch(editArt(formik.values));
      toggleModal();
      setImage('');
    },
  });

  useEffect(() => {
    if (!isLoading) {
      toggleModal();
    }
  }, [isLoading, toggleModal]);
  return (
    <>
      <div className={cx('heading')}>Edit Art</div>
      <div className={ecx('wrapper')}>
        <div className={ecx('user')}>
          <Avatar avatar={user.avatar?.url} medium />
          <div className={ecx('user-info')}>
            <div>{user?.username}</div>
            <p onClick={() => setIsPublic(!isPublic)}>
              {isPublic ? 'Public' : 'Only me'}
            </p>
          </div>
        </div>
        <Formik
          initialValues={formik.initialValues}
          validationSchema={ArtSchema}
          onSubmit={formik.handleSubmit}
        >
          <form onSubmit={formik.handleSubmit}>
            <div className={cx('form-field')}>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formik.values.title}
                placeholder="Title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <ErrorMessage name="title" component="div" />
            </div>

            <div className={cx('form-field')}>
              <ReactTextareaAutosize
                className={`${ecx('autosize-textarea')} form-control `}
                minRows={4} // minimum number of rows
                id="description"
                name="description"
                value={formik.values.description}
                placeholder="Description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <ErrorMessage name="description" component="div" />
            </div>
            <div className={cx('form-field')}>
              <div className={ecx('image-thumb')}>
                <label htmlFor="image" className={ecx('change-art')}>
                  <Button
                    grayLight
                    type="button"
                    leftIcon={<FontAwesomeIcon icon={faPen} />}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('image').click();
                    }}
                  >
                    Edit
                  </Button>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={(e) => {
                      handleArt(e);
                    }}
                    hidden
                  />
                </label>

                <Image
                  src={image || art.art?.url}
                  alt=""
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '468px',
                    borderRadius: '10px',
                  }}
                />
              </div>

              {formik.errors.image && formik.touched.image && (
                <p className={cx('mess-error')}>{formik.errors.image}</p>
              )}
            </div>
            <div className={ecx('btn-edit')}>
              <Button grayLight type="button" onClick={handleCancel}>
                Cancel
              </Button>
              <Button primary type="submit">
                {isLoading ? <SpinIcon /> : 'Save'}
              </Button>
            </div>
          </form>
        </Formik>
      </div>
    </>
  );
}

export default EditArt;
