import useSWR from 'swr';

import { Router, i18n } from '../i18n';
import fetcher from '../libs/fetcher';
import postData from '../libs/postData';
import { isBrowser } from '../libs/utils';

export default function useSweeper(query = {}) {
  const key = shouldFetch(query) ? createApiUrl(query) : null;
  // TODO: Add fetcher after api sweeper implementation
  const response = useSWR(key, {
    initialData: getInitialData(key),
    onSuccess(sweepers) {
      if (isBrowser() && sweepers) localStorage.setItem(key, JSON.stringify(sweepers));
    },
  });
  return response;
}

export const fetchSweeper = async (query) => {
  return fetcher(createApiUrl(query));
};

export const postSweeper = async (data, mutate, revalidate) => {
  mutate(data, false); // local mutate without revalidation
  // TODO: api POST sweeper implementation
  if (isBrowser() && data) localStorage.setItem(createApiUrl(), JSON.stringify(data)); // workaround
  // await postData(createApiUrl(), data); // POST request
  // revalidate(); // revalidate
};

export const routeSweeper = (query) => {
  return Router.push(createUrl(query));
};

const getInitialData = (key) => {
  let initialData;
  if (isBrowser()) {
    const value = localStorage.getItem(key);
    initialData = value && JSON.parse(value);
  }
  return initialData ?? [];
};

const shouldFetch = (query) => {
  return query;
};

const createApiUrl = (query) => {
  return createUrl({ api: true, ...query });
};

const createUrl = (query) => {
  const lang = i18n.language ?? 'en';
  let url = `/${lang}${query?.api ? '/api' : ''}/sweeper`;
  if (query?.id || query?.slug) {
    url += `/${query.id || query?.slug}`;
  }
  return url;
};
