import classNames from 'classnames/bind';
// react
import { useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// scss
import styles from './CommentList.module.scss';
// components
import CommentItem from '../CommentItem';

const cx = classNames.bind(styles);

const MemoizedCmtItem = memo(({ cmt, index }) => (
  <CommentItem cmt={cmt} index={index} />
));

function CommentList({ replies, postCmts }) {
  const { comments, isCmtsLoading, isSuccess, isError, message } = useSelector(
    (state) => state.comments,
  );

  const [heightsCycle] = useState(() =>
    new Array(10)
      .fill(undefined)
      .map(() => Math.floor(Math.random() * (12 - 4) + 4) * 10),
  );
  const [widthsCycle] = useState(() =>
    new Array(10)
      .fill(undefined)
      .map(() => Math.floor(Math.random() * (10 - 5) + 5) * 10),
  );

  const cards_sample = Array(5)
    .fill(undefined)
    .map((a, i) => (
      <div className={cx('comment-thumb-sample')} key={i}>
        <div className={cx('comment-avatar-sample')}></div>
        <div className={cx('comment-detail-sample')}>
          <div
            className={cx('comment-content-sample')}
            style={{
              height: `${heightsCycle[i]}px`,
              width: `${widthsCycle[i]}%`,
            }}
          ></div>
        </div>
      </div>
    ));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
    }
    if (isSuccess && message) {
      toast.success(message);
    }
  }, [navigate, isSuccess, isError, message, dispatch]);

  return (
    <div className={cx('wrapper')}>
      {isCmtsLoading && comments.length === 0 && (
        <div className={cx('wrapper')}>{cards_sample}</div>
      )}
      {postCmts ? (
        <MemoizedCmtItem
          cmt={postCmts[postCmts.length - 1]}
          key={postCmts[postCmts.length - 1]?._id}
        />
      ) : !replies ? (
        comments.map((cmt, index) => (
          <MemoizedCmtItem cmt={cmt} key={cmt._id} />
        ))
      ) : (
        replies.map((reply, index) => (
          <MemoizedCmtItem cmt={reply} key={reply._id} />
        ))
      )}
    </div>
  );
}

export default CommentList;
