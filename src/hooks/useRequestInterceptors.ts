import {useLayoutEffect} from 'react';
import cache from '../utils/Cache';
import {getTokens} from '../services/spotify/Authorization';
import axiosInstance from '../services/utils';
import {routes, useNavigation} from '../routes/routing';
export function useRequestInterceptors() {
  const {navigate} = useNavigation();
  useLayoutEffect(() => {
    const accesTokenInterceptor = axiosInstance.interceptors.request.use(
      async request => {
        const access_token = cache.tokens?.access_token;
        if (access_token) {
          request.headers.set('Authorization', `Bearer ${access_token}`);
        }
        return request;
      },
    );
    const refreshTokenInterceptor = axiosInstance.interceptors.response.use(
      request => request, //ignore the request, check the error,
      async error => {
        const config = error?.config;
        if (
          error?.response?.status === 401 &&
          cache.tokens?.refresh_token &&
          !config?.sent
        ) {
          config.sent = true;

          const result = await getTokens({
            grant_type: 'refresh_token',
            client_id: import.meta.env.VITE_CLIENT_ID,
            refresh_token: cache.tokens.refresh_token,
          });

          if (result) {
            cache.tokens = {
              access_token: result.access_token,
              refresh_token: result.refresh_token,
            };
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${result.access_token}`,
            };
          }

          return axiosInstance(config);
        } else if (
          error?.response?.status === 401 ||
          error?.response?.status === 403 ||
          error?.response?.status === 404
        ) {
          navigate(routes.login);
          return;
        }

        return Promise.reject(error);
      },
    );
    return () => {
      axiosInstance.interceptors.request.eject(accesTokenInterceptor);
      axiosInstance.interceptors.response.eject(refreshTokenInterceptor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
