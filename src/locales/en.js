const resources = {
  translation: {
    title: 'RSS Aggregator',
    form: {
      label: 'RSS feed',
      placeholder: 'RSS link',
      button: 'Add',
      help: 'Enter a valid RSS URL, for example: https://example.com/feed',
    },
    errors: {
      required: 'Must not be empty',
      url: 'Link must be a valid URL',
      duplicate: 'RSS already exists',
      unknown: 'Validation error',
    },
  },
};

export default resources;

