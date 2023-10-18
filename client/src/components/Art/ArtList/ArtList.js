import classNames from 'classnames/bind';
// React
import { useEffect, useState, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// other
import { Masonry } from '@mui/lab';
import { debounce, map } from 'lodash';

// scss
import styles from './ArtList.module.scss';
// components
import ArtItem from '../ArtItem/ArtItem';
// features
import { getArts, getAuthArts, reset } from '~/features/arts/artSlice';
import Menu from '~/components/Popper/Menu';

const cx = classNames.bind(styles);

const MemoizedArtItem = memo(({ art, index }) => <ArtItem art={art} />);

function ArtList() {
  const [isArtsReady, setIsArtsReady] = useState(false);
  const [filteredArts, setFilteredArts] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState('Explore');

  const styleOptions = [
    'Explore',
    'Digital Painting',
    'Fan Art',
    'Fantasy Art',
    'Pixel Art',
    'Aesthetic Art',
    'Concept Art',
    'Vector Art',
    'Game Art',
    'AI Art',
    'Anime and Manga',
  ];
  const displayedStyles = styleOptions.slice(0, 6);
  const dropdownStyles = styleOptions.slice(6);

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
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
    }
    if (isSuccess && message) {
      toast.success(message);
    }
  }, [navigate, message, isError, isSuccess, dispatch]);
  useEffect(() => {
    if (selectedStyle === 'Explore') {
      setFilteredArts(arts);
    } else {
      setFilteredArts(arts.filter((art) => art.style === selectedStyle));
    }
  }, [arts, selectedStyle]);

  useEffect(() => {
    setArtsReadyDebounced();
  }, [arts, navigate, dispatch, setArtsReadyDebounced]);

  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
  };

  const renderStyles = () => {
    return dropdownStyles.map((style) => {
      return {
        title: style,
        onClick: () => {
          handleStyleSelect(style);
        },
      };
    });
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('art-options')}>
        {!isArtsLoading && (
          <>
            {displayedStyles.map((style, index) => (
              <div
                className={cx('style', { selected: selectedStyle === style })}
                onClick={() => handleStyleSelect(style)}
                key={index}
              >
                {style}
              </div>
            ))}
            <div>
              <Menu items={renderStyles()} offset={[0, 0]}>
                <div
                  className={cx('style', 'more', {
                    selected: dropdownStyles.includes(selectedStyle),
                  })}
                >
                  More
                </div>
              </Menu>
            </div>
          </>
        )}
      </div>

      <Masonry className={cx('masonry-wrapper')} columns={4} spacing={2}>
        {!isArtsReady
          ? cards_sample
          : filteredArts.map((art, index) => (
              <MemoizedArtItem art={art} key={art._id} />
            ))}
      </Masonry>
    </div>
  );
}

export default ArtList;
