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
const editCmt = async (cmtData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await httpRequest.post(
    API_URL + cmtData.id,
    cmtData,
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
const likeCmt = async (cmt_id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await httpRequest.patch(
    API_URL + cmt_id + '/like',
    {},
    config,
  );
  return response;
};
const unlikeCmt = async (cmt_id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await httpRequest.patch(
    API_URL + cmt_id + '/unlike',
    {},
    config,
  );
  return response;
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
