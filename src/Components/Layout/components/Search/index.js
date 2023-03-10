import {
  faCircleXmark,
  faMagnifyingGlass,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeadlessTippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import { useEffect, useState, useRef } from 'react';
import { Wrapper as PopperWrapper } from '~/Components/Popper';
import UserItem from '~/Components/UserItem';
import { useDebounce } from '~/hooks';
import styles from './Search.module.scss';
// import axios from 'axios';

const cx = classNames.bind(styles);

function Search() {
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [showResult, setShowResult] = useState(true);
  const [loading, setLoading] = useState(false);

  const debounded = useDebounce(searchValue, 500);

  const inputRef = useRef();

  useEffect(() => {
    if (!debounded.trim()) {
      setSearchResult([]);
      return;
    }

    setLoading(true);

    fetch(
      `https://tiktok.fullstack.edu.vn/api/users/search?q=${encodeURIComponent(
        debounded,
      )}&type=less`,
    )
      .then((res) => res.json())
      .then((res) => {
        setSearchResult(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    //   const fecthData = async () => {
    //     await axios.get("http://localhost:3000/api/users?q=${searchValue}&type=less")
    //         .then(res => {
    //           setSearchResult(res.data);
    //             console.log(searchResult);
    //         });
    // };
    // fecthData();
  }, [debounded]);

  const handleClear = () => {
    setSearchValue('');
    inputRef.current.focus();
  };

  const handleHideResult = () => {
    setShowResult(false);
  };

  return (
    <HeadlessTippy
      visible={showResult && searchResult.length > 0}
      delay={[0, 700]}
      offset={[65, 10]}
      interactive
      render={(attrs) => (
        <div className={cx('search-result')} tabIndex="-1" {...attrs}>
          <PopperWrapper>
            <h4 className={cx('search-title')}> Users</h4>
            <div className={cx('search-overflow')}>
              <ul className={cx('list-group', 'ofh')}>
                {searchResult.map((result) => (
                  <UserItem
                    className={cx('list-group-item')}
                    key={result.id}
                    data={result}
                  />
                ))}
              </ul>
            </div>
          </PopperWrapper>
        </div>
      )}
      onClickOutside={handleHideResult}
    >
      <div className={cx('search')}>
        <input
          ref={inputRef}
          value={searchValue}
          placeholder="Search pixel"
          spellCheck={false}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setShowResult(true)}
        />
        {!!searchValue && !loading && (
          <button
            id="search-clear"
            className={cx('clear')}
            onClick={handleClear}
          >
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        )}
        {loading && (
          <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />
        )}

        <button type="submit" id="search-button" className={cx('search-btn')}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
    </HeadlessTippy>
  );
}

export default Search;
