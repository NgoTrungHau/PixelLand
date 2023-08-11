import * as httpRequest from '~/utils/httpRequest';

export const search = async (username, type = 'less') => {
  try {
    const res = await httpRequest.get(`users/search`, {
      params: {
        username,
        type,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
