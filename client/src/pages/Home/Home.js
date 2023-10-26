import classNames from 'classnames/bind';
// React
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

// scss
import styles from './Home.module.scss';
// components
import CreatePost from '~/components/Post/PostButton/CreatePost';
import PostList from '~/components/Post/PostList';
// features
import { getPosts } from '~/features/posts/postSlice';

const cx = classNames.bind(styles);

function Home() {
  const [page, setPage] = useState(0);

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { isPostsLoading } = useSelector((state) => state.posts);

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
    dispatch(getPosts(page));
  }, [page, dispatch]);

  if (!user) {
    return null;
  }

  return (
    <div className={cx('wrapper')}>
      <CreatePost />
      <PostList />
    </div>
  );
}

export default Home;
