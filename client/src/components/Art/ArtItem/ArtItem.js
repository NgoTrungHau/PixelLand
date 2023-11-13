import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
// react
import { createContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// font
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faEye, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fullHeart } from '@fortawesome/free-solid-svg-icons';

// scss
import styles from './ArtItem.module.scss';
// components
import Avatar from '../../Avatar';
import Button from '../../Button';
import Image from '~/components/Image';
import Modal from '~/components/Modals/Modal';
// features
import { likeArt, unlikeArt } from '~/features/arts/artSlice';

const cx = classNames.bind(styles);

export const ArtContext = createContext();

function ArtItem({ key, art }) {
  const [cardHover, setCardHover] = useState(false);
  const [isLiked, setIsLiked] = useState(art.liked);
  const isGif = art?.art?.url.toLowerCase().endsWith('.gif');

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLike = () => {
    if (!user) {
      toast.error('Not logged in yet!');
      return;
    }
    if (!isLiked) {
      dispatch(likeArt(art._id));
      setIsLiked(true);
    } else {
      dispatch(unlikeArt(art._id));
      setIsLiked(false);
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
      <ArtContext.Provider value={{ isLiked, handleLike }}>
        <Modal modalType="art-detail" data={art} sz="medium">
          <div className={cx('img-thumb')}>
            <Image src={art.art?.url} alt="" />
            <div
              className={cx(
                'dark-overlay',
                cardHover ? 'item-show' : 'item-hide',
              )}
            ></div>
            {isGif && <div className={cx('isGif')}>GIF</div>}
          </div>
        </Modal>
      </ArtContext.Provider>
      <div className={cx('item-detail', cardHover ? 'item-show' : 'item-hide')}>
        <div className={cx('actions-quantity')}>
          <span>
            <FontAwesomeIcon icon={faEye} />
            {art.views}
          </span>
          <span>
            <FontAwesomeIcon icon={faHeart} />
            {art.likes?.length}
          </span>
          <span>
            <FontAwesomeIcon icon={faComment} />
            {art.comments?.length}
          </span>
        </div>
        <div className={cx('info-detail')}>
          <div className={cx('info')}>
            <Avatar
              avatar={art.author.avatar?.url}
              to={art.author._id}
              medium
            />
            <div className={cx('detail')}>
              <div>{art.author?.username}</div>
              <span>{art?.title}</span>
            </div>
          </div>
          <Button
            rounded
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
