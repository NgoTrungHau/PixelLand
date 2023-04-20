import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import moment from 'moment';

import * as httpRequest from '~/utils/httpRequest';
import { deletePost } from '~/features/posts/postSlice';
import { getUserInfo } from '~/features/users/userSlice';
import Image from '~/components/Image';
import styles from './Post.module.scss';

const cx = classNames.bind(styles);

function PostItem({ post }) {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  return (
    <div className={cx('post')}>
      <div className={cx('info')}>
        <Image
          src={post.user.avatar}
          className={cx('user-avatar')}
          alt="user"
        />
        <div>
          <h4>{post.user.username}</h4>
          <h4>{moment(post.createdAt).fromNow()}</h4>
        </div>
      </div>
      <h2>{post.text}</h2>
      {user._id === post.user._id && (
        <button
          onClick={() => dispatch(deletePost(post._id))}
          className={cx('close')}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      )}
    </div>
  );
}

export default PostItem;
