import {useEffect, useMemo, useState} from 'react';
import {useSearchParams} from 'react-router-dom';

export type UseQueryParamsProps<T> = {
  key: string;
  initialValue?: T;
  transformer?: (value?: string) => T;
  resetOn?: T;
};

export function useQueryParam<T>({
  key,
  initialValue,
  transformer = unit => unit as T,
  resetOn,
}: UseQueryParamsProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParamElement = useMemo(() => {
    const queryElement = searchParams.get(key);
    if (queryElement) {
      return transformer(queryElement);
    }
    return initialValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const [value, setValue] = useState(searchParamElement);

  useEffect(() => {
    setValue(searchParamElement);
  }, [searchParamElement]);

  function setValueWithQueryParams(newValue: string) {
    setValue(transformer(newValue));
    setSearchParams(query => {
      if (query.has(key)) {
        query.set(key, newValue);
      } else {
        query.append(key, newValue);
      }
      if (resetOn === transformer(newValue)) {
        query.delete(key);
      }
      return query;
    });
  }
  return [value as T, setValueWithQueryParams] as const;
}
