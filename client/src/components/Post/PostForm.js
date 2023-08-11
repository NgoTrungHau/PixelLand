import classNames from 'classnames/bind';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { createPost } from '~/features/posts/postSlice';
import Button from '~/components/Button';
import Avatar from '~/components/Avatar';
import styles from './Post.module.scss';

const cx = classNames.bind(styles);

function PostForm() {
  const [content, setContent] = useState('');

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(createPost({ content }));
    setContent('');
  };

  const handleReset = () => {
    setContent('');
  };

  return (
    <div className={cx('post')}>
      <form onSubmit={onSubmit}>
        <div className={cx('form-group')}>
          <Avatar avatar={user.avatar} medium />
          <input
            type="text"
            className={cx('form-control')}
            name="text"
            id="text"
            value={content}
            placeholder="What are you thinking?"
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        {content ? (
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
        ) : null}
      </form>
    </div>
  );
}

export default PostForm;
