import {
  faCircleXmark,
  faMagnifyingGlass,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeadlessTippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';

import * as searchServices from '~/Services/searchService';
import { useEffect, useRef, useState } from 'react';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import UserItem from '~/components/UserItem';
import { useDebounce } from '~/hooks';

import styles from './Search.module.scss';

const cx = classNames.bind(styles);

function Search() {
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const deboundedValue = useDebounce(searchValue, 500);

  const inputRef = useRef();

  useEffect(() => {
    if (!deboundedValue.trim()) {
      setSearchResult([]);
      return;
    }

    const fetchApi = async () => {
      setLoading(true);

      const result = await searchServices.search(deboundedValue);
      setSearchResult(result.users);

      setLoading(false);
    };

    fetchApi();
  }, [deboundedValue]);

  const handleClear = () => {
    setSearchValue('');
    setSearchResult([]);
    inputRef.current.focus();
  };

  const handleHideResult = () => {
    setShowResult(false);
  };

  const handleChange = (e) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(' ')) {
      setSearchValue(searchValue);
    }
  };

  const renderSearchResult = (attrs) => (
    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
      <PopperWrapper>
        <h4 className={cx('search-title')}> Users</h4>
        <div className={cx('search-overflow')}>
          <ul className={cx('list-group', 'ofh')}>
            {searchResult.map((result) => (
              <UserItem
                className={cx('list-group-item')}
                key={result._id}
                data={result}
              />
            ))}
          </ul>
        </div>
      </PopperWrapper>
    </div>
  );

  return (
    // Using a wrapper <div> tag around the reference element solves
    // this by creating a new parentNode context.
    <div>
      <HeadlessTippy
        interactive
        visible={showResult && searchResult.length > 0}
        delay={[0, 700]}
        offset={[65, 10]}
        render={renderSearchResult}
        onClickOutside={handleHideResult}
      >
        <div className={cx('search')}>
          <input
            ref={inputRef}
            value={searchValue}
            placeholder="Search pixel"
            spellCheck={false}
            onChange={handleChange}
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

          <button
            type="submit"
            id="search-button"
            className={cx('search-btn')}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </HeadlessTippy>
    </div>
  );
}

export default Search;
