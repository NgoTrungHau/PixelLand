import * as httpRequest from '~/utils/httpRequest';

const API_URL = '/comments/';

// Create new Cmt
const createCmt = async (cmtData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await httpRequest.post(API_URL + 'create', cmtData, config);

  return response;
};

// Get user comments
const getCmts = async (art_id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await httpRequest.get(API_URL + art_id, config);
  return response;
};

// Edit user Cmt
const editCmt = async (CmtData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await httpRequest.post(
    API_URL + CmtData.id,
    CmtData,
    config,
  );
  return response;
};
// Delete user Cmt
const deleteCmt = async (CmtId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await httpRequest.deleteReq(API_URL + CmtId, config);
  return response;
};

// Like Cmt
const likeCmt = async (CmtData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await httpRequest.patch(
    API_URL + CmtData.Cmt_id + '/like',
    CmtData,
    config,
  );

  return response.data;
};
const unlikeCmt = async (CmtData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await httpRequest.patch(
    API_URL + CmtData.Cmt_id + '/unlike',
    CmtData,
    config,
  );

  return response.data;
};

const CmtService = {
  createCmt,
  getCmts,
  editCmt,
  deleteCmt,
  likeCmt,
  unlikeCmt,
};

export default CmtService;
