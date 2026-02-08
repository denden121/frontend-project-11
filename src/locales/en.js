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
      success: 'RSS successfully loaded',
    },
    errors: {
      required: 'Must not be empty',
      url: 'Link must be a valid URL',
      duplicate: 'RSS already exists',
      network: 'Network error',
      parse: 'Resource does not contain valid RSS',
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
}
export default resources
