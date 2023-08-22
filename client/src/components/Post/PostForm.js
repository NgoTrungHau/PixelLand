import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import imageCompression from 'browser-image-compression';

import { createPost } from '~/features/posts/postSlice';
import Button from '~/components/Button';
import Avatar from '~/components/Avatar';
import styles from './Post.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function PostForm() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(createPost({ image, content }));
    e.target.value = '';
    setContent('');
    setImage('');
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = function () {
        setImage(reader.result);
      };
    } catch (error) {
      console.error(error);
    }

    e.target.value = '';
  };

  const handleReset = (e) => {
    e.target.value = '';
    setContent('');
    setImage('');
  };

  return (
    <div className={cx('post')}>
      <form onSubmit={onSubmit}>
        <div className={cx('form-group')}>
          <Avatar avatar={user.avatar?.url} medium />
          <input
            type="text"
            className={cx('form-control')}
            name="text"
            id="text"
            value={content}
            placeholder="What are you thinking?"
            onChange={(e) => setContent(e.target.value)}
          />
          <label htmlFor="imgInput" className={cx('img-input-icon')}>
            <FontAwesomeIcon icon={faImage}></FontAwesomeIcon>
            <input
              type="file"
              id="imgInput"
              className={cx('form-control')}
              accept="image/*"
              onChange={handleImage}
              style={{ display: 'none' }}
            />
          </label>
        </div>
        {image && (
          <div className={cx('img-post')}>
            <img src={image} alt="" />
          </div>
        )}
        {(content || image) && (
          <div className={cx('form-group')}>
            <div className={cx('btn-post')}>
              <Button gray onClick={handleReset}>
                Cancel
              </Button>
              <Button primary type="submit">
                Post
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default PostForm;
