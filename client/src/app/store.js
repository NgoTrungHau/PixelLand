import { configureStore } from '@reduxjs/toolkit';
import authReducer from '~/features/auth/authSlice';
import postReducer from '~/features/posts/postSlice';
import artReducer from '~/features/arts/artSlice';
import profileReducer from '~/features/profile/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    arts: artReducer,
    profile: profileReducer,
  },
});
