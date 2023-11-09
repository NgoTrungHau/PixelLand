import * as httpRequest from '~/utils/httpRequest';

const API_URL = '/users/';

// Register user
const register = async (userData) => {
  const response = await httpRequest.post(API_URL + 'register', userData);
  if (response && response.tokens) {
    localStorage.setItem('tokens', JSON.stringify(response.tokens));
  }

  return response;
};

// Login user
const login = async (userData) => {
  const response = await httpRequest.post(API_URL + 'login', userData);
  if (response && response.tokens) {
    localStorage.setItem('tokens', JSON.stringify(response.tokens));
  }

  return response;
};

// Get new access token
export const getNewToken = async () => {
  const tokens = JSON.parse(localStorage.getItem('tokens'));
  const config = {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  };
  const response = await httpRequest.post(
    API_URL + 'refresh-token',
    {},
    config,
  );
  if (response.accessToken) {
    const access_token = response.accessToken;
    tokens.access_token = access_token; // Update the access_token property
    localStorage.setItem('tokens', JSON.stringify(tokens)); // Store the updated tokens object
    return access_token;
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('tokens');
};

// Get user
const getUser = async () => {
  const tokens = JSON.parse(localStorage.getItem('tokens'));

  const response = await httpRequest.post(API_URL + 'user', tokens);

  return response;
};
// Get user info
const getMe = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await httpRequest.get(API_URL + 'me', null, config);

  return response;
};

const authService = {
  register,
  logout,
  login,
  getUser,
  getNewToken,
  getMe,
};

export default authService;
