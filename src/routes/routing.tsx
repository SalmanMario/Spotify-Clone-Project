/* eslint-disable @typescript-eslint/no-explicit-any */
import {useMemo} from 'react';

import {useNavigate} from 'react-router-dom';

export const routes = {
  home: () => '/',
  login: () => '/login',
  artistById: (p: {id: string}) => `/artist/${p.id}`,
  playlistById: (p: {id: string}) => `/playlist/${p.id}`,
  albumById: (p: {id: string}) => `/album/${p.id}`,
  trackById: (p: {id: string}) => `/track/${p.id}`,
  collectionTracks: () => '/collection/tracks',
};

export function route(fn: () => string): string;
export function route<T>(fn: (p: T) => string, params: Array<keyof T>): string;
export function route<T>(fn: (p: T) => string, params: Array<keyof T> = []) {
  const parameter = Object.fromEntries(
    params.map(p => [p, ':' + p.toString()]),
  );
  return fn(parameter as any);
}

// nu te intereseaza
type RouteParams<T extends Record<keyof any, (...args: any[]) => any>> = {
  // remove functions that have no params from the keys
  [P in keyof T as T[P] extends (params?: undefined) => any
    ? never
    : P]: Parameters<T[P]>[0]; // get the `params` prop from the record
};

export type AppRouteParams = RouteParams<typeof routes>;

export function useNavigation() {
  const navigate = useNavigate();
  return useMemo(
    () => ({
      baseNavigate: navigate,
      navigate<P extends any[]>(fn: (...p: P) => string, ...a: P) {
        navigate(fn(...a));
      },
    }),
    [navigate],
  );
}
