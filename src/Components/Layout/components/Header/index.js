import {
  faBell,
  faImage,
  faMessage,
} from '@fortawesome/free-regular-svg-icons';
import {
  faArrowRightFromBracket,
  faArrowUpFromBracket,
  faCamera,
  faGear,
  faSignIn,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import { Nav } from 'react-bootstrap';
import 'tippy.js/dist/tippy.css';
import images from '~/assets/images';
import Button from '~/Components/Button';
import Image from '~/Components/Image';
import Menu from '~/Components/Popper/Menu';
import Search from '../Search';
import styles from './Header.module.scss';

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
  const currentUser = true;

  return (
    <>
      {/* <Navbar className="d-block p-0" bg="light" expand="md"> */}
      <div className={cx('navbar-custom', 'nav-left-fixed')}>
        <div className={cx('inner', 'max')}>
          <div className={cx('left-header')}>
            <div className={cx('logo')}>
              <Image
                alt=""
                src={images.logo}
                width="35"
                height="30"
                className="d-inline-block align-top"
              />
              <div className="">Pixel Land</div>
            </div>

            <Search />
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
                  <Tippy
                    interactive
                    content="Upload pixel art"
                    placement="bottom"
                  >
                    <Button
                      type="btn-upload"
                      up
                      leftIcon={<FontAwesomeIcon icon={faArrowUpFromBracket} />}
                    ></Button>
                  </Tippy>
                  <Tippy interactive content="Message" placement="bottom">
                    <Button
                      white
                      leftIcon={<FontAwesomeIcon icon={faMessage} />}
                    ></Button>
                  </Tippy>
                  <Tippy interactive content="Notification" placement="bottom">
                    <Button
                      white
                      leftIcon={<FontAwesomeIcon icon={faBell} />}
                    ></Button>
                  </Tippy>

                  <Menu items={Menu_Profile}>
                    <Image
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
