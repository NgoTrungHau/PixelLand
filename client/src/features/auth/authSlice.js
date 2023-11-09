import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
import { editProfile } from '../profile/profileSlice';

const initialState = {
  user: null,
  isLoadingUser: false,
  hasCheckedUser: false,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Define thunk for an async request to load user
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, thunkAPI) => {
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    if (!tokens) {
      return thunkAPI.rejectWithValue('No tokens available');
    }
    try {
      const response = await authService.getUser();
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || err.toString());
    }
  },
);

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      if (state.auth.isLoadingUser) return; // add this

      return await authService.register(user);
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

// Login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    if (state.auth.isLoadingUser) return; // add this
    return await authService.login(user);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Logout user
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    return await authService.logout();
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// get new access token
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, thunkAPI) => {
    try {
      return await authService.getNewToken();
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

// Get my info
export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    if (state.auth.isLoadingUser) return; // add this
    const token = thunkAPI.getState().auth.user.tokens.access_token;
    return await authService.getMe(token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.isLoadingUser = false;
      state.hasCheckedUser = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
        state.isLoadingUser = true;
        state.hasCheckedUser = false; // reset this
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoadingUser = false;
        state.hasCheckedUser = true;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isLoadingUser = false;
        state.hasCheckedUser = true;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.hasCheckedUser = true;

        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.hasCheckedUser = true;

        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.hasCheckedUser = true;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user.tokens.access_token = action.payload; // Set the new token
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.user = {
          ...state.user,
          username: action.payload.username,
          avatar: action.payload.avatar,
          background: action.payload.background,
          description: action.payload.description,
        };
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
