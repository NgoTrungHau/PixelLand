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

  return response.data;
};

// Get user arts
const getArts = async () => {
  const response = await httpRequest.get(API_URL);

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

const artService = {
  createArt,
  getArts,
  deleteArt,
};

export default artService;
