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
  const { input, feedback } = elements;

  if (!input || !feedback) {
    return;
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

const initView = (state, elements) => onChange(
  state,
  (path) => {
    if (path === 'form.status' || path === 'form.error') {
      renderFormState(elements, state);
    }
  },
);

export default initView;

