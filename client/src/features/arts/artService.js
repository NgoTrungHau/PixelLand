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

// Delete user art
const deleteArt = async (artId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await httpRequest.deleteReq(API_URL + artId, config);

  return response.data;
};

// Like art
const likeArt = async (artData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await httpRequest.patch(
    API_URL + artData.art_id + '/like',
    artData,
    config,
  );

  return response.data;
};
const unlikeArt = async (artData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await httpRequest.patch(
    API_URL + artData.art_id + '/unlike',
    artData,
    config,
  );

  return response.data;
};

const artService = {
  createArt,
  getArts,
  getAuthArts,
  deleteArt,
  likeArt,
  unlikeArt,
};

export default artService;
