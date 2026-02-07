import './style.css';
import * as yup from 'yup';
import i18next from 'i18next';
import initView from './view.js';
import ru from './locales/ru.js';
import en from './locales/en.js';
import parseRss from './parser.js';
import fetchFeed from './api.js';

const DEFAULT_LANG = 'ru';
const SUPPORTED_LANGS = ['ru', 'en'];
const LANG_QUERY_PARAM = 'lang';
const LANG_BUTTON_SELECTOR = '[data-lang]';
const UPDATE_INTERVAL_MS = 5000;

const elements = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.rss-feedback'),
  title: document.querySelector('.rss-title'),
  label: document.querySelector('.rss-label'),
  help: document.querySelector('.rss-help'),
  hint: document.querySelector('.rss-hint'),
  submit: document.querySelector('.rss-submit'),
  feedsList: document.querySelector('.rss-feeds-list'),
  postsList: document.querySelector('.rss-posts-list'),
  feedsTitle: document.querySelector('.rss-feeds-title'),
  postsTitle: document.querySelector('.rss-posts-title'),
};

const state = {
  form: {
    status: 'idle',
    error: null,
  },
  feeds: [],
  posts: [],
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

yup.setLocale({
  mixed: {
    required: 'errors.required',
  },
  string: {
    url: 'errors.url',
    notOneOf: 'errors.duplicate',
  },
});

const buildSchema = (urls) => yup
  .string()
  .required()
  .url()
  .notOneOf(urls);

const validateUrl = (url, urls) => buildSchema(urls).validate(url);

const getExistingPostLinksForFeed = (posts, feedId) => {
  return new Set(posts.filter((p) => p.feedId === feedId).map((p) => p.link));
};

const TOAST_AUTO_HIDE_MS = 5000;

const showToast = (message, type = 'danger') => {
  const container = document.querySelector('.toast-container');
  if (!container) {
    return;
  }
  const toast = document.createElement('div');
  toast.className = `toast-notification alert alert-${type} shadow-sm mb-2`;
  toast.setAttribute('role', 'alert');
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-notification-hide');
    setTimeout(() => toast.remove(), 300);
  }, TOAST_AUTO_HIDE_MS);
};

const checkFeedForNewPosts = (watchedState, feed) => {
  return fetchFeed(feed.url)
    .then((xmlString) => {
      const { items } = parseRss(xmlString);
      const existingLinks = getExistingPostLinksForFeed(watchedState.posts, feed.id);
      const newItems = items.filter((item) => item.link && !existingLinks.has(item.link));
      newItems.forEach((item) => {
        watchedState.posts.push({
          id: generateId(),
          feedId: feed.id,
          title: item.title,
          link: item.link,
        });
      });

    })
    .catch(() => {
      const title = feed.title || feed.url;
      showToast(i18next.t('toast.feedUpdateError', { title }), 'danger');
    });
};

const checkAllFeeds = (watchedState) => {
  if (watchedState.feeds.length === 0) {
    return Promise.resolve();
  }
  return Promise.all(
    watchedState.feeds.map((feed) => checkFeedForNewPosts(watchedState, feed)),
  );
};

const scheduleUpdates = (watchedState) => {
  const run = () => {
    checkAllFeeds(watchedState).finally(() => {
      setTimeout(run, UPDATE_INTERVAL_MS);
    });
  };
  setTimeout(run, UPDATE_INTERVAL_MS);
};

const getInitialLanguage = () => {
  const params = new URLSearchParams(window.location.search);
  const langFromUrl = params.get(LANG_QUERY_PARAM);

  if (langFromUrl && SUPPORTED_LANGS.includes(langFromUrl)) {
    return langFromUrl;
  }

  return DEFAULT_LANG;
};

const setLangInUrl = (lang) => {
  const url = new URL(window.location.href);
  url.searchParams.set(LANG_QUERY_PARAM, lang);
  window.history.replaceState({}, '', url);
};

const updateLangButtons = () => {
  const langButtons = document.querySelectorAll(LANG_BUTTON_SELECTOR);
  const currentLang = i18next.language;

  langButtons.forEach((button) => {
    const { lang } = button.dataset;
    const isActive = lang === currentLang;

    button.classList.toggle('btn-primary', isActive);
    button.classList.toggle('btn-outline-secondary', !isActive);
  });
};

const applyTranslations = (watchedState) => {
  const {
    title,
    label,
    input,
    help,
    submit,
  } = elements;

  if (title) {
    title.textContent = i18next.t('title');
  }

  if (label) {
    label.textContent = i18next.t('form.label');
  }

  if (input) {
    input.placeholder = i18next.t('form.placeholder');
  }

  if (help) {
    help.textContent = i18next.t('form.help');
  }

  if (elements.hint) {
    elements.hint.textContent = i18next.t('form.hint');
  }

  if (submit) {
    const isLoading = watchedState && watchedState.form.status === 'loading';
    submit.textContent = isLoading ? i18next.t('form.buttonLoading') : i18next.t('form.button');
  }

  if (elements.feedsTitle) {
    elements.feedsTitle.textContent = i18next.t('feedsTitle');
  }
  if (elements.postsTitle) {
    elements.postsTitle.textContent = i18next.t('postsTitle');
  }

  updateLangButtons();
};

const runApp = () => {
  const watchedState = initView(state, elements);
  const { form, input } = elements;

  if (!form || !input) {
    return;
  }

  const langButtons = document.querySelectorAll(LANG_BUTTON_SELECTOR);

  applyTranslations(watchedState);

  langButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const { lang } = button.dataset;

      i18next.changeLanguage(lang)
        .then(() => {
          applyTranslations(watchedState);
          setLangInUrl(lang);
        });
    });
  });

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
        watchedState.form.status = 'loading';

        return fetchFeed(url);
      })
      .then((xmlString) => {
        const { feed, items } = parseRss(xmlString);
        const feedId = generateId();

        watchedState.feeds.push({
          id: feedId,
          url,
          title: feed.title,
          description: feed.description,
        });

        items.forEach((item) => {
          watchedState.posts.push({
            id: generateId(),
            feedId,
            title: item.title,
            link: item.link,
          });
        });

        watchedState.form.status = 'success';
      })
      .catch((error) => {
        if (error.message === 'parse') {
          watchedState.form.error = 'errors.parse';
        } else {
          watchedState.form.error = 'errors.network';
        }
        watchedState.form.status = 'error';
      });
  });

  scheduleUpdates(watchedState);
};

i18next
  .init({
    lng: getInitialLanguage(),
    resources: {
      ru,
      en,
    },
  })
  .then(runApp);

