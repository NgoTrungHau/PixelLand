import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import artService from './artService';
import { createCmt } from '../comments/commentSlice';

const initialState = {
  arts: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  isArtsLoading: false,
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
export const getArts = createAsyncThunk('arts/getAll', async (thunkAPI) => {
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

// Get user arts
export const getAuthArts = createAsyncThunk(
  'arts/getAll_auth',
  async (auth, thunkAPI) => {
    try {
      return await artService.getAuthArts(auth);
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

// Edit user art
export const editArt = createAsyncThunk(
  'arts/edit',
  async (artData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await artService.editArt(artData, token);
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

// Like art
export const likeArt = createAsyncThunk(
  'arts/likeArt',
  async (art_id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await artService.likeArt(art_id, token);
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

// unlike art
export const unlikeArt = createAsyncThunk(
  'arts/unlikeArt',
  async (art_id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await artService.unlikeArt(art_id, token);
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
        state.arts.unshift(action.payload);
      })
      .addCase(createArt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getArts.pending, (state) => {
        state.isLoading = true;
        state.isArtsLoading = true;
      })
      .addCase(getArts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isArtsLoading = false;
        state.isSuccess = true;
        state.arts = action.payload;
      })
      .addCase(getArts.rejected, (state, action) => {
        state.isLoading = false;
        state.isArtsLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAuthArts.pending, (state) => {
        state.isLoading = true;
        state.isArtsLoading = true;
      })
      .addCase(getAuthArts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isArtsLoading = false;
        state.isSuccess = true;
        state.arts = action.payload;
      })
      .addCase(getAuthArts.rejected, (state, action) => {
        state.isLoading = false;
        state.isArtsLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(editArt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editArt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.arts = state.arts.map((art) =>
          art._id === action.payload._id ? action.payload : art,
        );
      })
      .addCase(editArt.rejected, (state, action) => {
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
        state.arts = state.arts.filter((art) => art._id !== action.payload._id);
      })
      .addCase(deleteArt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(likeArt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(likeArt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.arts.forEach((art) => {
          if (art._id === action.payload._id) {
            art.likes = action.payload.likes;
            art.liked = action.payload.liked;
            return;
          }
        });
      })
      .addCase(likeArt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(unlikeArt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unlikeArt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.arts.forEach((art) => {
          if (art._id === action.payload._id) {
            art.likes = action.payload.likes;
            art.liked = action.payload.liked;
            return;
          }
        });
      })
      .addCase(unlikeArt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createCmt.fulfilled, (state, action) => {
        // action.payload should include the new comment object
        // which also contains the id (_id) of the art which the comment belongs to (art)
        const newComment = action.payload;

        // find the correct art object by its id
        const artIndex = state.arts.findIndex(
          (art) => art._id === newComment.art,
        );

        // If the art exists, push the comment id into its comments array
        if (artIndex !== -1) {
          state.arts[artIndex].comments.push(newComment._id);
        }
      });
  },
});

export const { reset } = artSlice.actions;
export default artSlice.reducer;
