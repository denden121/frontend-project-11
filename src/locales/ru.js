const resources = {
  translation: {
    title: 'RSS Агрегатор',
    form: {
      label: 'RSS-поток',
      placeholder: 'ссылка RSS',
      button: 'Добавить',
      help: 'Введите корректный URL RSS-ленты, например: https://example.com/feed',
    },
    errors: {
      required: 'Не должно быть пустым',
      url: 'Ссылка должна быть валидным URL',
      duplicate: 'RSS уже существует',
      unknown: 'Ошибка валидации',
    },
  },
};

export default resources;

