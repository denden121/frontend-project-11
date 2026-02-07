const resources = {
  translation: {
    title: 'RSS Агрегатор',
    feedsTitle: 'Фиды',
    feedsEmpty: 'Пока нет фидов. Добавьте RSS-ленту выше.',
    postsTitle: 'Посты',
    postsEmpty: 'Пока нет постов.',
    form: {
      label: 'RSS-поток',
      placeholder: 'ссылка RSS',
      button: 'Добавить',
      buttonLoading: 'Загрузка…',
      help: 'Введите корректный URL RSS-ленты, например: https://example.com/feed',
      hint: 'Ссылка должна вести на RSS или Atom ленту (часто заканчивается на .rss, .xml или содержит /feed/). Обычная страница сайта не подойдёт.',
      success: 'RSS успешно загружен',
    },
    errors: {
      required: 'Не должно быть пустым',
      url: 'Ссылка должна быть валидным URL',
      duplicate: 'RSS уже существует',
      network: 'Ошибка сети',
      parse: 'Ресурс не содержит валидный RSS',
      unknown: 'Произошла ошибка. Попробуйте ещё раз.',
    },
    toast: {
      feedUpdateError: 'Не удалось обновить ленту: {{title}}',
    },
    post: {
      preview: 'Просмотр',
    },
    modal: {
      close: 'Закрыть',
    },
  },
};

export default resources;

