import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
// React
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// Font
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faMessage,
  faTrashCan,
} from '@fortawesome/free-regular-svg-icons';
import {
  faArrowRightLong,
  faEllipsisVertical,
  faPen,
  faHeart as fullHeart,
} from '@fortawesome/free-solid-svg-icons';

// scss
import styles from './CommentItem.module.scss';
// components
import Avatar from '../../Avatar';
import Button from '../../Button';
import Image from '~/components/Image';
import Menu from '~/components/Popper/Menu';
import CommentList from '../CommentList';
import CommentForm from '../CommentForm/CommentForm';
import shortenMoment from '~/components/shortenMoment/shortenMoment';

// features
import {
  deleteCmt,
  likeCmt,
  unlikeCmt,
} from '~/features/comments/commentSlice';
import Video from '~/components/Video';

const cx = classNames.bind(styles);

function CommentItem({ key, cmt }) {
  const [isLiked, setIsLiked] = useState(cmt?.liked);
  const [isEdit, setIsEdit] = useState(false);
  const [editing, setEditing] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [showReply, setShowReply] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.comments);

  useEffect(() => {
    if (!isLoading) {
      setEditing(false);
    }
  }, [isLoading]);

  const handleLike = () => {
    if (!user) {
      toast.error('Not logged in yet!');
      return;
    }

    if (!isLiked) {
      dispatch(likeCmt(cmt._id));
      setIsLiked(true);
    } else {
      dispatch(unlikeCmt(cmt._id));
      setIsLiked(false);
    }
  };
  const handleEdit = () => {
    setIsEdit(!isEdit);
    setEditing(true);
  };
  const cancelEdit = () => {
    setIsEdit(false);
    setEditing(false);
  };
  const handleReply = () => {
    setIsReply(!isReply);
    showReplies();
  };
  const cancelReply = () => {
    setIsReply(!isReply);
  };
  const showReplies = () => {
    setShowReply(true);
  };
  const handleDelete = () => {
    dispatch(deleteCmt(cmt));
  };

  if (!cmt) {
    return null;
  }
  const renderItems = () => {
    if (user?._id === cmt.commentedBy?._id) {
      return [
        {
          leftIcon: <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>,
          title: 'Edit',
          action: 'Edit Comment',
          onClick: handleEdit,
        },
        {
          leftIcon: <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>,
          title: 'Delete',
          action: 'Delete Comment',
          content: 'Do you really want to delete this comment?',
          isLoading: isLoading,
          modal: true,
          onClick: handleDelete,
        },
      ];
    } else {
      return [
        {
          // leftIcon: (
          //   <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
          // ),
          title: 'Report',
        },
      ];
    }
  };

  const renderLikeNumbers = () => {
    if (cmt.likedBy.length > 0) {
      return cmt.likedBy.length + ' likes';
    } else {
      return '0 like';
    }
  };

  if (isEdit) {
    return (
      <div className={cx('wrapper-edit')}>
        <CommentForm cmt={cmt} action="edit" onClick={handleEdit} />
        <div className={cx('cancel-btn')}>
          <Button onClick={cancelEdit}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cx('wrapper')} key={cmt._id}>
      <Avatar
        avatar={cmt.commentedBy.avatar?.url}
        to={cmt.commentedBy._id}
        medium
      />
      <div className={cx('detail')}>
        <div className={cx('detail-head')}>
          <div className={cx('content-menu')}>
            <div className={cx('content', cmt.content && 'have-content')}>
              <div className={cx('head-content')}>
                <div>{cmt.commentedBy?.username}</div>
                <p>{shortenMoment(cmt?.createdAt)}</p>
              </div>
              <p>{cmt.content}</p>
            </div>
            <Menu
              className={cx('menu')}
              items={renderItems()}
              hideOnClick
              offset={[0, 0]}
            >
              <Button className={cx('dropdown-btn')}>
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </Button>
            </Menu>
          </div>

          {cmt.media?.url && (
            <div className={cx('media')}>
              {cmt.media?.type === 'video' ? (
                <Video src={cmt.media?.url} controls autoPlay muted loop />
              ) : (
                <Image src={cmt.media?.url} alt="" />
              )}
            </div>
          )}
          {editing && <div className={cx('editing')}>posting...</div>}
          <div className={cx('actions')}>
            <div className={cx('action')} onClick={handleLike}>
              <Button
                className={isLiked ? cx('liked') : null}
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
            {!cmt?.parentCommentId && (
              <div
                className={cx('action')}
                onClick={() => {
                  setIsReply(true);
                }}
              >
                <Button leftIcon={<FontAwesomeIcon icon={faMessage} />}>
                  Reply
                </Button>
              </div>
            )}
            <div className={cx('action')}>
              <Button>{renderLikeNumbers()}</Button>
            </div>
          </div>
        </div>
        {(cmt.replies.length > 0 || isReply) && (
          <div className={cx('replies')}>
            {cmt.replies.length > 0 && (
              <div className={cx('reply')} onClick={showReplies}>
                {showReply ? (
                  <CommentList replies={cmt.replies} />
                ) : (
                  <div className={cx('reply-length')}>
                    <Button
                      leftIcon={<FontAwesomeIcon icon={faArrowRightLong} />}
                    >
                      {cmt.replies.length + ' replies'}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {isReply && (
              <div>
                <CommentForm cmt={cmt} action="reply" onClick={handleReply} />
                <div className={cx('cancel-btn')}>
                  <Button onClick={cancelReply}>Cancel</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

CommentItem.propTypes = {
  cmt: PropTypes.object,
};

export default CommentItem;
