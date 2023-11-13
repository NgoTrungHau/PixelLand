import classNames from 'classnames/bind';
// React
import { createContext, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// Font awesome
import {
  faHeart,
  faMessage,
  faTrashCan,
} from '@fortawesome/free-regular-svg-icons';
import {
  faEllipsisVertical,
  faPen,
  faRepeat,
  faHeart as fullHeart,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// other
import moment from 'moment';

// scss
import styles from './PostItem.module.scss';
// components
import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import CommentForm from '~/components/Comment/CommentForm/CommentForm';
import CommentList from '~/components/Comment/CommentList';
import Image from '~/components/Image';
import Menu from '~/components/Popper/Menu';
import Video from '~/components/Video';
// features
import { deletePost, likePost, unlikePost } from '~/features/posts/postSlice';
import Modal, { ModalToggleContext } from '../../Modals/Modal';

const cx = classNames.bind(styles);

export const PostContext = createContext();

function PostItem({ post }) {
  const [isLiked, setIsLiked] = useState(post.liked);

  const [showMore, setShowMore] = useState(false); // new state

  const dispatch = useDispatch();
  const toggleModal = useContext(ModalToggleContext);

  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.posts);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const handleLike = () => {
    if (!user) {
      toast.error('Not logged in yet!');
      return;
    }
    if (!isLiked) {
      dispatch(likePost(post._id));
      setIsLiked(true);
    } else {
      dispatch(unlikePost(post._id));
      setIsLiked(false);
    }
  };
  const handleEdit = () => {
    toggleModal();
  };
  const handleDelete = async () => {
    await dispatch(deletePost(post._id));
    toggleModal();
  };

  const renderItems = () => {
    if (user?._id === post.user?._id) {
      return [
        {
          leftIcon: <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>,
          title: 'Edit',
          action: 'Edit Post',
          modal: true,
          post: post,
          onClick: handleEdit,
        },
        {
          leftIcon: <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>,
          title: 'Delete',
          action: 'Delete Post',
          content: 'Do you really want to delete this post?',
          isLoading: isLoading,
          modal: true,
          onClick: handleDelete,
        },
      ];
    } else {
      return [
        {
          title: 'Report',
        },
      ];
    }
  };

  return (
    <PostContext.Provider value={{ isLiked, handleLike }}>
      <div className={cx('wrapper')}>
        <div className={cx('head')}>
          <div className={cx('user')}>
            <Avatar avatar={post.user?.avatar?.url} to={post.user._id} medium />
            <div className={cx('user-info')}>
              <div>{post.user?.username}</div>
              <p>{moment(post.createdAt).fromNow()}</p>
            </div>
          </div>
          <Menu items={renderItems()} hideOnClick offset={[0, 0]}>
            <Button className={cx('dropdown-btn')}>
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </Button>
          </Menu>
        </div>
        <div className={cx('post-detail')}>
          {post.media?.url && (
            <div className={cx('media-post')}>
              {post.media?.mediaType === 'image' ? (
                <Image src={post.media?.url} alt="" />
              ) : (
                <Video src={post.media?.url} controls autoPlay muted loop />
              )}
            </div>
          )}
          {post?.content && (
            <p className={cx('content')}>
              {showMore
                ? post?.content
                : post?.content?.length > 200
                ? `${post?.content.substring(0, 200)}...`
                : post?.content}
              {post?.content?.length > 200 && (
                <Button onClick={toggleShowMore}>
                  {showMore ? 'See less' : 'See more'}
                </Button>
              )}
            </p>
          )}
        </div>
        {
          <div className={cx('views')}>
            {post.likes?.length > 0 && (
              <div className={cx('view')}>{post.likes?.length} likes</div>
            )}
            {post.comments?.length > 0 && (
              <Modal modalType="post-detail" data={post} sz="medium">
                <div className={cx('view')}>
                  {post.comments?.length} comments
                </div>
              </Modal>
            )}
          </div>
        }
        <div className={cx('actions')}>
          <div className={cx('action')} onClick={handleLike}>
            <Button
              className={isLiked ? cx('btn-red') : null}
              leftIcon={
                isLiked ? (
                  <FontAwesomeIcon icon={fullHeart} />
                ) : (
                  <FontAwesomeIcon icon={faHeart} />
                )
              }
            >
              Like
            </Button>
          </div>
          <div className={cx('action')}>
            <Modal modalType="post-detail" data={post} sz="medium">
              <Button leftIcon={<FontAwesomeIcon icon={faMessage} />}>
                Comment
              </Button>
            </Modal>
          </div>
          <div className={cx('action')}>
            <Button leftIcon={<FontAwesomeIcon icon={faRepeat} />}>
              Repost
            </Button>
          </div>
        </div>

        {post?.comments?.length > 0 && (
          <Modal modalType="post-detail" data={post} sz="medium">
            <Button className={cx('view-more-cmts')}>View more comments</Button>
          </Modal>
        )}
        {post?.comments?.length > 0 && (
          <div className={cx('comments')}>
            <CommentList postCmts={post?.comments} />
          </div>
        )}
        <div className={cx('comment-form')}>
          {user ? <CommentForm post_id={post._id} action="create" /> : null}
        </div>
      </div>
    </PostContext.Provider>
  );
}

export default PostItem;
