import classNames from 'classnames/bind';
// React
import { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// other
import { Masonry } from '@mui/lab';
import { debounce } from 'lodash';

// scss
import styles from './ArtList.module.scss';
// components
import ArtItem from '../ArtItem/ArtItem';
// features
import Menu from '~/components/Popper/Menu';
import { reset } from '~/features/arts/artSlice';

const cx = classNames.bind(styles);

const MemoizedArtItem = memo(({ art, index }) => <ArtItem art={art} />);

function ArtList({ profile }) {
  const [isArtsReady, setIsArtsReady] = useState(false);
  const [filteredArts, setFilteredArts] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState('All');

  const styleOptions = [
    'All',
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

  const { arts, isArtsLoading, isError, message } = useSelector(
    (state) => state.arts,
  );

  const cards_sample = Array(8)
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
    if (isError && message) {
      toast.error(message);
    }
    return () => {
      dispatch(reset());
    };
  }, [message, isError, dispatch]);
  useEffect(() => {
    if (selectedStyle === 'All') {
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

  const renderStyles = (styles) => {
    return styles.map((style) => {
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
      {!profile ? (
        <div className={cx('art-options')}>
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
              <Menu items={renderStyles(dropdownStyles)} offset={[0, 0]}>
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
        </div>
      ) : (
        <div className={cx('art-options-profile')}>
          <Menu
            items={renderStyles(styleOptions)}
            offset={[0, 0]}
            bottom="bottom-start"
          >
            <div className={cx('style', 'more')}>{selectedStyle}</div>
          </Menu>
        </div>
      )}

      <div className={cx('masonry-wrapper')}>
        <Masonry columns={4} spacing={2}>
          {!isArtsReady
            ? cards_sample
            : filteredArts.map((art, index) => (
                <MemoizedArtItem art={art} key={art._id} />
              ))}
          {isArtsLoading && cards_sample}
        </Masonry>
      </div>
    </div>
  );
}

export default ArtList;
