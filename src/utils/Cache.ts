export type Cache = {
  code_verifier: string;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
};
const appCache = new Map();

const cache = new Proxy<Partial<Cache>>(
  {},
  {
    get(target, prop) {
      const cachedElement = appCache.get(prop);
      if (cachedElement) {
        return cachedElement;
      } else {
        const localStorageElement = localStorage.getItem(prop as string);
        if (localStorageElement) {
          const parsedElement = JSON.parse(localStorageElement);
          appCache.set(prop, parsedElement);
          return parsedElement;
        }
        return Reflect.get(target, prop);
      }
    },
    set(target, prop, newValue) {
      appCache.set(prop, newValue);
      localStorage.setItem(prop as string, JSON.stringify(newValue));
      return Reflect.set(target, prop, newValue);
    },
  },
);

export default cache;
