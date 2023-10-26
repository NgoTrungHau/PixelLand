import * as httpRequest from '~/utils/httpRequest';

const API_URL = '/posts/';

// Create new post
const createPost = async (postData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await httpRequest.post(API_URL + 'create', postData, config);

  return response;
};

// Get user posts
const getPosts = async (page, newPostOffset, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { start: page, newPostOffset: newPostOffset, limit: 4 },
  };
  const response = await httpRequest.get(API_URL, config);

  return response;
};

// Edit user art
const editPost = async (postData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await httpRequest.patch(
    API_URL + postData.id,
    postData,
    config,
  );
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

// Like post
const likePost = async (post_id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await httpRequest.patch(
    API_URL + 'like/' + post_id,
    {},
    config,
  );
  return response;
};
const unlikePost = async (post_id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await httpRequest.patch(
    API_URL + 'unlike/' + post_id,
    {},
    config,
  );

  return response;
};

const postService = {
  createPost,
  getPosts,
  editPost,
  deletePost,
  likePost,
  unlikePost,
};

export default postService;
