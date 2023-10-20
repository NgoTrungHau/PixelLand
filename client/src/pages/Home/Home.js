import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';

import PostForm from '~/components/Post/PostForm';
import PostList from '~/components/Post/PostList';
import styles from './Home.module.scss';

const cx = classNames.bind(styles);

function Home() {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return null;
  }

  return (
    <div className={cx('wrapper')}>
      <PostForm />
      <PostList />
    </div>
  );
}

export default Home;
