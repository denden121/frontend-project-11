import axios from 'axios';

const ALL_ORIGINS_RAW = 'https://allorigins.hexlet.app/raw';

const fetchFeed = (feedUrl) => {
  const url = `${ALL_ORIGINS_RAW}?url=${encodeURIComponent(feedUrl)}&disableCache=true`;

  return axios.get(url, {
    timeout: 10000,
    responseType: 'text',
  }).then((response) => response.data);
};

export default fetchFeed;
