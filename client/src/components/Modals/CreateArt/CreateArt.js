import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '~/components/Button';
import styles from '../Modal.module.scss';
import { createArt } from '~/features/arts/artSlice';
import SpinIcon from '~/components/SpinIcon';

const cx = classNames.bind(styles);

function ModalCreateArt() {
  const [modal, setModal] = useState(false);
  const [art, setArt] = useState('');

  const toggleModal = () => {
    setModal(!modal);
  };

  useEffect(() => {
    if (modal) {
      document.body.style.overflowY = 'scroll';
      document.body.style.position = 'fixed';
    } else {
      document.body.style.overflowY = 'auto';
      document.body.style.position = 'static';
    }
  }, [modal]);

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { arts, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.arts,
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      setModal(false);
    }
  }, [user, arts, isError, isSuccess, message, dispatch]);

  const handleArt = async (e) => {
    const file = e.target.files[0];

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        setArt(reader.result);
        formik.setFieldValue('art', reader.result);
      };
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = (e) => {
    e.target.value = '';
    formik.setValues({ title: '', description: '', art: '' });
    setArt('');
    toggleModal();
  };

  const ArtSchema = Yup.object().shape({
    title: Yup.string(),
    description: Yup.string(),
    art: Yup.string().required('An image is required'),
    // art: Yup.mixed()
    //   .required('An image is required')
    //   .test(
    //     'fileSize',
    //     'File too large',
    //     (value) => value && value.size <= 1024 * 1024, // 1MB limit
    //   )
    //   .test(
    //     'fileFormat',
    //     'Unsupported Format',
    //     (value) =>
    //       value &&
    //       ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type), // only support jpg, jpeg, png
    //   ),
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      art: '',
    },
    validationSchema: ArtSchema,
    onSubmit: () => {
      dispatch(createArt(formik.values));
      formik.resetForm();
      setArt('');
    },
  });

  return (
    <div className={cx('wrapper')}>
      <Button
        upload
        up
        type="button"
        leftIcon={<FontAwesomeIcon icon={faArrowUpFromBracket} />}
        onClick={toggleModal}
      ></Button>
      {modal && (
        <div className={cx('modal')}>
          <div onClick={toggleModal} className={cx('overlay')}></div>
          <div className={cx('modal-content')}>
            <div className="heading">
              <h2>Upload Art</h2>
            </div>
            {isLoading ? (
              <SpinIcon />
            ) : (
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
                    <textarea
                      className={`${cx('')} form-control`}
                      id="description"
                      name="description"
                      rows="5"
                      value={formik.values.description}
                      placeholder="Description"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <ErrorMessage name="description" component="div" />
                  </div>
                  <div className={cx('form-field')}>
                    <label htmlFor="art" className="d-flex ">
                      <Button
                        grayLight
                        type="button"
                        leftIcon={<FontAwesomeIcon icon={faImage} />}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById('art').click();
                        }}
                      >
                        Select Art
                      </Button>
                      <input
                        type="file"
                        className="form-control"
                        id="art"
                        name="art"
                        accept="image/*"
                        onChange={(e) => {
                          handleArt(e);
                        }}
                        hidden
                      />
                    </label>
                    {formik.errors.art && formik.touched.art && (
                      <p className={cx('mess-error')}>{formik.errors.art}</p>
                    )}
                    {art && (
                      <img
                        src={art}
                        alt=""
                        style={{
                          width: 200,
                          maxHeight: 200,
                          objectFit: 'cover',
                          borderRadius: 10,
                        }}
                      />
                    )}
                  </div>
                  <div className="d-flex justify-content-end">
                    <Button
                      grayLight
                      type="button"
                      sz="small"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button primary type="submit">
                      Upload
                    </Button>
                  </div>
                </form>
              </Formik>
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

export default ModalCreateArt;
