const resources = {
  translation: {
    title: 'RSS Aggregator',
    feedsTitle: 'Feeds',
    feedsEmpty: 'No feeds yet. Add an RSS feed above.',
    postsTitle: 'Posts',
    postsEmpty: 'No posts yet.',
    form: {
      label: 'RSS feed',
      placeholder: 'RSS link',
      button: 'Add',
      buttonLoading: 'Loading…',
      help: 'Enter a valid RSS URL, for example: https://example.com/feed',
      hint: 'The link must point to an RSS or Atom feed (often ends with .rss, .xml or contains /feed/). A regular webpage will not work.',
    },
    errors: {
      required: 'Must not be empty',
      url: 'Link must be a valid URL',
      duplicate: 'This feed has already been added',
      network: 'Network error. Check your internet connection and try again.',
      parse: 'No RSS feed at this URL. Make sure the address points to a feed (RSS/Atom), not a regular page.',
      unknown: 'Something went wrong. Please try again.',
    },
    toast: {
      feedUpdateError: 'Failed to update feed: {{title}}',
    },
    post: {
      preview: 'Preview',
    },
    modal: {
      close: 'Close',
    },
  },
};

export default resources;

