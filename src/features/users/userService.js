import * as httpRequest from '~/utils/httpRequest';

const API_URL = '/users/';

// Create new user
const createUser = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await httpRequest.post(API_URL + 'create', userData, config);

  return response;
};

// Get users
const getUsers = async () => {
  const response = await httpRequest.get(API_URL);

  return response;
};

// Delete user
const deleteUser = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await httpRequest.deleteReq(API_URL + userId, config);

  return response;
};

// Get one user info
const getUserInfo = async (userId) => {
  const response = await httpRequest.get(API_URL + userId);

  return response;
};

const userService = {
  createUser,
  getUsers,
  deleteUser,
  getUserInfo,
};

export default userService;
