import * as httpRequest from '~/utils/httpRequest';

const API_URL = '/users/';

// Register user
const register = async (userData) => {
  const response = await httpRequest.post(API_URL + 'register', userData);

  if (response) {
    localStorage.setItem('user', JSON.stringify(response));
  }

  return response;
};

// Login user
const login = async (userData) => {
  const response = await httpRequest.post(API_URL + 'login', userData);

  if (response) {
    localStorage.setItem('user', JSON.stringify(response));
  }

  return response;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
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
  getMe,
};

export default authService;
