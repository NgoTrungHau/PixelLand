import * as httpRequest from '~/utils/httpRequest';

export const login = async (email, password) => {
  try {
    const res = await httpRequest.post(`users/login`, {
      email,
      password,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
