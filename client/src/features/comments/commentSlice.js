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
      const token = thunkAPI.getState().auth.user.tokens.access_token;
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
  async (art_id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.tokens.access_token;
      return await commentService.getCmts(art_id, token);
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
      const token = thunkAPI.getState().auth.user.tokens.access_token;
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
  async (cmt, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.tokens.access_token;
      return await commentService.deleteCmt(cmt._id, token);
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
  async (cmt_id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.tokens.access_token;
      const response = await commentService.likeCmt(cmt_id, token);
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

// unlike cmt
export const unlikeCmt = createAsyncThunk(
  'cmts/unlikeCmt',
  async (cmt_id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.tokens.access_token;
      const response = await commentService.unlikeCmt(cmt_id, token);
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
export const replyCmt = createAsyncThunk(
  'cmts/reply',
  async (replyData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.tokens.access_token;
      const response = await commentService.replyCmt(replyData, token);
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

export const cmtSlice = createSlice({
  name: 'cmt',
  initialState,
  reducers: {
    reset: (state) => {
      // Keep the value of isCmtsLoading before resetting
      const isCmtsLoading = state.isCmtsLoading;

      // Reset state
      Object.assign(state, initialState);

      // Restore isCmtsLoading
      state.isCmtsLoading = isCmtsLoading;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCmt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCmt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments.push(action.payload);
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
        if (!action.payload.parentCommentId) {
          state.comments = state.comments.map((cmt) =>
            cmt._id === action.payload._id ? action.payload : cmt,
          );
        } else {
          state.comments.forEach((cmt) => {
            if (cmt._id === action.payload.parentCommentId) {
              cmt.replies = cmt.replies.map((reply) =>
                reply._id === action.payload._id ? action.payload : reply,
              );
              return;
            }
          });
        }
      })
      .addCase(editCmt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteCmt.pending, (state, action) => {
        state.isLoading = true;
        if (!action.meta.arg?.parentCommentId) {
          state.comments = state.comments.filter(
            (cmt) => cmt._id !== action.meta.arg._id,
          );
        } else {
          state.comments.forEach((cmt) => {
            if (cmt._id === action.meta.arg.parentCommentId) {
              cmt.replies = cmt.replies.filter(
                (reply) => reply._id !== action.meta.arg._id,
              );
            }
            return;
          });
        }
      })
      .addCase(deleteCmt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (!action.meta.arg?.parentCommentId) {
          state.comments = state.comments.filter(
            (cmt) => cmt._id !== action.meta.arg._id,
          );
        } else {
          state.comments.forEach((cmt) => {
            if (cmt._id === action.meta.arg.parentCommentId) {
              cmt.replies = cmt.replies.filter(
                (reply) => reply._id !== action.meta.arg._id,
              );
            }
            return;
          });
        }
      })
      .addCase(deleteCmt.rejected, (state, action) => {
        console.log(action.meta.arg);

        state.isLoading = false;
        state.isError = true;
        if (!action.meta.arg?.parentCommentId) {
          state.comments.push(action.meta.arg);
        } else {
          state.comments.forEach((cmt) => {
            if (cmt._id === action.meta.arg.parentCommentId) {
              cmt.replies.push(action.meta.arg);
            }
            return;
          });
        }
        state.message = action.payload;
      })
      .addCase(likeCmt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(likeCmt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (!action.payload.parentCommentId) {
          state.comments.forEach((cmt) => {
            if (cmt._id === action.payload._id) {
              cmt.likedBy = action.payload.likedBy;
              cmt.liked = action.payload.liked;
              return;
            }
          });
        } else {
          state.comments.forEach((cmt) => {
            if (cmt._id === action.payload.parentCommentId) {
              cmt.replies.forEach((reply) => {
                if (reply._id === action.payload._id) {
                  reply.likedBy = action.payload.likedBy;
                  reply.liked = action.payload.liked;
                  return;
                }
              });
              return;
            }
          });
        }
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
        if (!action.payload.parentCommentId) {
          state.comments.forEach((cmt) => {
            if (cmt._id === action.payload._id) {
              cmt.likedBy = action.payload.likedBy;
              cmt.liked = action.payload.liked;
              return;
            }
          });
        } else {
          state.comments.forEach((cmt) => {
            if (cmt._id === action.payload.parentCommentId) {
              cmt.replies.forEach((reply) => {
                if (reply._id === action.payload._id) {
                  reply.likedBy = action.payload.likedBy;
                  reply.liked = action.payload.liked;
                  return;
                }
              });
              return;
            }
          });
        }
      })
      .addCase(unlikeCmt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(replyCmt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(replyCmt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments.forEach((cmt) => {
          if (cmt._id === action.payload.parentCommentId) {
            cmt.replies.push(action.payload);
            return;
          }
        });
      })
      .addCase(replyCmt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = cmtSlice.actions;
export default cmtSlice.reducer;
