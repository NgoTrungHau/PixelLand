import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faEye, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fullHeart } from '@fortawesome/free-solid-svg-icons';

import styles from './ArtItem.module.scss';
import Avatar from '../../Avatar';
import Button from '../../Button';
import Image from '~/components/Image';
import Modal from '~/components/Modals/Modal';
import { likeArt, unlikeArt } from '~/features/arts/artSlice';

const cx = classNames.bind(styles);

function ArtItem({ key, art }) {
  const [cardHover, setCardHover] = useState(false);
  const [isLiked, setIsLiked] = useState(art.liked);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.arts);

  useEffect(() => {
    setIsLiked(art.liked);
  }, [art.liked]);

  const handleLike = () => {
    if (!user) {
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

  if (!art) {
    return null;
  }

  return (
    <div
      className={cx('item-card')}
      key={art.art?._id}
      onMouseEnter={() => setCardHover(true)}
      onMouseLeave={() => setCardHover(false)}
    >
      <Modal modalType="art-detail" data={art} sz="medium">
        <div className={cx('img-thumb')}>
          <Image src={art.art?.url} alt="" />
          <div
            className={cx(
              'dark-overlay',
              cardHover ? 'item-show' : 'item-hide',
            )}
          ></div>
        </div>
      </Modal>
      <div className={cx('item-detail', cardHover ? 'item-show' : 'item-hide')}>
        <div className={cx('actions-quantity')}>
          <span>
            <FontAwesomeIcon icon={faEye} />
            {Math.floor(Math.random() * (20000 - 1 + 1) + 1)}
          </span>
          <span>
            <FontAwesomeIcon icon={faHeart} />
            {Math.floor(Math.random() * (5000 - 1 + 1) + 1)}
          </span>
          <span>
            <FontAwesomeIcon icon={faComment} />
            {Math.floor(Math.random() * (1000 - 1 + 1) + 1)}
          </span>
        </div>
        <div className={cx('info-detail')}>
          <div className={cx('info')}>
            <Avatar avatar={art.author.avatar?.url} medium />
            <div className={cx('detail')}>
              <div>{art.author?.username}</div>
              <span>{art?.title}</span>
            </div>
          </div>
          <Button
            rounded
            disabled={isLoading ? true : false}
            leftIcon={
              isLiked ? (
                <FontAwesomeIcon icon={fullHeart} style={{ color: 'red' }} />
              ) : (
                <FontAwesomeIcon icon={faHeart} />
              )
            }
            onClick={handleLike}
          />
        </div>
      </div>
    </div>
  );
}

ArtItem.propTypes = {
  art: PropTypes.object,
};

export default ArtItem;
