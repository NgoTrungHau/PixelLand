import classNames from 'classnames/bind';
// React
import { useSelector } from 'react-redux';

// scss
import styles from './CreatePost.module.scss';
// components
import Avatar from '~/components/Avatar';
import Modal from '~/components/Modals/Modal';
import PostForm from '../PostForm';

const cx = classNames.bind(styles);

function CreatePost() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className={cx('wrapper')}>
      <Avatar
        className={cx('avatar')}
        avatar={user.avatar?.url}
        to={user._id}
        medium
      />
      <Modal
        modalType="create-post"
        sz="small"
        btn={<div className={cx('input-btn')}>Create your post</div>}
      >
        <PostForm />
      </Modal>
    </div>
  );
}

export default CreatePost;
