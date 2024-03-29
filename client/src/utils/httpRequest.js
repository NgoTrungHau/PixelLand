import axios from 'axios';

const httpRequest = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const get = async (path, config = {}) => {
  const response = await httpRequest.get(path, config);
  return response.data;
};

export const post = async (path, options = {}, config = {}) => {
  const response = await httpRequest.post(path, options, config);
  return response.data;
};

export const patch = async (path, options = {}, config = {}) => {
  const response = await httpRequest.patch(path, options, config);
  return response.data;
};

export const deleteReq = async (path, options = {}) => {
  const response = await httpRequest.delete(path, options);
  return response.data;
};

export default httpRequest;
