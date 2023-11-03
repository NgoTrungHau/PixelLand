import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import { ArtList } from '~/components/Art/';
import styles from './Gallery.module.scss';
import Button from '~/components/Button';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getArts, getAuthArts } from '~/features/arts/artSlice';

const cx = classNames.bind(styles);

function Gallery() {
  const [page, setPage] = useState(0);
  const loadingArtsRef = useRef(false); // reference for API call status

  const dispatch = useDispatch();

  const { user, hasCheckedUser } = useSelector((state) => state.auth);
  const { isArtsLoading } = useSelector((state) => state.arts);

  useEffect(() => {
    const handleScroll = () => {
      if (
        !isArtsLoading &&
        window.innerHeight + document.documentElement.scrollTop + 1 >=
          document.documentElement.scrollHeight
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isArtsLoading]);
  // useEffect
  useEffect(() => {
    if (hasCheckedUser && !loadingArtsRef.current) {
      loadingArtsRef.current = true; // set loading to true before API call
      if (user) {
        dispatch(
          getAuthArts({
            token: user.tokens.access_token,
            page: page,
          }),
        ).then(() => {
          loadingArtsRef.current = false; // set loading to false after API call
        });
      } else {
        dispatch(getArts(page)).then(() => {
          loadingArtsRef.current = false; // set loading to false after API call
        });
      }
    }
  }, [page, hasCheckedUser, user, dispatch]);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('picture-of-the-year')}>
        <img
          src="https://images.spiderum.com/sp-images/e23fb6106b6311e79bfac15c19b53ca4.png"
          alt=""
        />
        <div className={cx('ribbon')}>
          <Button leftIcon={<FontAwesomeIcon icon={faStar} />}>
            Wallpaper of the year
          </Button>
        </div>
      </div>
      <ArtList page={page} />
    </div>
  );
}

export default Gallery;
