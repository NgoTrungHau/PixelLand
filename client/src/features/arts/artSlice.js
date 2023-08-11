import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import artService from './artService';

const initialState = {
  arts: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Create new art
export const createArt = createAsyncThunk(
  'arts/create',
  async (artData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await artService.createArt(artData, token);
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

// Get user arts
export const getArts = createAsyncThunk('arts/', async (thunkAPI) => {
  try {
    return await artService.getArts();
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Delete user art
export const deleteArt = createAsyncThunk(
  'arts/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await artService.deleteArt(id, token);
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

export const artSlice = createSlice({
  name: 'art',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createArt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createArt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.arts.push(action.payload);
      })
      .addCase(createArt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getArts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getArts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.arts = action.payload;
      })
      .addCase(getArts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteArt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteArt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.arts = state.arts.filter((art) => art._id !== action.payload.id);
      })
      .addCase(deleteArt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = artSlice.actions;
export default artSlice.reducer;
