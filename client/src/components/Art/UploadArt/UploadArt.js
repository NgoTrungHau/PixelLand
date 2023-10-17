import classNames from 'classnames/bind';
// React
import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import ReactTextareaAutosize from 'react-textarea-autosize';
// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
// Validation form
import { Formik, useFormik } from 'formik';
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

  // options
  const privacyOptions = [
    { key: 'Public', value: 'Public' },
    { key: 'Followers only', value: 'Followers only' },
    { key: 'Subscribers only', value: 'Subscribers only' },
    { key: 'Only me', value: 'Only me' },
  ];
  const typeOptions = [
    { key: 'Select art style', value: '' },
    { key: 'Digital Painting', value: 'Digital Painting' },
    { key: 'Fan Art', value: 'Fan Art' },
    { key: 'Concept Art', value: 'Concept Art' },
    { key: 'Fantasy Art', value: 'Fantasy Art' },
    { key: 'Vector Art', value: 'Vector Art' },
    { key: 'Game Art', value: 'Game Art' },
    { key: 'AI Art', value: 'AI Art' },
    { key: 'Pixel Art', value: 'Pixel Art' },
    { key: 'Anime and Manga', value: 'Anime and Manga' },
  ];

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
    privacyOptions: Yup.string(),
    typeOptions: Yup.string().required('Required'),
    checkTerm: Yup.boolean().required('Required'),
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
      privacyOptions: '',
      typeOptions: '',
      checkTerm: false,
      art: null,
    },
    validationSchema: ArtSchema,
    onSubmit: async () => {
      const formData = new FormData();
      formData.append('title', formik.values.title);
      formData.append('description', formik.values.description);
      formData.append('typeOptions', formik.values.typeOptions);
      formData.append('privacyOptions', formik.values.privacyOptions);
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
            <div className={mcx('form-field')}>
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
            </div>

            <div className={mcx('form-field')}>
              <ReactTextareaAutosize
                className={`${cx('')} form-control`}
                minRows={4} // minimum number of rows
                id="description"
                name="description"
                value={formik.values.description}
                placeholder="Description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className={mcx('form-field')}>
              <div htmlFor="privacy" className={cx('custom-select')}>
                <select
                  id="privacyOptions"
                  name="privacyOptions"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {privacyOptions.map((privacy, i) => {
                    return (
                      <option key={privacy.value} value={privacy.value}>
                        {privacy.key}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className={mcx('form-field')}>
              <div htmlFor="type" className={cx('custom-select')}>
                <select
                  id="typeOptions"
                  name="typeOptions"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {typeOptions.map((type, i) => {
                    return (
                      <option key={type.value} value={type.value}>
                        {type.key}
                      </option>
                    );
                  })}
                </select>
              </div>
              {formik.errors.typeOptions && formik.touched.typeOptions && (
                <p className={mcx('mess-error')}>{formik.errors.typeOptions}</p>
              )}
            </div>

            <div className={mcx('form-field')}>
              <label htmlFor="art" className={cx('input-img')}>
                <Button
                  grayLight
                  type="button"
                  leftIcon={<FontAwesomeIcon icon={faImage} />}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('art').click();
                  }}
                >
                  {media ? 'Change Art' : 'Select Art'}
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
                <p className={mcx('mess-error')}>{formik.errors.art}</p>
              )}
            </div>
            <div className={mcx('form-field')}>
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

            <div className={cx('check-term')}>
              <input
                className="form-check-input"
                type="checkbox"
                id="checkTerm"
                name="checkTerm"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="checkTerm">
                I have read and agree to the <Link to="#">terms of use</Link>{' '}
                and acknowledge I am the creator of this art and I give Pixel
                Land permission to post this art on social media.
              </label>
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
