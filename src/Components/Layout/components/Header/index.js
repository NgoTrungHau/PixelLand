import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleXmark,
  faSpinner,
  faMagnifyingGlass,
  faSignIn,
  faUser,
  faImage,
  faCamera,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';

import Button from '~/Components/Button';
import { Wrapper as PopperWrapper } from '~/Components/Popper';
import styles from './Header.module.scss';
import UserItem from '~/Components/UserItem';
import Menu from '~/Components/Popper/Menu';

const cx = classNames.bind(styles);

const Menu_Profile = [
  {
    image:
      'https://cdn.pixilart.com/images/user/profile/large/1b3b80606abab6f.webp?v=1677879129',
    title: 'Profile',
    to: '/profile',
  },
  {
    icon: <FontAwesomeIcon icon={faImage}></FontAwesomeIcon>,
    title: 'My Gallery',
    to: '/gallery',
  },
  {
    icon: <FontAwesomeIcon icon={faCamera}></FontAwesomeIcon>,
    title: 'My Photos',
  },
  {
    icon: <FontAwesomeIcon icon={faGear}></FontAwesomeIcon>,
    title: 'Settings',
  },
];

function Header() {
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {});

  return (
    <>
      {/* <Navbar className="d-block p-0" bg="light" expand="md"> */}
      <div className={cx('navbar-custom', 'nav-left-fixed')}>
        <div className={cx('inner', 'max')}>
          <div className={cx('left-header')}>
            <div className={cx('logo')}>
              <img
                alt=""
                src="https://www.pixilart.com/images/public/logo-plain-lg.png?v=1.1"
                width="35"
                height="30"
                className="d-inline-block align-top"
              />
              <div className="">Pixel Land</div>
            </div>
            <Tippy
              visible={searchResult.length > 0}
              interactive
              render={(attrs) => (
                <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                  <PopperWrapper>
                    <h4 className={cx('search-title')}> Users</h4>
                    <div className={cx('search-overflow')}>
                      <ul className={cx('list-group', 'ofh')}>
                        <li className={cx('list-group-item')}>
                          <UserItem />
                        </li>
                        <li className={cx('list-group-item')}>
                          <UserItem />
                        </li>
                        <li className={cx('list-group-item')}>
                          <UserItem />
                        </li>
                        <li className={cx('list-group-item')}>
                          <UserItem />
                        </li>
                        <li className={cx('list-group-item')}>
                          <UserItem />
                        </li>
                      </ul>
                    </div>
                  </PopperWrapper>
                </div>
              )}
            >
              <div className={cx('search')}>
                <input placeholder="search pixel" spellCheck={false} />
                <button id="search-clear" className={cx('clear')}>
                  <FontAwesomeIcon icon={faCircleXmark} />
                </button>
                <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />

                <button
                  type="submit"
                  id="search-button"
                  className={cx('search-btn')}
                >
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
              </div>
            </Tippy>
          </div>
          <div className={cx('center-header')}>
            {/* <Navbar.Collapse id="basic-navbar-nav"> */}
            <Nav>
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/gallery">Gallery</Nav.Link>
              <Nav.Link href="/contact">Contact</Nav.Link>
              <Nav.Link href="/profile">Profile</Nav.Link>
            </Nav>
            {/* </Navbar.Collapse> */}
          </div>

          <div className={cx('right-header')}>
            <div className={cx('actions')}>
              <Button
                type="btn-signup"
                up
                leftIcon={<FontAwesomeIcon icon={faUser} />}
              >
                Sign Up
              </Button>
              <Button
                type="btn-login"
                up
                leftIcon={<FontAwesomeIcon icon={faSignIn} />}
                onClick={() => alert('Login')}
              >
                Login
              </Button>
              <Menu items={Menu_Profile}>
                <FontAwesomeIcon icon={faUser} />
              </Menu>
            </div>
          </div>
        </div>
      </div>
      {/* </Navbar> */}
    </>
  );
}

export default Header;
