import {useRef, useEffect} from 'react';
export const useMountedRef = () => {
  const mountedRef = useRef(true);

  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    [],
  );
  return mountedRef.current;
};
