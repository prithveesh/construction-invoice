import { makePost, makeGet } from '../utils';

const API_URL = '/api/invoice/';

// Create new goal
export const set = async (id, data, token) => {
  const headers = {
    // Authorization: `Bearer ${token}`,
  };

  return await makePost(`${API_URL}set/${id}`, data, headers);
};

// Get user goals
export const get = async (id, token) => {
  const headers = {
    // Authorization: `Bearer ${token}`,
  };
  return await makeGet(`${API_URL}${id}`, headers);
};
