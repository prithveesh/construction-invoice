const config = {
  mode: 'cors', // no-cors, *cors, same-origin
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'same-origin', // include, *same-origin, omit
  referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  headers: {
    'Content-Type': 'application/json',
  },
};

const baseUrl = 'https://construction-invoice-ztcwqntjcq-ue.a.run.app';
// const baseUrl = 'http://localhost:8100';

export const makePost = async (url, data, headers) => {
  const response = await fetch(baseUrl + url, {
    method: 'POST',
    ...config,
    headers: {
      ...config.headers,
      ...headers,
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const makeGet = async (url, headers) => {
  const response = await fetch(baseUrl + url, {
    method: 'GET',
    ...config,
    headers: {
      ...config.headers,
      ...headers,
    },
  });

  return response.json();
};

export const makeDelete = async (url, headers) => {
  const response = await fetch(baseUrl + url, {
    method: 'DELETE',
    ...config,
    headers: {
      ...config.headers,
      ...headers,
    },
  });

  return response.json();
};
