import { makePost, makeGet, makeDelete } from '../utils';

const API_URL = '/api/goals/';

// Create new goal
const createGoal = async (goalData, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  return await makePost(API_URL, goalData, headers);
};

// Get user goals
const getGoals = async (token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return await makeGet(API_URL, headers);
};

// Delete user goal
const deleteGoal = async (goalId, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  return await makeDelete(API_URL + goalId, headers);
};

const goalService = {
  createGoal,
  getGoals,
  deleteGoal,
};

export default goalService;
