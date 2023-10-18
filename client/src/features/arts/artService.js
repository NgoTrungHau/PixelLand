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
const getArts = async () => {
  const response = await httpRequest.get(API_URL);

  return response;
};
// Get user arts
const getAuthArts = async (auth) => {
  const config = {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  };

  const response = await httpRequest.get(
    API_URL + 'auth/' + auth.user_id,
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
  console.log(artData);
  const response = await httpRequest.post(
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
  editArt,
  deleteArt,
  likeArt,
  unlikeArt,
};

export default artService;
