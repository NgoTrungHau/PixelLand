import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commentService from './commentService';

const initialState = {
  comments: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  isCmtsLoading: false,
  message: '',
};

// Create new cmt
export const createCmt = createAsyncThunk(
  'cmts/create',
  async (cmtData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      console.log('slice ', cmtData);
      return await commentService.createCmt(cmtData, token);
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

// Get user cmts
export const getCmts = createAsyncThunk(
  'cmts/getAll_auth',
  async (cmt_id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await commentService.getCmts(cmt_id, token);
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

// Edit user cmt
export const editCmt = createAsyncThunk(
  'cmts/edit',
  async (cmtData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await commentService.editCmt(cmtData, token);
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

// Delete user cmt
export const deleteCmt = createAsyncThunk(
  'cmts/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await commentService.deleteCmt(id, token);
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

// Like cmt
export const likeCmt = createAsyncThunk(
  'cmts/likeCmt',
  async (cmtData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await commentService.likeCmt(cmtData, token);
      return { response, cmtData };
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

// unlike cmt
export const unlikeCmt = createAsyncThunk(
  'cmts/unlikeCmt',
  async (cmtData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await commentService.unlikeCmt(cmtData, token);
      return { response, cmtData };
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

export const cmtSlice = createSlice({
  name: 'cmt',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCmt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCmt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments.unshift(action.payload);
        state.message = 'Uploading cmt successful!';
      })
      .addCase(createCmt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getCmts.pending, (state) => {
        state.isLoading = true;
        state.isCmtsLoading = true;
      })
      .addCase(getCmts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCmtsLoading = false;
        state.isSuccess = true;
        state.comments = action.payload;
      })
      .addCase(getCmts.rejected, (state, action) => {
        state.isLoading = false;
        state.isCmtsLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(editCmt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editCmt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments = state.comments.map((cmt) =>
          cmt._id === action.payload._id ? action.payload : cmt,
        );
      })
      .addCase(editCmt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteCmt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCmt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments = state.comments.filter(
          (cmt) => cmt._id !== action.payload._id,
        );
        state.message = 'Delete comment successful!';
      })
      .addCase(deleteCmt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(likeCmt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(likeCmt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const { cmtData } = action.payload;
        const { cmt_id, user_id } = cmtData;

        state.comments.find((cmt) => {
          if (cmt._id === cmt_id) {
            cmt.likes.push(user_id);
            cmt.liked = true;
          }
        });
      })
      .addCase(likeCmt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(unlikeCmt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unlikeCmt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const { cmtData } = action.payload;
        const { cmt_id, user_id } = cmtData;

        state.comments.find((cmt) => {
          if (cmt._id === cmt_id) {
            const index = cmt.likes.indexOf(user_id);
            if (index > -1) {
              // If user_id is in the likes array, remove it
              cmt.likes.splice(index, 1);
            }

            cmt.liked = cmt.likes.includes(user_id); // If user_id is in the likes array: set to true, else set to false
          }
        });
      })
      .addCase(unlikeCmt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = cmtSlice.actions;
export default cmtSlice.reducer;
