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

// Edit profile data
const editProfile = async (token, userData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  console.log('service ', userData);
  const response = await httpRequest.post(
    API_URL + userData.id,
    userData,
    config,
  );
  console.log(response);

  return response;
};

const userService = {
  deleteUser,
  getUser,
  editProfile,
};

export default userService;
