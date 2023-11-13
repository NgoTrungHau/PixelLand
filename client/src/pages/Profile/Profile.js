import classNames from 'classnames/bind';
// React
import { createContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

// scss
import styles from './Profile.module.scss';
// components
import Image from '~/components/Image';
import ArtList from '~/components/Art/ArtList';
import CreatePost from '~/components/Post/PostButton/CreatePost';
import PostList from '~/components/Post/PostList';
import ProfileHeader from '~/components/Profile/ProfileHeader';
// features
import { getUserArts, reset as resetArts } from '~/features/arts/artSlice';
import { getUserPosts, reset as resetPosts } from '~/features/posts/postSlice';
import { follow, getProfile, unfollow } from '~/features/profile/profileSlice';

const cx = classNames.bind(styles);

export const ProfileContext = createContext();

function Profile() {
  const dispatch = useDispatch();

  const { user, hasCheckedUser } = useSelector((state) => state.auth);
  const { isPostsLoading } = useSelector((state) => state.posts);
  const { arts, isArtsLoading } = useSelector((state) => state.arts);
  const { profile } = useSelector((state) => state.profile);

  const { id } = useParams();
  const [isAuth, setIsAuth] = useState(true);
  const [isFollow, setIsFollow] = useState(profile.followed);
  const [pagePost, setPagePost] = useState(0);
  const [pageArt, setPageArt] = useState(0);
  const location = useLocation();

  const currentPath = location.pathname;

  const loadingUsersRef = useRef(false); // reference for API call status
  const loadingPostsRef = useRef(false); // reference for API call status
  const loadingArtsRef = useRef(false); // reference for API call status
  useEffect(() => {
    // Dispatch the reset action when the component mounts
    dispatch(resetArts());
    dispatch(resetPosts());
  }, [dispatch]);
  useEffect(() => {
    if (id === user._id) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, [id, user]);
  useEffect(() => {
    if (profile) {
      setIsFollow(profile.followed);
    }
  }, [profile.followed]);
  useEffect(() => {
    if (hasCheckedUser && !loadingUsersRef.current) {
      loadingUsersRef.current = true; // set loading to true before API call
      loadingPostsRef.current = true;
      loadingArtsRef.current = true;
      dispatch(getProfile(id)).then(() => {
        loadingUsersRef.current = false; // set loading to false after API call
      });
      dispatch(getUserPosts({ profile_id: id, page: 0 })).then(() => {
        loadingPostsRef.current = false;
      });
      dispatch(getUserArts({ profile_id: id, page: 0 })).then(() => {
        loadingArtsRef.current = false;
      });
    }
  }, [id, hasCheckedUser, dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        (!isPostsLoading || !isArtsLoading) &&
        window.innerHeight + document.documentElement.scrollTop + 1 >=
          document.documentElement.scrollHeight
      ) {
        if (currentPath === `/${id}`) {
          setPagePost((prev) => prev + 1);
        }
        if (currentPath === `/${id}/gallery`) {
          setPageArt((prev) => prev + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPostsLoading, isArtsLoading]);
  useEffect(() => {
    if (profile) {
      if (currentPath === `/${id}` && pagePost > 0) {
        dispatch(getUserPosts({ profile_id: id, page: pagePost }));
      }
      if (currentPath === `/${id}/gallery` && pageArt > 0) {
        dispatch(getUserArts({ profile_id: id, page: pageArt }));
      }
    }
  }, [profile, pagePost, pageArt, dispatch]);

  const handleFollow = () => {
    if (!user) {
      toast.error('Not logged in yet!');
      return;
    }
    if (!isFollow) {
      dispatch(follow(profile._id));
      setIsFollow(true);
    } else {
      dispatch(unfollow(profile._id));
      setIsFollow(false);
    }
  };

  return (
    <ProfileContext.Provider value={{ isFollow, handleFollow }}>
      <div className={cx('wrapper')}>
        <ProfileHeader id={id} isAuth={isAuth} profile={profile} />
        <div className={cx('container')}>
          <div className={cx('content')}>
            <Routes>
              <Route
                index
                element={
                  <>
                    <div className={cx('about')}>
                      <div className={cx('detail')}>
                        <h4>About</h4>
                        <p>{profile?.description}</p>
                      </div>
                      {arts.length > 0 && (
                        <div className={cx('detail')}>
                          <div className="d-flex justify-content-between align-items-center">
                            <h4>Gallery</h4>
                            <Link to={`/${id}/gallery`}>View gallery</Link>
                          </div>
                          <Link
                            to={`/${id}/gallery`}
                            className={cx('preview-gallery')}
                          >
                            {arts.slice(0, 4).map((art) => (
                              <div key={art._id}>
                                <Image src={art?.art?.url} />
                              </div>
                            ))}
                          </Link>
                        </div>
                      )}
                    </div>
                    {/* <div>
                      <div className={cx('intro')}>
                        <div className={cx('detail')}>Profile Intro</div>
                      </div>
                    </div> */}
                    <div className={cx('creator-content')}>
                      {id === user?._id && <CreatePost />}
                      <PostList />
                    </div>
                  </>
                }
              />
              {/* <Route path="membership" element={<div>Membership</div>} /> */}
              <Route path="gallery" element={<ArtList profile />} />
              <Route path="shop" element={<div>Shop</div>} />
            </Routes>
          </div>
        </div>
      </div>
    </ProfileContext.Provider>
  );
}

export default Profile;
