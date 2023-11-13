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
const getProfile = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await httpRequest.get(API_URL + 'profile/' + userId, config);
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
// Follow
const follow = async (user_id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await httpRequest.patch(
    API_URL + 'follow/' + user_id,
    {},
    config,
  );
  return response;
};
const unfollow = async (user_id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await httpRequest.patch(
    API_URL + 'unfollow/' + user_id,
    {},
    config,
  );

  return response;
};

const userService = {
  deleteUser,
  getProfile,
  editProfile,
  follow,
  unfollow,
};

export default userService;
