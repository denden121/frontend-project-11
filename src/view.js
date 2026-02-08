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
  const { input, feedback, successFeedback, submit } = elements;

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
    if (!isLoading) {
      input.removeAttribute('readonly');
    }
  }

  if (form.status === 'error') {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    feedback.textContent = getErrorMessage(form.error);
    feedback.style.display = 'block';
    if (successFeedback) {
      successFeedback.textContent = '';
      successFeedback.className = 'valid-feedback rss-success';
      successFeedback.style.display = 'none';
    }
    return;
  }

  input.classList.remove('is-invalid');
  input.classList.remove('is-valid');
  feedback.textContent = '';
  feedback.style.display = '';
  if (successFeedback) {
    successFeedback.textContent = '';
    successFeedback.style.display = '';
  }

  if (form.status === 'success') {
    input.classList.add('is-valid');
    if (successFeedback) {
      successFeedback.textContent = i18next.t('form.success');
      successFeedback.className = 'valid-feedback rss-success';
      successFeedback.style.display = '';
    }
    input.value = '';
    input.focus();
    return;
  }

  input.classList.remove('is-valid');
  if (successFeedback) {
    successFeedback.textContent = '';
    successFeedback.className = 'valid-feedback rss-success';
    successFeedback.style.display = '';
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

const renderPosts = (container, posts, readPostIds = []) => {
  if (!container) {
    return;
  }

  const readSet = new Set(readPostIds);

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
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    const a = document.createElement('a');
    a.href = post.link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = readSet.has(post.id) ? 'fw-normal' : 'fw-bold';
    a.textContent = post.title || post.link;
    li.appendChild(a);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-outline-primary btn-sm post-preview-btn';
    btn.dataset.postId = post.id;
    btn.textContent = i18next.t('post.preview');
    li.appendChild(btn);
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
  renderPosts(elements.postsList, state.posts, state.readPostIds);

  return onChange(
    state,
    (path) => {
      if (path === 'form.status' || path === 'form.error') {
        renderFormState(elements, state);
      }
      if (path === 'feeds' || path.startsWith('feeds.')) {
        renderFeeds(elements.feedsList, state.feeds);
      }
      if (path === 'posts' || path.startsWith('posts.') || path === 'readPostIds' || path.startsWith('readPostIds.')) {
        renderPosts(elements.postsList, state.posts, state.readPostIds);
      }
    },
  );
};

export default initView;
