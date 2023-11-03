import classNames from 'classnames/bind';
// React
import { useContext, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactTextareaAutosize from 'react-textarea-autosize';
// Font awesome
import {
  faGlobe,
  faImage,
  faLock,
  faPen,
  faUserGroup,
  faUsers,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Validation
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';

// scss
import mStyles from '~/components/Modals/Modal.module.scss';
import styles from './PostForm.module.scss';
// components
import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import Image from '~/components/Image';
import Menu from '~/components/Popper/Menu';
import SpinIcon from '~/components/SpinIcon';
import Video from '~/components/Video';
// features
import { createPost, editPost } from '~/features/posts/postSlice';
import { ModalToggleContext } from '../../Modals/Modal';

const cx = classNames.bind(styles);
const mcx = classNames.bind(mStyles);

function PostForm({ post }) {
  const [media, setMedia] = useState(post?.media?.url || '');
  const mediaRef = useRef();
  const toggleModal = useContext(ModalToggleContext);
  const privacyOptions = [
    {
      title: 'Public',
      leftIcon: <FontAwesomeIcon icon={faGlobe}></FontAwesomeIcon>,
      onClick: () => {
        handlePrivacy(privacyOptions[0]);
        formik.values.privacyOption = privacyOptions[0].title;
      },
    },
    {
      title: 'Followers only',
      leftIcon: <FontAwesomeIcon icon={faUserGroup}></FontAwesomeIcon>,

      onClick: () => {
        handlePrivacy(privacyOptions[1]);
        formik.values.privacyOption = privacyOptions[1].title;
      },
    },
    {
      title: 'Members only',
      leftIcon: <FontAwesomeIcon icon={faUsers}></FontAwesomeIcon>,

      onClick: () => {
        handlePrivacy(privacyOptions[2]);
        formik.values.privacyOption = privacyOptions[2].title;
      },
    },
    {
      title: 'Only me',
      leftIcon: <FontAwesomeIcon icon={faLock}></FontAwesomeIcon>,

      onClick: () => {
        handlePrivacy(privacyOptions[3]);
        formik.values.privacyOption = privacyOptions[3].title;
      },
    },
  ];
  const [privacy, setPrivacy] = useState(privacyOptions[0]);

  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.posts);

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
  };

  const handlePrivacy = (privacy) => {
    setPrivacy(privacy);
  };

  const FILE_SIZE_LIMIT = 10240 * 1024; // 1MB
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
  const PostSchema = Yup.object().shape({
    id: Yup.string(),
    privacyOption: Yup.string(),
    content: Yup.string(),
    mediaType: Yup.string(),
    media: Yup.mixed()
      .nullable()
      .notRequired()
      .test('fileSize', 'File too large', (value) =>
        value ? value.size <= FILE_SIZE_LIMIT : true,
      )
      // .test('type', 'Unsupported Format', (value) => {
      //   return value ? SUPPORTED_FORMATS.includes(value.type) : true;
      // })
      .test('media', 'Invalid media', (value) => {
        // If value is a string, test it with a simple URL regex, or use a url validator.
        // If value is a file, check if the type is valid
        if (typeof value === 'string') {
          // using a super simple url regex
          return /^(ftp|http|https):\/\/[^ "]+$/.test(value);
        } else if (value instanceof File) {
          return SUPPORTED_FORMATS.includes(value.type);
        }

        // If the value is neither a valid URL string nor a File object
        return true;
      }),
  });

  const formik = useFormik({
    initialValues: {
      id: post?._id || '',
      privacyOption: post?.privacy || privacyOptions[0].title,
      content: post?.content || '',
      media: post?.media?.url || null,
      mediaType: post?.media?.mediaType || '',
    },
    validationSchema: PostSchema,
    onSubmit: async () => {
      const formData = {
        id: formik.values?.id,
        user: user._id,
        privacy: formik.values?.privacyOption,
        content: formik.values?.content,
        mediaType: formik.values?.mediaType,
        media: formik.values?.media,
      };
      if (post) {
        await dispatch(editPost(formData));
      } else {
        await dispatch(createPost(formData));
      }
      toggleModal();
      formik.resetForm();
      mediaRef.current.value = '';
      setMedia('');
    },
  });

  return (
    <>
      <div className={mcx('heading')}>{post ? 'Edit' : 'Create'} Post</div>
      <div className={cx('user-info')}>
        <Avatar className={cx('avatar')} avatar={user.avatar?.url} medium />
        <div className={cx('info')}>
          <div>{user.username}</div>
          <Menu items={privacyOptions} offset={[32, 0]}>
            <div className={cx('privacy')}>
              <Button leftIcon={privacy.leftIcon}>{privacy.title}</Button>
            </div>
          </Menu>
        </div>
      </div>
      <Formik
        initialValues={formik.initialValues}
        validationSchema={PostSchema}
        onSubmit={formik.handleSubmit}
      >
        <form className={cx('form')} onSubmit={formik.handleSubmit}>
          <div className={cx('post-form')}>
            <div className={cx('content-media')}>
              <div className={cx('input-post')}>
                <ReactTextareaAutosize
                  minRows={4} // minimum number of rows
                  id="content"
                  name="content"
                  value={formik.values.content}
                  placeholder="Write your post"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      formik.handleSubmit();
                    }
                  }}
                />
              </div>

              {media && (
                <div className={cx('media-thumb')}>
                  <Button
                    btnType="gray-light"
                    type="button"
                    className={cx('edit-media')}
                    leftIcon={<FontAwesomeIcon icon={faPen} />}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('mediaInput').click();
                    }}
                  >
                    Change
                  </Button>
                  <Button
                    type="button"
                    className={cx('remove-media')}
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
                    <Video key={media} src={media} thumbnail />
                  )}
                  {formik.errors.media && formik.touched.media && (
                    <p className={mcx('mess-error')}>{formik.errors.media}</p>
                  )}
                </div>
              )}
            </div>
            <div className={cx('btn')}>
              <div className={cx('img-input-icon')}>
                <label htmlFor={`mediaInput`}>
                  <FontAwesomeIcon icon={faImage} />
                  <input
                    type="file"
                    id="mediaInput"
                    ref={mediaRef}
                    className={cx('media-thumb')}
                    accept="image/*,video/*,.gif"
                    onChange={handleMedia}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <div
                className={cx(
                  'btn-post',
                  (formik.values.content || formik.values.media) && 'can-post',
                )}
              >
                {
                  <Button
                    className={cx('post-post')}
                    type="submit"
                    sz="md"
                    disabled={!formik.values.content && !formik.values.media}
                  >
                    {isLoading ? <SpinIcon /> : post ? 'Save' : 'Post'}
                  </Button>
                }
              </div>
            </div>
          </div>
        </form>
      </Formik>
    </>
  );
}

export default PostForm;
