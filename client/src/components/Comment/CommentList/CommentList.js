import classNames from 'classnames/bind';
import { useEffect, useState, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';

import styles from './CommentList.module.scss';
import { getCmts, reset } from '~/features/comments/commentSlice';
import CommentItem from '../CommentItem';

const cx = classNames.bind(styles);

const MemoizedCmtItem = memo(({ cmt, index }) => (
  <CommentItem cmt={cmt} index={index} />
));

function CommentList({ art }) {
  const [isCmtsReady, setIsCmtsReady] = useState(false);

  const { comments, isCmtsLoading, isSuccess, isError, message } = useSelector(
    (state) => state.comments,
  );
  const { user } = useSelector((state) => state.auth);

  const cards_sample = Array(12)
    .fill(undefined)
    .map((a, i) => <div className={cx('card-thumb-sample')} key={i}></div>);

  const setCmtsReadyDebounced = useCallback(
    debounce(() => setIsCmtsReady(true), 1000),
    [],
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect
  useEffect(() => {
    if (user) {
      dispatch(getCmts(art._id));
    }
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
    }
    if (isSuccess && message) {
      toast.success(message);
    }
  }, [navigate, message, dispatch]);

  useEffect(() => {
    setCmtsReadyDebounced();
  }, [comments, navigate, dispatch, setCmtsReadyDebounced]);

  return (
    <div className={cx('wrapper')}>
      {comments.map((cmt, index) => (
        <MemoizedCmtItem cmt={cmt} key={cmt._id} />
      ))}
    </div>
  );
}

export default CommentList;
