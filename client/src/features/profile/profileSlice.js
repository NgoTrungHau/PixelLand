import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import profileService from './profileService';

const initialState = {
  profile: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getUser = createAsyncThunk(
  'users/getUserInfo',
  async (id, thunkAPI) => {
    try {
      return await profileService.getUser(id);
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
  'auth/editProfile',
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

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
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
      });
  },
});

export const { reset } = profileSlice.actions;
export default profileSlice.reducer;
