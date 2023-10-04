import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faXmark } from '@fortawesome/free-solid-svg-icons';
import ReactTextareaAutosize from 'react-textarea-autosize';
import { Formik, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '~/components/Button';
import Avatar from '~/components/Avatar';
import styles from './CommentForm.module.scss';
import Image from '~/components/Image';
const cx = classNames.bind(styles);

function CommentForm({ art_id }) {
  const [image, setImage] = useState('');
  const [isHover, setIsHover] = useState(false);
  const imgRef = useRef();

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleImage = async (e) => {
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

  const CommentSchema = Yup.object().shape({
    author: Yup.string(),
    src: Yup.string(),
    text: Yup.string(),
    image: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      author: user._id,
      src: art_id,
      text: '',
      image: '',
    },
    validationSchema: CommentSchema,
    onSubmit: () => {
      // dispatch(editArt(formik.values));
      formik.resetForm();
      setImage('');
    },
  });

  return (
    <div
      className={cx('wrapper')}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Formik
        initialValues={formik.initialValues}
        validationSchema={CommentSchema}
        onSubmit={formik.handleSubmit}
      >
        <form
          className={cx('form', {
            'scroll-show': isHover,
            'scroll-hide': !isHover,
          })}
          onSubmit={formik.handleSubmit}
        >
          <div className={cx('comment-form')}>
            <Avatar className={cx('avatar')} avatar={user.avatar?.url} medium />
            <div className={cx('input-comment')}>
              <ReactTextareaAutosize
                minRows={1} // minimum number of rows
                id="text"
                name="text"
                value={formik.values.text}
                placeholder="Write your comment"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className={cx('btn-post')}>
                {(formik.values.text || formik.values.image) && (
                  <Button className={cx('post-comment')} type="submit" sz="md">
                    Post
                  </Button>
                )}
              </div>
              <div className={cx('img-input-icon')}>
                <label htmlFor="imgInput">
                  <FontAwesomeIcon icon={faImage} />
                  <input
                    type="file"
                    id="imgInput"
                    ref={imgRef}
                    className={cx('img-thumb')}
                    accept="image/*"
                    onChange={handleImage}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>
          </div>
          {image && (
            <div className={cx('img-thumb')}>
              <Button
                type="button"
                className={cx('remove-img')}
                onClick={() => {
                  imgRef.current.value = '';
                  formik.values.image = '';
                  setImage('');
                }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </Button>
              <Image src={image} alt="" />
            </div>
          )}
        </form>
      </Formik>
    </div>
  );
}

export default CommentForm;
