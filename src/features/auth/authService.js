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

const authService = {
  register,
  logout,
  login,
};

export default authService;
