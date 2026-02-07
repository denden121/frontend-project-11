import onChange from 'on-change';
import i18next from 'i18next';

const getErrorMessage = (errorKey) => {
  if (!errorKey) {
    return '';
  }

  return i18next.t(errorKey);
};

const renderFormState = (elements, state) => {
  const { form } = state;
  const { input, feedback, submit } = elements;

  if (!input || !feedback) {
    return;
  }

  const isLoading = form.status === 'loading';

  if (submit) {
    submit.disabled = isLoading;
    submit.textContent = isLoading ? i18next.t('form.buttonLoading') : i18next.t('form.button');
  }

  if (input) {
    input.readOnly = isLoading;
    input.classList.toggle('is-loading', isLoading);
  }

  if (form.status === 'error') {
    input.classList.add('is-invalid');
    feedback.textContent = getErrorMessage(form.error);
    return;
  }

  input.classList.remove('is-invalid');
  feedback.textContent = '';

  if (form.status === 'success') {
    input.value = '';
    input.focus();
  }
};

const renderFeeds = (container, feeds) => {
  if (!container) {
    return;
  }

  if (feeds.length === 0) {
    container.innerHTML = `<p class="text-muted">${escapeHtml(i18next.t('feedsEmpty'))}</p>`;
    return;
  }

  const cards = feeds.map((feed) => {
    const card = document.createElement('div');
    card.className = 'card mb-3';
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${escapeHtml(feed.title)}</h5>
        ${feed.description ? `<p class="card-text text-muted small">${escapeHtml(feed.description)}</p>` : ''}
      </div>
    `;
    return card;
  });

  container.innerHTML = '';
  cards.forEach((el) => container.appendChild(el));
};

const renderPosts = (container, posts) => {
  if (!container) {
    return;
  }

  if (posts.length === 0) {
    const li = document.createElement('li');
    li.className = 'list-group-item text-muted';
    li.textContent = i18next.t('postsEmpty');
    container.innerHTML = '';
    container.appendChild(li);
    return;
  }

  const items = posts.map((post) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    const a = document.createElement('a');
    a.href = post.link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = post.title || post.link;
    li.appendChild(a);
    return li;
  });

  container.innerHTML = '';
  items.forEach((el) => container.appendChild(el));
};

const escapeHtml = (str) => {
  if (!str) {
    return '';
  }
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

const initView = (state, elements) => {
  renderFormState(elements, state);
  renderFeeds(elements.feedsList, state.feeds);
  renderPosts(elements.postsList, state.posts);

  return onChange(
    state,
    (path) => {
      if (path === 'form.status' || path === 'form.error') {
        renderFormState(elements, state);
      }
      if (path === 'feeds' || path.startsWith('feeds.')) {
        renderFeeds(elements.feedsList, state.feeds);
      }
      if (path === 'posts' || path.startsWith('posts.')) {
        renderPosts(elements.postsList, state.posts);
      }
    },
  );
};

export default initView;
