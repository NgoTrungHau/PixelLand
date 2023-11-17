import {
  faBell,
  faImage,
  faMessage,
} from '@fortawesome/free-regular-svg-icons';
import {
  faArrowRightFromBracket,
  faBook,
  faCamera,
  faGear,
  faHouse,
  faImages,
  faTag,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import 'tippy.js/dist/tippy.css';

import images from '~/assets/images';
import Button from '~/components/Button';
import Image from '~/components/Image';
import Menu from '~/components/Popper/Menu';
import config from '~/config';
import Search from '../Search';
import styles from './Header.module.scss';
import Modal from '~/components/Modals/';
import { logout, reset } from '~/features/auth/authSlice';

const cx = classNames.bind(styles);

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  if (user) {
    var Menu_Profile = [
      {
        image: user.avatar?.url,
        title: 'Profile',
        to: `/profile/${user._id}`,
      },
      {
        rightIcon: <FontAwesomeIcon icon={faImage}></FontAwesomeIcon>,
        title: 'My Gallery',
        to: `/profile/${user._id}/gallery`,
        divider: true,
      },
      {
        rightIcon: <FontAwesomeIcon icon={faCamera}></FontAwesomeIcon>,
        title: 'My Shop',
        to: `/profile/${user._id}/shop`,
      },
      {
        rightIcon: <FontAwesomeIcon icon={faGear}></FontAwesomeIcon>,
        title: 'Settings',
      },
      {
        rightIcon: (
          <FontAwesomeIcon icon={faArrowRightFromBracket}></FontAwesomeIcon>
        ),
        title: 'Logout',
        onClick: () => {
          dispatch(logout());
          dispatch(reset());
          navigate('/');
        },
        divider: true,
      },
    ];
  }

  return (
    <>
      <div className={cx('navbar-custom', 'nav-left-fixed')}>
        <div className={cx('inner', 'max')}>
          <div className={cx('left-header')}>
            <Link to={config.routes.home} className={cx('logo')}>
              <Image
                alt=""
                src={images.logo}
                width="35"
                height="30"
                className="d-inline-block align-top"
              />
              <div className="">Pixel Land</div>
            </Link>

            <Search />
          </div>
          <div className={cx('center-header')}>
            <Button
              btnType="white"
              navlink
              to={config.routes.home}
              leftIcon={<FontAwesomeIcon icon={faHouse} />}
            >
              Home
            </Button>
            <Button
              btnType="white"
              navlink
              to={config.routes.gallery}
              leftIcon={<FontAwesomeIcon icon={faImages} />}
            >
              Gallery
            </Button>
            <Button
              btnType="white"
              to={config.routes.shop}
              leftIcon={<FontAwesomeIcon icon={faBook} />}
            >
              Courses
            </Button>
            <Button
              btnType="white"
              navlink
              to="/shop"
              leftIcon={<FontAwesomeIcon icon={faTag} />}
            >
              Shop
            </Button>
          </div>

          <div className={cx('right-header')}>
            <div className={cx('actions')}>
              {user ? (
                <>
                  <Modal modalType="upload" sz="small" />
                  <Tippy
                    interactive
                    appendTo={() => document.body}
                    content="Message"
                    placement="bottom"
                  >
                    <Button
                      btnType="white"
                      leftIcon={<FontAwesomeIcon icon={faMessage} />}
                    ></Button>
                  </Tippy>
                  <Tippy
                    interactive
                    appendTo={() => document.body}
                    content="Notification"
                    placement="bottom"
                  >
                    <Button
                      btnType="white"
                      leftIcon={<FontAwesomeIcon icon={faBell} />}
                    ></Button>
                  </Tippy>

                  <Menu
                    items={Menu_Profile}
                    hideOnClick
                    trigger="click"
                    offset={[0, 15]}
                  >
                    <Image
                      src={user.avatar?.url}
                      className={cx('user-avatar')}
                      alt=""
                    />
                  </Menu>
                </>
              ) : (
                <>
                  <Modal modalType="signup" />
                  <Modal modalType="login" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
