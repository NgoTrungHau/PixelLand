import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import styles from './PostList.module.scss';
import PostItem from '~/components/Post/PostItem';
import { getPosts, reset } from '~/features/posts/postSlice';
import SpinIcon from '~/components/SpinIcon';

const cx = classNames.bind(styles);

function PostList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { posts, isPostsLoading, isError, message } = useSelector(
    (state) => state.posts,
  );
  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate('/');
    }
    dispatch(getPosts());
    // return () => {
    //   dispatch(reset());
    // };
  }, [user, navigate, isError, message, dispatch]);
  if (!user) {
    return null;
  }

  return (
    <div className={cx('wrapper')}>
      {isPostsLoading ? (
        <SpinIcon />
      ) : (
        <section className={cx('content')}>
          {posts.length > 0 ? (
            <div className={cx('posts')}>
              {posts.map((post) => (
                <PostItem key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <h3>There are no posts</h3>
          )}
        </section>
      )}
    </div>
  );
}

export default PostList;
