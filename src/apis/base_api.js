import BaseAxios from 'axios';

import { apiBaseUrl } from '../config';

const axios = BaseAxios.create({
  baseURL: apiBaseUrl,
  timeout: 60 * 1000
});

export const callYupApi = async (apiConfig) => {
  const headers = {
    Accept: 'application/json'
  };

  const response = await axios.request({
    headers,
    ...apiConfig
  });

  return response.data;
};

export default callYupApi;
