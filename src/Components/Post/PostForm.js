import classNames from 'classnames/bind';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { createPost } from '~/features/posts/postSlice';
import Button from '~/components/Button';
import Image from '~/components/Image';
import styles from './Post.module.scss';

const cx = classNames.bind(styles);

function PostForm() {
  const [text, setText] = useState('');

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(createPost({ text }));
    setText('');
  };

  const handleReset = () => {
    setText('');
  };

  return (
    <div className={cx('post')}>
      <form onSubmit={onSubmit}>
        <div className={cx('form-group')}>
          <Image src={user.avatar} className={cx('user-avatar')} alt="user" />
          <input
            type="text"
            className={cx('form-control')}
            name="text"
            id="text"
            value={text}
            placeholder="What are you thinking?"
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        {text ? (
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
