import axios from 'axios';
import { getBearToken, getStoredAuthToken } from '../utils/auth.utils';

const http = axios.create({
    baseURL: 'http://localhost:4000/api',
});
// // In here, we handle the api error
// http.interceptors.response.use(undefined, (error) =>
//   Promise.reject({
//     msg: getApiError(error),
//     status: error.response.status || 500,
//   }),
// );

// http.interceptors.request.use((config) => {
//   config.withCredentials = true;
//   return config;
// });

export { http };
