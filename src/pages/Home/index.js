import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Home.module.scss';
import PostForm from '~/components/Post/PostForm';
import PostItem from '~/components/Post/PostItem';
import { getPosts, reset } from '~/features/posts/postSlice';

const cx = classNames.bind(styles);

function Home() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { posts, isLoading, isError, message } = useSelector(
    (state) => state.posts,
  );

  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      setIsLogin(true);
    }

    dispatch(getPosts());

    return () => {
      dispatch(reset());
    };
  }, [user, isError, message, dispatch]);

  if (isLoading) {
    return (
      <div className={cx('wrapper')}>
        <FontAwesomeIcon icon={faSpinner} />
      </div>
    );
  }

  return (
    <div className={cx('wrapper')}>
      {isLogin ? (
        <>
          <h3>Please log in</h3>
        </>
      ) : (
        <>
          <section className="heading">
            <h1>Welcome {user && user.name}</h1>
            <p>Posts Dashboard</p>
          </section>

          <PostForm />

          <section className="content">
            {posts.length > 0 ? (
              <div className="posts">
                {posts.map((post) => (
                  <PostItem key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <h3>You have not set any posts</h3>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Home;
