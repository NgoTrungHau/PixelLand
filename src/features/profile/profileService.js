import * as httpRequest from '~/utils/httpRequest';

const API_URL = '/users/';

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
const getUser = async (userId) => {
  const response = await httpRequest.get(API_URL + userId);
  return response;
};

const userService = {
  deleteUser,
  getUser,
};

export default userService;
