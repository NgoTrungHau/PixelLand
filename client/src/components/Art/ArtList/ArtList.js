import classNames from 'classnames/bind';
import { Masonry } from '@mui/lab';
import { useEffect, useState, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';

import { getArts, getAuthArts, reset } from '~/features/arts/artSlice';

import styles from './ArtList.module.scss';
import ArtItem from '../ArtItem/ArtItem';

const cx = classNames.bind(styles);

const MemoizedArtItem = memo(({ art, index }) => (
  <ArtItem key={index} art={art} />
));

function ArtList() {
  const [isArtsReady, setIsArtsReady] = useState(false);

  const { arts, isArtsLoading, isSuccess, isError, message } = useSelector(
    (state) => state.arts,
  );
  const { user } = useSelector((state) => state.auth);

  const cards_sample = Array(12)
    .fill(undefined)
    .map((a, i) => <div className={cx('card-thumb-sample')} key={i}></div>);

  const setArtsReadyDebounced = useCallback(
    debounce(() => setIsArtsReady(true), 1000),
    [],
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect
  useEffect(() => {
    if (user) {
      dispatch(getAuthArts({ user_id: user._id, token: user.token }));
    }
    if (!user) {
      dispatch(getArts());
    }
  }, [navigate]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
    }
    if (isSuccess && message) {
      toast.success(message);
    }
    // if (navigate) {
    //   dispatch(reset());
    // }
  }, [navigate, message, dispatch]);

  useEffect(() => {
    setArtsReadyDebounced();
  }, [arts, navigate, dispatch, setArtsReadyDebounced]);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('art-options')}>
        {!isArtsLoading && (
          <>
            <div className={cx('option')}>popular</div>
            <div className={cx('option')}>staff pick</div>
            <div className={cx('option')}>digital art</div>
            <div className={cx('option')}>fan art</div>
          </>
        )}
      </div>

      <Masonry className={cx('masonry-wrapper')} columns={4} spacing={2}>
        {!isArtsReady
          ? cards_sample
          : arts.map((art, index) => <MemoizedArtItem art={art} key={index} />)}
      </Masonry>
    </div>
  );
}

export default ArtList;
