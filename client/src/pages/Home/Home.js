import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';

import PostList from '~/components/Post/PostList';
import styles from './Home.module.scss';
import CreatePost from '~/components/Post/PostButton/CreatePost';

const cx = classNames.bind(styles);

function Home() {
  const { user } = useSelector((state) => state.auth);

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
