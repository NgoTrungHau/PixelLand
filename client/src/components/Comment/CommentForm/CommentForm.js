import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
// React hook
import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactTextareaAutosize from 'react-textarea-autosize';
// font
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faXmark } from '@fortawesome/free-solid-svg-icons';
// validation form
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';

// scss
import styles from './CommentForm.module.scss';
//components
import Button from '~/components/Button';
import Avatar from '~/components/Avatar';
import Image from '~/components/Image';
// features
import { createCmt, editCmt, replyCmt } from '~/features/comments/commentSlice';
import Video from '~/components/Video';

const cx = classNames.bind(styles);

function CommentForm({
  art_id,
  post_id,
  action,
  cmt,
  modal = false,
  onClick = () => {},
}) {
  const [media, setMedia] = useState(action === 'edit' ? cmt?.media?.url : '');
  const [isHover, setIsHover] = useState(false);
  const mediaRef = useRef();

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleMedia = async (e) => {
    const file = e.target.files[0];
    formik.setFieldValue('media', file);
    let mediaType;
    if (file.type.startsWith('image')) {
      mediaType = 'image';
    } else if (file.type.startsWith('video')) {
      mediaType = 'video';
    }
    formik.setFieldValue('mediaType', mediaType);
    try {
      const url = URL.createObjectURL(file);
      setMedia(url);
    } catch (error) {
      console.error(error);
    }
    e.target.value = '';
  };
  // const FILE_SIZE_LIMIT = 1024 * 1024; // 1MB
  const SUPPORTED_FORMATS = [
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/png',
    'video/mp4',
    'video/mpeg',
    'video/avi',
    'video/quicktime', // .mov files
    'video/x-ms-wmv', // .wmv files
  ];
  const CommentSchema = Yup.object().shape({
    id: Yup.string(),
    commentedBy: Yup.string(),
    art: Yup.string(),
    post: Yup.string(),
    content: Yup.string(),
    mediaType: Yup.string(),
    media: Yup.mixed()
      .nullable()
      .notRequired()
      // .test('fileSize', 'File too large', (value) =>
      //   value ? value.size <= FILE_SIZE_LIMIT : true,
      // )
      .test('type', 'Unsupported Format', (value) => {
        return value ? SUPPORTED_FORMATS.includes(value.type) : true;
      }),
  });

  const formik = useFormik({
    initialValues: {
      id: cmt?._id,
      commentedBy: user._id,
      art: art_id || cmt?.art,
      post: post_id || cmt?.post,
      content: action === 'edit' ? cmt?.content : '',
      media: null,
      mediaType: action === 'edit' ? cmt?.media?.type : '',
    },
    validationSchema: CommentSchema,
    onSubmit: () => {
      const formData = {
        id: formik.values.id,
        commentedBy: formik.values.commentedBy,
        art: formik.values.art,
        post: formik.values.post,
        content: formik.values.content,
        mediaType: formik.values?.mediaType,
        media: formik.values?.media,
      };
      if (action === 'create') {
        dispatch(createCmt(formData));
      }
      if (action === 'edit') {
        dispatch(editCmt(formData));
      }
      if (action === 'reply') {
        dispatch(replyCmt(formData));
      }
      formik.resetForm();
      mediaRef.current.value = '';
      setMedia('');
      onClick();
    },
  });

  return (
    <div
      className={cx('wrapper', modal && 'modal-wrapper')}
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
            <div>
              <div className={cx('input-comment')}>
                <ReactTextareaAutosize
                  minRows={1} // minimum number of rows
                  id={`content-${action}`}
                  name="content"
                  value={formik.values.content}
                  placeholder="Write your comment"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      formik.handleSubmit();
                    }
                  }}
                />
                <div className={cx('btn-post')}>
                  {(formik.values.content || formik.values.media) && (
                    <Button
                      className={cx('post-comment')}
                      type="submit"
                      sz="md"
                    >
                      Post
                    </Button>
                  )}
                </div>
                <div className={cx('media-input-icon')}>
                  <label htmlFor={`mediaInput-${action}`}>
                    <FontAwesomeIcon icon={faImage} />
                    <input
                      type="file"
                      id={`mediaInput-${action}`}
                      ref={mediaRef}
                      className={cx('media-thumb')}
                      accept="image/*,video/*,.gif"
                      onChange={handleMedia}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
              {media && (
                <div className={cx('media-thumb', modal && 'media-modal')}>
                  <Button
                    type="button"
                    className={cx(
                      formik.values.mediaType === 'video'
                        ? 'remove-video'
                        : 'remove-media',
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      mediaRef.current.value = '';
                      formik.setFieldValue('media', null);
                      formik.setFieldValue('mediaType', '');
                      setMedia('');
                    }}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </Button>
                  {formik.values.mediaType === 'image' ? (
                    <Image src={media} alt="" />
                  ) : (
                    <Video key={media} src={media} thumbnail cmt={modal} />
                  )}
                </div>
              )}
            </div>
          </div>
        </form>
      </Formik>
    </div>
  );
}

CommentForm.propTypes = {
  art_id: PropTypes.string,
  post_id: PropTypes.string,
  cmt: PropTypes.object,
  modal: PropTypes.bool,
  action: PropTypes.oneOf(['create', 'edit', 'reply']),
  onClick: PropTypes.func,
};

export default CommentForm;
