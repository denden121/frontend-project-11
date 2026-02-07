import axios from 'axios';

const ALL_ORIGINS_GET = 'https://allorigins.hexlet.app/get';

const fetchFeed = (feedUrl) => {
  const url = `${ALL_ORIGINS_GET}?url=${encodeURIComponent(feedUrl)}&disableCache=true`;

  return axios.get(url, {
    timeout: 10000,
    responseType: 'json',
  }).then((response) => response.data.contents);
};

export default fetchFeed;
