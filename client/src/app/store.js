import { configureStore } from '@reduxjs/toolkit';
import authReducer from '~/features/auth/authSlice';
import postReducer from '~/features/posts/postSlice';
import artReducer from '~/features/arts/artSlice';
import commentReducer from '~/features/comments/commentSlice';
import profileReducer from '~/features/profile/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    arts: artReducer,
    comments: commentReducer,
    profile: profileReducer,
  },
});
