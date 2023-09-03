import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { deletePost } from '~/features/posts/postSlice';
import Avatar from '~/components/Avatar';
import styles from './Post.module.scss';

const cx = classNames.bind(styles);

function PostItem({ post }) {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  return (
    <div className={cx('post')}>
      <div className={cx('info')}>
        <Avatar avatar={post.user.avatar?.url} medium />
        <div>
          <h4>{post.user.username}</h4>
          <h5>{moment(post.createdAt).fromNow()}</h5>
        </div>
      </div>
      <p>{post.content}</p>
      <img src={post.image?.url} alt="" />
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
