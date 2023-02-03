import { makePost } from '../utils';

const API_URL = '/api/users/';
// Register user
const register = async (userData) => {
  let response = await makePost(API_URL, userData);
  if (response) {
    localStorage.setItem('user', JSON.stringify(response));
  }

  return response;
};

// Login user
const login = async (userData) => {
  let response = await makePost(API_URL + 'login', userData);
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
