import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postService from './postService';
import { createCmt, deleteCmt } from '../comments/commentSlice';

const initialState = {
  posts: [],
  newPostOffset: 0,
  isError: false,
  isSuccess: false,
  isLoading: false,
  isPostsLoading: false,
  message: '',
};

// Create new post
export const createPost = createAsyncThunk(
  'posts/create',
  async (postData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.tokens.access_token;
      return await postService.createPost(postData, token);
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

// Get posts
export const getPosts = createAsyncThunk(
  'posts/getAll',
  async (page, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.tokens.access_token;
      const bonus = thunkAPI.getState().posts.newPostOffset;

      return await postService.getPosts(page, bonus, token);
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
// Get user posts
export const getUserPosts = createAsyncThunk(
  'posts/getUserPosts',
  async (auth, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.tokens.access_token;
      const bonus = thunkAPI.getState().posts.newPostOffset;

      return await postService.getUserPosts(auth, bonus, token);
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

// Edit user post
export const editPost = createAsyncThunk(
  'posts/edit',
  async (postData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.tokens.access_token;
      return await postService.editPost(postData, token);
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

// Delete user post
export const deletePost = createAsyncThunk(
  'posts/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.tokens.access_token;
      return await postService.deletePost(id, token);
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

// Like post
export const likePost = createAsyncThunk(
  'posts/likePost',
  async (post_id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.tokens.access_token;
      const response = await postService.likePost(post_id, token);
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

// unlike post
export const unlikePost = createAsyncThunk(
  'posts/unlikePost',
  async (post_id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.tokens.access_token;
      const response = await postService.unlikePost(post_id, token);
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

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    reset: (state) => {
      // Keep the value of isPostsLoading before resetting
      const isPostsLoading = state.isPostsLoading;

      // Reset state
      Object.assign(state, initialState);

      // Restore isPostsLoading
      state.isPostsLoading = isPostsLoading;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts.unshift(action.payload);
        state.newPostOffset++;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPosts.pending, (state) => {
        state.isLoading = true;
        state.isPostsLoading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isPostsLoading = false;
        state.isSuccess = true;
        if (action.meta.arg > 0) {
          state.posts = [...state.posts, ...action.payload];
        } else {
          state.posts = action.payload;
        }
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isPostsLoading = false;
        state.message = action.payload;
      })
      .addCase(getUserPosts.pending, (state) => {
        state.isLoading = true;
        state.isPostsLoading = true;
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isPostsLoading = false;
        state.isSuccess = true;
        if (action.meta.arg.page > 0) {
          state.posts = [...state.posts, ...action.payload];
        } else {
          state.posts = action.payload;
        }
      })
      .addCase(getUserPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isPostsLoading = false;
        state.message = action.payload;
      })
      .addCase(editPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.posts = state.posts.map((post) =>
          post._id === action.payload._id
            ? (post = {
                ...post,
                content: action.payload.content,
                privacy: action.payload.privacy,
                media: action.payload.media,
              })
            : post,
        );
      })
      .addCase(editPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deletePost.pending, (state, action) => {
        state.isLoading = true;
        state.posts = state.posts.filter(
          (post) => post._id !== action.meta.arg,
        );
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.newPostOffset--;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(likePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts.forEach((post) => {
          if (post._id === action.payload._id) {
            post.likes = action.payload.likes;
            post.liked = action.payload.liked;
            return;
          }
        });
      })
      .addCase(likePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(unlikePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts.forEach((post) => {
          if (post._id === action.payload._id) {
            post.likes = action.payload.likes;
            post.liked = action.payload.liked;
            return;
          }
        });
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // comments
      .addCase(createCmt.fulfilled, (state, action) => {
        const newComment = action.payload;

        // find the correct post object by its id
        const postIndex = state.posts.findIndex(
          (post) => post._id === newComment.post,
        );

        // If the post exists, push the comment id into its comments array
        if (postIndex !== -1) {
          state.posts[postIndex].comments.push(newComment);
        }
      })
      .addCase(deleteCmt.pending, (state, action) => {
        const deleteComment = action.meta.arg;

        // find the correct post object by its id
        const postIndex = state.posts.findIndex(
          (post) => post._id === deleteComment.post,
        );

        // If the post exists, push the comment id into its comments array
        if (postIndex !== -1) {
          state.posts[postIndex].comments.pop(deleteComment._id);
        }
      })
      .addCase(deleteCmt.rejected, (state, action) => {
        const deleteComment = action.meta.arg;

        // find the correct post object by its id
        const postIndex = state.posts.findIndex(
          (post) => post._id === deleteComment.post,
        );

        // If the post exists, push the comment id into its comments array
        if (postIndex !== -1) {
          state.posts[postIndex].comments.push(deleteComment._id);
        }
      });
  },
});

export const { reset } = postSlice.actions;
export default postSlice.reducer;
