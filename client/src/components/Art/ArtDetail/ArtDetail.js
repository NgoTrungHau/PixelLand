// classname
import classNames from 'classnames/bind';
// react
import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faMessage } from '@fortawesome/free-regular-svg-icons';
import {
  faEllipsisVertical,
  faPen,
  faRepeat,
  faTrashCan,
  faHeart as fullHeart,
} from '@fortawesome/free-solid-svg-icons';
// other
import moment from 'moment';

// css
import styles from './ArtDetail.module.scss';
import mStyles from '~/components/Modals/Modal.module.scss';

// features, function
import { deleteArt, viewArt } from '~/features/arts/artSlice';
import { ModalToggleContext } from '../../Modals/Modal';
import { ArtContext } from '../ArtItem/ArtItem';
// components
import Avatar from '~/components/Avatar';
import Image from '~/components/Image';
import Button from '~/components/Button';
import CommentForm from '~/components/Comment/CommentForm/CommentForm';
import Menu from '~/components/Popper/Menu';
import CommentList from '~/components/Comment/CommentList';
import { getCmts, reset } from '~/features/comments/commentSlice';

const cx = classNames.bind(styles);
const mcx = classNames.bind(mStyles);

function ArtDetail({ art }) {
  const { isLiked, handleLike } = useContext(ArtContext);
  const [isHover, setIsHover] = useState(false);
  const [showMore, setShowMore] = useState(false); // new state

  const toggleModal = useContext(ModalToggleContext);
  const dispatch = useDispatch();

  // get data from redux reducer
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.arts);

  useEffect(() => {
    dispatch(viewArt(art._id));
    if (user) {
      dispatch(getCmts(art._id));
    }
    return () => {
      dispatch(reset());
    };
  }, [art._id, dispatch, user]);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const handleEdit = () => {
    toggleModal();
  };
  const handleDelete = () => {
    dispatch(deleteArt(art._id));
    toggleModal();
  };

  const renderItems = () => {
    if (user?._id === art.author?._id) {
      return [
        {
          leftIcon: <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>,
          title: 'Edit',
          action: 'Edit Art',
          modal: true,
          art: art,
          onClick: handleEdit,
        },
        {
          leftIcon: <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>,
          title: 'Delete',
          action: 'Delete Art',
          content: 'Do you really want to delete this art?',
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
              avatar={art.author.avatar?.url}
              medium
            />
            <div className={cx('author-info')}>
              <div>{art.author?.username}</div>
              <p>{moment(art.createdAt).fromNow()}</p>
            </div>
          </div>
          <Menu items={renderItems()} hideOnClick offset={[0, 0]}>
            <Button className={cx('dropdown-btn')}>
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </Button>
          </Menu>
        </div>
        <div className={cx('art-detail')}>
          <div className={cx('title')}>{art.title}</div>
          <p className={cx('description')}>
            {showMore
              ? art.description
              : art.description.length > 200
              ? `${art.description.substring(0, 200)}...`
              : art.description}
            {art.description.length > 200 && (
              <Button onClick={toggleShowMore}>
                {showMore ? 'See less' : 'See more'}
              </Button>
            )}
          </p>
          <div className={cx('image-art')}>
            <Image src={art.art?.url} alt="" />
          </div>
        </div>
        <div className={cx('views')}>
          <div className={cx('view')}>{art.likes?.length} likes</div>
          <div className={cx('view')}>{art.comments?.length} comments</div>
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
        {user ? <CommentForm art_id={art._id} action="create" modal /> : null}
      </div>
    </div>
  );
}

export default ArtDetail;
