// classname
import classNames from 'classnames/bind';
// react
import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
// validation
import { Formik, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
// Icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faMessage } from '@fortawesome/free-regular-svg-icons';
import {
  faEllipsisVertical,
  faRepeat,
  faHeart as fullHeart,
} from '@fortawesome/free-solid-svg-icons';
// other
import moment from 'moment';

// css
import styles from './ArtDetail.module.scss';
// features, function
import { createArt, likeArt, unlikeArt } from '~/features/arts/artSlice';
import { ModalToggleContext } from '../../Modals/Modal';
// components
import Avatar from '~/components/Avatar';
import Image from '~/components/Image';
import Button from '~/components/Button';
import CommentForm from '~/components/Comment/CommentForm/CommentForm';
import OverlayScrollbar from '~/components/OverlayScrollbar';

const cx = classNames.bind(styles);

function ArtDetail({ art }) {
  const [isLiked, setIsLiked] = useState(art.liked);

  const toggleModal = useContext(ModalToggleContext);
  const dispatch = useDispatch();

  // get data from redux reducer
  const { user } = useSelector((state) => state.auth);
  const { arts, isLoading, isError, message } = useSelector(
    (state) => state.arts,
  );

  const handleLike = () => {
    if (user == null) {
      toast.error('Not logged in yet!');
      return;
    }
    setIsLiked(!isLiked);
    if (!isLiked) {
      dispatch(likeArt({ art_id: art._id, user_id: user._id }));
    } else {
      dispatch(unlikeArt({ art_id: art._id, user_id: user._id }));
    }
  };

  useEffect(() => {
    setIsLiked(art.liked);
  }, [art.liked]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [user, arts, isError, message, dispatch]);

  // validation
  const ArtSchema = Yup.object().shape({
    title: Yup.string(),
    description: Yup.string(),
    art: Yup.string().required('An image is required'),
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      art: '',
    },
    validationSchema: ArtSchema,
    onSubmit: () => {
      dispatch(createArt(formik.values));
      formik.resetForm();
    },
  });

  return (
    <div className={cx('wrapper')}>
      <OverlayScrollbar className={cx('detail')}>
        <div className={cx('head')}>
          <div className={cx('author')}>
            <Avatar avatar={art.author.avartar?.url} medium />
            <div className={cx('author-info')}>
              <h4>{art.author?.username}</h4>
              <h5>{moment(art.createdAt).fromNow()}</h5>
            </div>
          </div>
          <Button>
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </Button>
        </div>
        <div className={cx('art-detail')}>
          <div className={cx('title')}>{art.title}</div>
          <p className={cx('description')}>{art.description}</p>
          <div className={cx('image-art')}>
            <Image src={art.art?.url} alt="" />
          </div>
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
      </OverlayScrollbar>
      <div className={cx('comments')}>{user ? <CommentForm /> : null}</div>
    </div>
  );
}

export default ArtDetail;
