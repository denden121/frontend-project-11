import './style.css';
import * as yup from 'yup';
import i18next from 'i18next';
import initView from './view.js';
import ru from './locales/ru.js';
import en from './locales/en.js';

const DEFAULT_LANG = 'ru';
const SUPPORTED_LANGS = ['ru', 'en'];
const LANG_QUERY_PARAM = 'lang';
const LANG_BUTTON_SELECTOR = '[data-lang]';

const elements = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.rss-feedback'),
  title: document.querySelector('.rss-title'),
  label: document.querySelector('.rss-label'),
  help: document.querySelector('.rss-help'),
  submit: document.querySelector('.rss-submit'),
};

const state = {
  form: {
    status: 'idle',
    error: null,
  },
  feeds: [],
};

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

const applyTranslations = () => {
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

  if (submit) {
    submit.textContent = i18next.t('form.button');
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

  applyTranslations();

  langButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const { lang } = button.dataset;

      i18next.changeLanguage(lang)
        .then(() => {
          applyTranslations();
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
        watchedState.feeds.push({ url });
        watchedState.form.status = 'success';
      })
      .catch((error) => {
        watchedState.form.error = error.message || 'errors.unknown';
        watchedState.form.status = 'error';
      });
  });
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

