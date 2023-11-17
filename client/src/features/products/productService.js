import * as httpRequest from '~/utils/httpRequest';

const API_URL = '/products/';

// Create new product
const createProduct = async (productData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await httpRequest.post(
    API_URL + 'create',
    productData,
    config,
  );

  return response;
};

// Get products
const getProducts = async (query, newProductOffset, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      start: query.page,
      category: query.category,
      filter: query.filter,
      newProductOffset: newProductOffset,
      limit: 9,
    },
  };
  const response = await httpRequest.get(API_URL, config);

  return response;
};
// Get user products
const getUserProducts = async (auth, newProductOffset, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { start: auth.page, newProductOffset: newProductOffset, limit: 4 },
  };
  const response = await httpRequest.get(
    API_URL + 'user/' + auth.user_id,
    config,
  );

  return response;
};

// Edit user art
const editProduct = async (productData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await httpRequest.patch(
    API_URL + productData.id,
    productData,
    config,
  );
  return response;
};

// Delete user product
const deleteProduct = async (productId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await httpRequest.deleteReq(API_URL + productId, config);

  return response;
};
const productService = {
  createProduct,
  getProducts,
  getUserProducts,
  editProduct,
  deleteProduct,
};

export default productService;
