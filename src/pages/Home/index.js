import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Home.module.scss';
import PostForm from '~/components/Post/PostForm';
import PostItem from '~/components/Post/PostItem';
import { getPosts, reset } from '~/features/posts/postSlice';

const cx = classNames.bind(styles);

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { posts, isLoading, isError, message } = useSelector(
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

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  return (
    <div className={cx('wrapper')}>
      {!user ? (
        <>
          <h3>Please log in</h3>
        </>
      ) : (
        <>
          <PostForm />

          {isLoading ? (
            <div className={cx('SpinIcon')}>
              <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />
            </div>
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
        </>
      )}
    </div>
  );
}

export default Home;
