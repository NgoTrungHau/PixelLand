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
import { createCmt } from '~/features/comments/commentSlice';
const cx = classNames.bind(styles);

function CommentForm({ art_id, post_id }) {
  const [media, setMedia] = useState('');
  const [isHover, setIsHover] = useState(false);
  const imgRef = useRef();

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleImage = async (e) => {
    const file = e.target.files[0];
    let mediaType;

    if (file.type.startsWith('image')) {
      mediaType = 'image';
    } else if (file.type.startsWith('video')) {
      mediaType = 'video';
    }
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        setMedia(reader.result);
        formik.setFieldValue('media', reader.result);
        formik.setFieldValue('mediaType', mediaType);
      };
    } catch (error) {
      console.error(error);
    }
  };

  const CommentSchema = Yup.object().shape({
    commentedBy: Yup.string(),
    art: Yup.string(),
    post: Yup.string(),
    content: Yup.string(),
    media: Yup.string(),
    mediaType: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      commentedBy: user._id,
      art: art_id,
      post: post_id,
      content: '',
      media: '',
      mediaType: '',
    },
    validationSchema: CommentSchema,
    onSubmit: () => {
      dispatch(createCmt(formik.values));
      formik.resetForm();
      imgRef.current.value = '';
      setMedia('');
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
                id="content"
                name="content"
                value={formik.values.content}
                placeholder="Write your comment"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className={cx('btn-post')}>
                {(formik.values.content || formik.values.media) && (
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
                    accept="image/*,video/*,.gif"
                    onChange={handleImage}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>
          </div>
          {media && (
            <div className={cx('img-thumb')}>
              <Button
                type="button"
                className={cx('remove-img')}
                onClick={(e) => {
                  e.preventDefault();
                  imgRef.current.value = '';
                  formik.values.media = '';
                  setMedia('');
                }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </Button>
              <Image src={media} alt="" />
            </div>
          )}
        </form>
      </Formik>
    </div>
  );
}

export default CommentForm;
