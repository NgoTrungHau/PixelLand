import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import productService from './productService';

const initialState = {
  products: [],
  newProductOffset: 0,
  isError: false,
  isSuccess: false,
  isLoading: false,
  isProductsLoading: false,
  message: '',
};

// Create new product
export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.tokens.access_token;
      return await productService.createProduct(productData, token);
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

// Get products
export const getProducts = createAsyncThunk(
  'products/getAll',
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.tokens.access_token;
      const bonus = thunkAPI.getState().products.newProductOffset;

      return await productService.getProducts(query, bonus, token);
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
// Get user products
export const getUserProducts = createAsyncThunk(
  'products/getUserProducts',
  async (auth, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.tokens.access_token;
      const bonus = thunkAPI.getState().products.newProductOffset;

      return await productService.getUserProducts(auth, bonus, token);
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

// Edit user product
export const editProduct = createAsyncThunk(
  'products/edit',
  async (productData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.tokens.access_token;
      return await productService.editProduct(productData, token);
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

// Delete user product
export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.tokens.access_token;
      return await productService.deleteProduct(id, token);
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

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    reset: (state) => {
      // Keep the value of isProductsLoading before resetting
      const isProductsLoading = state.isProductsLoading;

      // Reset state
      Object.assign(state, initialState);

      // Restore isProductsLoading
      state.isProductsLoading = isProductsLoading;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products.unshift(action.payload);
        state.newProductOffset++;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.isProductsLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isProductsLoading = false;
        state.isSuccess = true;
        if (action.meta.arg > 0) {
          state.products = [...state.products, ...action.payload];
        } else {
          state.products = action.payload;
        }
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isProductsLoading = false;
        state.message = action.payload;
      })
      .addCase(getUserProducts.pending, (state) => {
        state.isLoading = true;
        state.isProductsLoading = true;
      })
      .addCase(getUserProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isProductsLoading = false;
        state.isSuccess = true;
        if (action.meta.arg.page > 0) {
          state.products = [...state.products, ...action.payload];
        } else {
          state.products = action.payload;
        }
      })
      .addCase(getUserProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isProductsLoading = false;
        state.message = action.payload;
      })
      .addCase(editProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.products = state.products.map((product) =>
          product._id === action.payload._id
            ? (product = {
                ...product,
                content: action.payload.content,
                privacy: action.payload.privacy,
                media: action.payload.media,
              })
            : product,
        );
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteProduct.pending, (state, action) => {
        state.isLoading = true;
        state.products = state.products.filter(
          (product) => product._id !== action.meta.arg,
        );
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.newProductOffset--;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = productSlice.actions;
export default productSlice.reducer;
