import classNames from 'classnames/bind';
// React
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';

// scss
import styles from './Home.module.scss';
// components
import CreatePost from '~/components/Post/PostButton/CreatePost';
import PostList from '~/components/Post/PostList';
// features
import { getPosts, reset } from '~/features/posts/postSlice';

const cx = classNames.bind(styles);

function Home() {
  const [page, setPage] = useState(0);
  const loadingPostsRef = useRef(false); // reference for API call status

  const dispatch = useDispatch();

  const { user, hasCheckedUser } = useSelector((state) => state.auth);
  const { isPostsLoading } = useSelector((state) => state.posts);
  useEffect(() => {
    // Dispatch the reset action when the component mounts
    dispatch(reset());
  }, [dispatch]);
  useEffect(() => {
    const handleScroll = () => {
      if (
        !isPostsLoading &&
        window.innerHeight + document.documentElement.scrollTop + 1 >=
          document.documentElement.scrollHeight
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPostsLoading]);
  useEffect(() => {
    if (hasCheckedUser && !loadingPostsRef.current) {
      loadingPostsRef.current = true; // set loading to true before API call

      if (user) {
        dispatch(getPosts(page)).then(() => {
          loadingPostsRef.current = false; // set loading to false after API call
        });
      }
    }
  }, [page, hasCheckedUser, user, dispatch]);

  if (!user) {
    return null;
  }

  return (
    <div className={cx('wrapper')}>
      <div className={cx('create-post')}>
        <CreatePost />
      </div>
      <PostList />
    </div>
  );
}

export default Home;
