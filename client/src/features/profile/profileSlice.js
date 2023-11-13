import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import profileService from './profileService';

const initialState = {
  profile: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getProfile = createAsyncThunk(
  'profile/getProfileInfo',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.tokens.access_token;

      return await profileService.getProfile(id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);
// Edit profile
export const editProfile = createAsyncThunk(
  'profile/editProfile',
  async (userData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      if (state.auth.isLoadingUser) return;
      const user = thunkAPI.getState().auth.user;
      return await profileService.editProfile(
        user.tokens.access_token,
        userData,
      );
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);
// follow
export const follow = createAsyncThunk(
  'profile/follow',
  async (user_id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.tokens.access_token;
      const response = await profileService.follow(user_id, token);
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// unfollow
export const unfollow = createAsyncThunk(
  'profile/unfollow',
  async (user_id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.tokens.access_token;
      const response = await profileService.unfollow(user_id, token);
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(editProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = {
          ...state.profile,
          username: action.payload.username,
          avatar: action.payload.avatar,
          background: action.payload.background,
          description: action.payload.description,
        };
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(follow.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(follow.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = {
          ...state.profile,
          followers: action.payload.followed.followers,
          followed: true,
        };
      })
      .addCase(follow.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(unfollow.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unfollow.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = {
          ...state.profile,
          followers: action.payload.unfollowed.followers,
          followed: false,
        };
      })
      .addCase(unfollow.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = profileSlice.actions;
export default profileSlice.reducer;
