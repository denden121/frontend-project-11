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
    },
    errors: {
      required: 'Не должно быть пустым',
      url: 'Ссылка должна быть валидным URL',
      duplicate: 'Этот RSS-поток уже добавлен',
      network: 'Ошибка сети. Проверьте подключение к интернету и попробуйте снова.',
      parse: 'По этой ссылке нет RSS-ленты. Убедитесь, что адрес ведёт на ленту (RSS/Atom), а не на обычную страницу.',
      unknown: 'Произошла ошибка. Попробуйте ещё раз.',
    },
  },
};

export default resources;

