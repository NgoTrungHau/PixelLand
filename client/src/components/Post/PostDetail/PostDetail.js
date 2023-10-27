// classname
import classNames from 'classnames/bind';
// react
import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Icon
import { faHeart, faMessage } from '@fortawesome/free-regular-svg-icons';
import {
  faEllipsisVertical,
  faPen,
  faRepeat,
  faTrashCan,
  faHeart as fullHeart,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// other
import moment from 'moment';

// css
import mStyles from '~/components/Modals/Modal.module.scss';
import styles from './PostDetail.module.scss';

// features, function
import { deletePost } from '~/features/posts/postSlice';
import { ModalToggleContext } from '../../Modals/Modal';
import { PostContext } from '../PostItem/PostItem';
// components
import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import CommentForm from '~/components/Comment/CommentForm/CommentForm';
import CommentList from '~/components/Comment/CommentList';
import Image from '~/components/Image';
import Menu from '~/components/Popper/Menu';
import { getCmts, reset } from '~/features/comments/commentSlice';
import Video from '~/components/Video';

const cx = classNames.bind(styles);
const mcx = classNames.bind(mStyles);

function PostDetail({ post }) {
  const { isLiked, handleLike } = useContext(PostContext);
  const [isHover, setIsHover] = useState(false);
  const [showMore, setShowMore] = useState(false); // new state
  const loadingCmtsRef = useRef(false); // reference for API call status

  const toggleModal = useContext(ModalToggleContext);
  const dispatch = useDispatch();

  // get data from redux reducer
  const { user, hasCheckedUser } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.posts);

  useEffect(() => {
    if (hasCheckedUser && !loadingCmtsRef.current) {
      loadingCmtsRef.current = true; // set loading to true before API call

      if (user) {
        dispatch(getCmts(post._id)).then(() => {
          loadingCmtsRef.current = false; // set loading to false after API call
        });
      }
    }
    return () => {
      dispatch(reset());
    };
  }, [post._id, dispatch, user, hasCheckedUser]);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const handleEdit = () => {
    toggleModal();
  };
  const handleDelete = () => {
    dispatch(deletePost(post._id));
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
    <div className={cx('wrapper')}>
      <div className={mcx('heading')}></div>
      <div
        className={cx('detail', {
          'scroll-show': isHover,
          'scroll-hide': !isHover,
        })}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div className={cx('head')}>
          <div className={cx('author')}>
            <Avatar
              className={cx('avt')}
              avatar={post.user.avatar?.url}
              medium
            />
            <div className={cx('author-info')}>
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
          <div className={cx('title')}>{post.title}</div>
          <p className={cx('content')}>
            {showMore
              ? post?.content
              : post?.content?.length > 200
              ? `${post?.content?.substring(0, 200)}...`
              : post?.content}
            {post?.content?.length > 200 && (
              <Button onClick={toggleShowMore}>
                {showMore ? 'See less' : 'See more'}
              </Button>
            )}
          </p>
          {post?.media?.url && (
            <div className={cx('media-post')}>
              {post.media?.mediaType === 'image' ? (
                <Image src={post.media?.url} alt="" />
              ) : (
                <Video src={post.media?.url} controls autoPlay muted loop />
              )}
            </div>
          )}
        </div>
        <div className={cx('views')}>
          <div className={cx('view')}>{post.likes?.length} likes</div>
          <div className={cx('view')}>{post.comments?.length} comments</div>
        </div>
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
            <Button leftIcon={<FontAwesomeIcon icon={faRepeat} />}>
              Repost
            </Button>
          </div>
        </div>

        <div className={cx('comments')}>
          <CommentList />
        </div>
      </div>
      <div className={cx('comment-form')}>
        {user ? <CommentForm post_id={post._id} action="create" modal /> : null}
      </div>
    </div>
  );
}

export default PostDetail;
