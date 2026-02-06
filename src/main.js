import './style.css';

const form = document.querySelector('.rss-form');
const input = document.querySelector('#rss-url');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const url = input?.value?.trim();
    if (url) {
      console.log('RSS URL:', url);
    }
  });
}
