import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { deletePost } from '~/features/posts/postSlice';
import Avatar from '~/components/Avatar';
import styles from './PostItem.module.scss';
import Menu from '~/components/Popper/Menu';
import Button from '~/components/Button';
import { ModalToggleContext } from '../../Modals/Modal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsisVertical,
  faPen,
  faRepeat,
} from '@fortawesome/free-solid-svg-icons';
import {
  faHeart,
  faMessage,
  faTrashCan,
} from '@fortawesome/free-regular-svg-icons';
import { faHeart as fullHeart } from '@fortawesome/free-solid-svg-icons';

import { useContext, useState } from 'react';
import Image from '~/components/Image';
import { toast } from 'react-toastify';
import CommentList from '~/components/Comment/CommentList';
import Video from '~/components/Video';
import CommentForm from '~/components/Comment/CommentForm/CommentForm';

const cx = classNames.bind(styles);

function PostItem({ post }) {
  const { isLiked, setIsLiked } = useState(post.liked);

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
      // dispatch(likeArt(art._id));
      setIsLiked(true);
    } else {
      // dispatch(unlikeArt(art._id));
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
          action: 'Edit Art',
          modal: true,
          post: post,
          onClick: handleEdit,
        },
        {
          leftIcon: <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>,
          title: 'Delete',
          action: 'Delete Art',
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
    <div className={cx('wrapper')}>
      <div className={cx('head')}>
        <div className={cx('user')}>
          <Avatar avatar={post.user.avatar?.url} medium />
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
              ? post.content
              : post.content.length > 200
              ? `${post.content.substring(0, 200)}...`
              : post.content}
            {post.content.length > 200 && (
              <Button onClick={toggleShowMore}>
                {showMore ? 'See less' : 'See more'}
              </Button>
            )}
          </p>
        )}
      </div>
      {post.likes?.length > 0 && post.comments?.length > 0 && (
        <div className={cx('views')}>
          <div className={cx('view')}>{post.likes?.length} like</div>
          <div className={cx('view')}>{post.comments?.length} comments</div>
        </div>
      )}
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
          <Button leftIcon={<FontAwesomeIcon icon={faMessage} />}>
            Comment
          </Button>
        </div>
        <div className={cx('action')}>
          <Button leftIcon={<FontAwesomeIcon icon={faRepeat} />}>Repost</Button>
        </div>
      </div>

      {post.comments.length > 0 && (
        <div className={cx('comments')}>
          <CommentList post={post._id} />
        </div>
      )}
      <div className={cx('comment-form')}>
        {user ? <CommentForm post_id={post._id} action="create" /> : null}
      </div>
    </div>
  );
}

export default PostItem;
