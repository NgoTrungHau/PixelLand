import classNames from 'classnames/bind';
// React
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// scss
import styles from './PostList.module.scss';
// components
import PostItem from '~/components/Post/PostItem';
import { reset } from '~/features/posts/postSlice';

const cx = classNames.bind(styles);

function PostList() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { posts, isPostsLoading, isError, message } = useSelector(
    (state) => state.posts,
  );

  const cards_sample = Array(2)
    .fill(undefined)
    .map((a, i) => (
      <div className={cx('post-thumb-sample')} key={i}>
        <div className={cx('post-user-sample')}>
          <div className={cx('post-avatar-sample')}></div>
          <div className={cx('post-username-sample')}>
            <div className={cx('post-username-sample-1')}></div>
            <div className={cx('post-username-sample-2')}></div>
          </div>
        </div>
        <div className={cx('post-actions-sample')}>
          <div className={cx('post-action-sample')}></div>
          <div className={cx('post-action-sample')}></div>
          <div className={cx('post-action-sample')}></div>
        </div>
      </div>
    ));
  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch]);

  if (!user) {
    return null;
  }
  return (
    <>
      <div className={cx('wrapper')}>
        <section className={cx('content')}>
          {posts.length > 0 && (
            <div className={cx('posts')}>
              {posts.map((post) => (
                <PostItem key={post._id} post={post} />
              ))}
            </div>
          )}
        </section>
      </div>
      {isPostsLoading && cards_sample}
    </>
  );
}

export default PostList;
