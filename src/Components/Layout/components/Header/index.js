// import { useEffect, useState, forwardRef } from 'react';
import classNames from 'classnames/bind';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleXmark,
  faSpinner,
  faMagnifyingGlass,
  faSignIn,
  faUser,
  faCamera,
  faGear,
  faArrowUpFromBracket,
  faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faBell, faMessage } from '@fortawesome/free-regular-svg-icons';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';

import Button from '~/Components/Button';
import { Wrapper as PopperWrapper } from '~/Components/Popper';
import styles from './Header.module.scss';
import UserItem from '~/Components/UserItem';
import Menu from '~/Components/Popper/Menu';
import 'tippy.js/dist/tippy.css';

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
    divider: true,
  },
  {
    icon: <FontAwesomeIcon icon={faCamera}></FontAwesomeIcon>,
    title: 'My Photos',
  },
  {
    icon: <FontAwesomeIcon icon={faGear}></FontAwesomeIcon>,
    title: 'Settings',
  },
  {
    icon: <FontAwesomeIcon icon={faArrowRightFromBracket}></FontAwesomeIcon>,
    title: 'Logout',
    divider: true,
  },
];

function Header() {
  // const [searchResult, setSearchResult] = useState([]);

  // useEffect(() => {});

  const currentUser = true;

  // const ButtonTooltip = forwardRef((props, ref) => {
  //   return <Button ref={ref}></Button>;
  // });

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
            {/* visible={searchResult.length > 0} */}
            <Tippy
              delay={[0, 700]}
              offset={[40, 10]}
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
              {currentUser ? (
                <>
                  {/* <Tippy
                    interactive
                    content="Upload pixel art"
                    placement="bottom"
                  >
                    <ButtonTooltip
                      id="uploadBtn"
                      type="btn-upload"
                      up
                      leftIcon={<FontAwesomeIcon icon={faArrowUpFromBracket} />}
                    ></ButtonTooltip>
                  </Tippy> */}
                  <Button
                    id="uploadBtn"
                    type="btn-upload"
                    up
                    leftIcon={<FontAwesomeIcon icon={faArrowUpFromBracket} />}
                  ></Button>
                  <Button
                    white
                    leftIcon={<FontAwesomeIcon icon={faMessage} />}
                  ></Button>
                  <Button
                    white
                    leftIcon={<FontAwesomeIcon icon={faBell} />}
                  ></Button>
                  <Menu items={Menu_Profile}>
                    <img
                      src="https://cdn.pixilart.com/images/user/profile/large/1b3b80606abab6f.webp?v=1677879129"
                      className={cx('user-avatar')}
                      alt="user"
                    />
                  </Menu>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* </Navbar> */}
    </>
  );
}

export default Header;
