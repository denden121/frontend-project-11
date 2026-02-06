import './style.css';
import * as yup from 'yup';
import initView from './view.js';

const elements = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.rss-feedback'),
};

const state = {
  form: {
    status: 'idle', 
    error: null,
  },
  feeds: [],
};

const buildSchema = (urls) => yup
  .string()
  .required('URL обязателен')
  .url('Ссылка должна быть валидным URL')
  .notOneOf(urls, 'RSS уже существует');

const validateUrl = (url, urls) => buildSchema(urls).validate(url);

const runApp = () => {
  const watchedState = initView(state, elements);
  const { form, input } = elements;

  if (!form || !input) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const url = input.value.trim();

    watchedState.form.error = null;
    watchedState.form.status = 'validating';

    validateUrl(
      url,
      watchedState.feeds.map((feed) => feed.url),
    )
      .then(() => {
        watchedState.feeds.push({ url });
        watchedState.form.status = 'success';
      })
      .catch((error) => {
        watchedState.form.error = error;
        watchedState.form.status = 'error';
      });
  });
};

runApp();

