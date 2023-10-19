import classNames from 'classnames/bind';
// React
import { useContext, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactTextareaAutosize from 'react-textarea-autosize';
// Font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGlobe,
  faImage,
  faLock,
  faPen,
  faUserGroup,
  faUsers,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
// Validation
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';

// scss
import styles from './PostForm.module.scss';
import mStyles from '~/components/Modals/Modal.module.scss';
// components
import Button from '~/components/Button';
import Avatar from '~/components/Avatar';
import Image from '~/components/Image';
import Modal from '~/components/Modals/Modal';
import Menu from '~/components/Popper/Menu';
import Video from '~/components/Video';
import SpinIcon from '~/components/SpinIcon';
// features
import { ModalToggleContext } from '../../Modals/Modal';
import { createPost } from '~/features/posts/postSlice';

const cx = classNames.bind(styles);
const mcx = classNames.bind(mStyles);

function PostForm() {
  const [media, setMedia] = useState('');
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
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        setMedia(reader.result);
      };
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrivacy = (privacy) => {
    setPrivacy(privacy);
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
  const PostSchema = Yup.object().shape({
    privacyOption: Yup.string(),
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
      privacyOption: privacyOptions[0].title,
      content: '',
      media: null,
      mediaType: '',
    },
    validationSchema: PostSchema,
    onSubmit: async () => {
      const formData = {
        privacy: formik.values?.privacyOption,
        content: formik.values?.content,
        mediaType: formik.values?.mediaType,
        media: formik.values?.media,
      };
      // console.log(formik.values);
      await dispatch(createPost(formData));
      toggleModal();
      formik.resetForm();
      mediaRef.current.value = '';
      setMedia('');
    },
  });

  return (
    <div className={cx('wrapper')}>
      <Avatar className={cx('avatar')} avatar={user.avatar?.url} medium />
      <Modal
        modalType="create-post"
        sz="small"
        btn={<div className={cx('input-btn')}>Write your post</div>}
      >
        <div className={mcx('heading')}>Create Post</div>
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
                      grayLight
                      type="button"
                      className={cx('edit-media')}
                      leftIcon={<FontAwesomeIcon icon={faPen} />}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('mediaInput').click();
                      }}
                    >
                      Edit
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
                      <Video src={media} thumbnail />
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
                    (formik.values.content || formik.values.media) &&
                      'can-post',
                  )}
                >
                  {
                    <Button
                      className={cx('post-post')}
                      type="submit"
                      sz="md"
                      disabled={!formik.values.content && !formik.values.media}
                    >
                      {isLoading ? <SpinIcon /> : 'Post'}
                    </Button>
                  }
                </div>
              </div>
            </div>
          </form>
        </Formik>
      </Modal>
    </div>
  );
}

export default PostForm;
