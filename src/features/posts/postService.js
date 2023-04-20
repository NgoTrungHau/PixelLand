import * as httpRequest from '~/utils/httpRequest';

const API_URL = '/posts/';

// Create new post
const createPost = async (postData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await httpRequest.post(API_URL + 'create', postData, config);

  return response;
};

// Get user posts
const getPosts = async () => {
  const response = await httpRequest.get(API_URL);

  return response;
};

// Delete user post
const deletePost = async (postId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await httpRequest.deleteReq(API_URL + postId, config);

  return response;
};

const postService = {
  createPost,
  getPosts,
  deletePost,
};

export default postService;
