import classNames from 'classnames/bind';
// React
import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
// Validation form
import { Formik, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';

// scss
import styles from './UploadArt.module.scss';
import mStyles from '~/components/Modals/Modal.module.scss';
// components
import Button from '~/components/Button';
import SpinIcon from '~/components/SpinIcon';
import Image from '~/components/Image';
// feartures
import { createArt } from '~/features/arts/artSlice';
import { ModalToggleContext } from '../../Modals/Modal';

const cx = classNames.bind(styles);
const mcx = classNames.bind(mStyles);

function UploadArt() {
  const toggleModal = useContext(ModalToggleContext);
  const [media, setMedia] = useState('');
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { arts, isLoading, isError, message } = useSelector(
    (state) => state.arts,
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [user, arts, isError, message, dispatch]);

  const handleArt = async (e) => {
    const file = e.target.files[0];
    formik.setFieldValue('art', file);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        setMedia(reader.result);
      };
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = (e) => {
    e.target.value = '';
    formik.setValues({ title: '', description: '', art: null });
    setMedia('');
    toggleModal();
  };

  const FILE_SIZE_LIMIT = 1024 * 1024; // 1MB
  const SUPPORTED_FORMATS = [
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/png',
  ];
  const ArtSchema = Yup.object().shape({
    title: Yup.string(),
    description: Yup.string(),
    art: Yup.mixed()
      .required('An image is required')
      .test(
        'fileSize',
        'File too large',
        (value) => value && value.size <= FILE_SIZE_LIMIT,
      )
      .test('type', 'Unsupported Format', (value) => {
        return value && SUPPORTED_FORMATS.includes(value.type);
      }),
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      art: null,
    },
    validationSchema: ArtSchema,
    onSubmit: async () => {
      const formData = new FormData();
      formData.append('title', formik.values.title);
      formData.append('description', formik.values.description);
      formData.append('art', formik.values.art);

      await dispatch(createArt(formData));
      toggleModal();
      formik.resetForm();
      setMedia('');
    },
  });
  return (
    <>
      <div className={mcx('heading')}>Upload Art</div>
      <div className={cx('wrapper')}>
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
              {media && (
                <Image
                  src={media}
                  alt=""
                  style={{
                    width: 200,
                    maxHeight: 200,
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                />
              )}
            </div>
            <div className="d-flex justify-content-end">
              <Button grayLight type="button" onClick={handleCancel}>
                Cancel
              </Button>
              <Button primary type="submit">
                {isLoading ? <SpinIcon /> : 'Upload'}
              </Button>
            </div>
          </form>
        </Formik>
      </div>
    </>
  );
}

export default UploadArt;
