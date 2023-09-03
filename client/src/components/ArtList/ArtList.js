import classNames from 'classnames/bind';
import { Masonry } from '@mui/lab';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getArts, reset } from '~/features/arts/artSlice';

import styles from './ArtList.module.scss';
import ArtItem from '../Art/ArtItem';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function ArtList() {
  const dispatch = useDispatch();

  const { arts, isSuccess, isError, message } = useSelector(
    (state) => state.arts,
  );

  useEffect(() => {
    dispatch(getArts());
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      toast.success(message);
      dispatch(getArts());
    }

    return () => {
      dispatch(reset());
    };
  }, [message, dispatch]);
  const breakpoint = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('art-options')}>
        <div className={cx('option')}>popular</div>
        <div className={cx('option')}>staff pick</div>
        <div className={cx('option')}>digital art</div>
        <div className={cx('option')}>fan art</div>
      </div>
      <div className={cx('masonry-wrapper')}>
        {
          <Masonry className={cx('masonry')} columns={4} spacing={4}>
            {arts.map((art, index) => (
              <ArtItem key={index} art={art} />
            ))}
          </Masonry>
        }
      </div>
    </div>
  );
}

export default ArtList;
