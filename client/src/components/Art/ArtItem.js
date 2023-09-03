import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

import styles from './ArtItem.module.scss';
import Avatar from '../Avatar';
import Button from '../Button';

const cx = classNames.bind(styles);

function ArtItem({ art }) {
  const [cardHover, setCardHover] = useState(false);
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
      <Link className={cx('img-thumb')} src={art.art?.url}>
        <img src={art.art?.url} alt="" />
        <div
          className={cx('dark-overlay', cardHover ? 'item-show' : 'item-hide')}
        ></div>
      </Link>
      <div className={cx('item-detail', cardHover ? 'item-show' : 'item-hide')}>
        <div>
          <Avatar avatar={art.author.avatar?.url} small />
          <div className={cx('detail')}>
            <div>{art.author?.username}</div>
            <span>{art?.description}</span>
          </div>
        </div>
        <Button leftIcon={<FontAwesomeIcon icon={faEllipsisVertical} />} />
      </div>
    </div>
  );
}

ArtItem.propTypes = {
  art: PropTypes.object,
};

export default ArtItem;
