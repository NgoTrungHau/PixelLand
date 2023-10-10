import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComment,
  faEye,
  faHeart,
  faMessage,
  faTrashCan,
} from '@fortawesome/free-regular-svg-icons';
import {
  faEllipsisVertical,
  faPen,
  faHeart as fullHeart,
} from '@fortawesome/free-solid-svg-icons';

import styles from './CommentItem.module.scss';
import Avatar from '../../Avatar';
import Button from '../../Button';
import Image from '~/components/Image';
import Menu from '~/components/Popper/Menu';
import moment from 'moment';
import {
  deleteCmt,
  likeCmt,
  unlikeCmt,
} from '~/features/comments/commentSlice';
import { ModalToggleContext } from '../../Modals/Modal';

const cx = classNames.bind(styles);

function CommentItem({ key, cmt }) {
  const [isLiked, setIsLiked] = useState(cmt.liked);
  const [liking, setLiking] = useState(false); // This state to prevent immediate re-likes
  const [isEdit, setIsEdit] = useState(false);
  const toggleModal = useContext(ModalToggleContext);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.comments);

  useEffect(() => {
    setIsLiked(cmt.liked);
  }, [cmt.liked]);
  useEffect(() => {
    console.log(isLiked);
  }, [isLiked]);

  const handleLike = async () => {
    if (!liking) {
      setLiking(true); // Prevent further likes until server responds
      setIsLiked(!isLiked);
      if (!isLiked) {
        await dispatch(likeCmt(cmt._id));
      } else {
        await dispatch(unlikeCmt(cmt._id));
      }
      setLiking(false); // Allow liking/unliking again
    }
  };
  const handleEdit = () => {
    setIsEdit(!isEdit);
  };
  const handleDelete = () => {
    dispatch(deleteCmt(cmt._id));
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
          modal: true,
          onClick: handleEdit,
        },
        {
          leftIcon: <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>,
          title: 'Delete',
          action: 'Delete Comment',
          content: 'Do you really want to delete this comment?',
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

  return (
    <div className={cx('wrapper')} key={cmt._id}>
      <Avatar avatar={cmt.commentedBy.avatar?.url} medium />
      <div className={cx('detail')}>
        <div className={cx('content-menu')}>
          <div className={cx('content', cmt.content && 'have-content')}>
            <div>{cmt.commentedBy?.username}</div>
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
          <Image className={cx('media')} src={cmt.media?.url} />
        )}
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
          <div className={cx('action')}>
            <Button leftIcon={<FontAwesomeIcon icon={faMessage} />}>
              Reply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

CommentItem.propTypes = {
  cmt: PropTypes.object,
};

export default CommentItem;
