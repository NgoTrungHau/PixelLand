import * as httpRequest from '~/utils/httpRequest';

const API_URL = '/arts/';

// Create new art
const createArt = async (artData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await httpRequest.post(API_URL + 'create', artData, config);

  return response;
};

// Get user arts
const getArts = async (page) => {
  const config = {
    params: { start: page, limit: 10 },
  };
  const response = await httpRequest.get(API_URL, config);

  return response;
};
// Get user arts
const getAuthArts = async (auth, newArtOffset) => {
  const config = {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
    params: { start: auth.page, newArtOffset: newArtOffset, limit: 10 },
  };

  const response = await httpRequest.get(API_URL + 'auth', config);
  return response;
};
// Get user arts
const getUserArts = async (auth, token, newArtOffset) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { start: auth.page, newArtOffset: newArtOffset, limit: 10 },
  };
  const response = await httpRequest.get(
    API_URL + 'author/' + auth.profile_id,
    config,
  );
  return response;
};

// Edit user art
const editArt = async (artData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await httpRequest.patch(
    API_URL + artData.id,
    artData,
    config,
  );
  return response;
};
// Delete user art
const deleteArt = async (artId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await httpRequest.deleteReq(API_URL + artId, config);
  return response;
};

// View art
const viewArt = async (art_id) => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };
  const response = await httpRequest.patch(API_URL + 'view/' + art_id);
  return response;
};
// Like art
const likeArt = async (art_id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await httpRequest.patch(
    API_URL + 'like/' + art_id,
    {},
    config,
  );
  return response;
};
const unlikeArt = async (art_id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await httpRequest.patch(
    API_URL + 'unlike/' + art_id,
    {},
    config,
  );

  return response;
};

const artService = {
  createArt,
  getArts,
  getAuthArts,
  getUserArts,
  editArt,
  deleteArt,
  viewArt,
  likeArt,
  unlikeArt,
};

export default artService;
