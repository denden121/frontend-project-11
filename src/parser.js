const parseRss = (xmlString) => {
  const doc = new DOMParser().parseFromString(xmlString, 'text/xml');
  const parseError = doc.querySelector('parsererror');

  if (parseError) {
    throw new Error('parse');
  }

  const channel = doc.querySelector('channel');
  const feedEl = doc.querySelector('feed'); 

  if (channel) {
    return parseRss2Channel(channel);
  }

  if (feedEl) {
    return parseAtomFeed(feedEl);
  }

  throw new Error('parse');
};

const getText = (el, tagName) => {
  const node = el.querySelector(tagName);
  return node ? node.textContent.trim() : '';
};

const getLinkFromItem = (itemEl) => {
  const linkEl = itemEl.querySelector('link');
  if (!linkEl) {
    return '';
  }
  return linkEl.getAttribute('href') || linkEl.textContent.trim();
};

const parseRss2Channel = (channel) => {
  const title = getText(channel, 'title');
  const description = getText(channel, 'description');

  if (!title) {
    throw new Error('parse');
  }

  const itemEls = channel.querySelectorAll('item');
  const items = Array.from(itemEls).map((item) => ({
    title: getText(item, 'title') || getText(item, 'description') || '',
    link: getLinkFromItem(item),
  }));

  return {
    feed: { title, description },
    items,
  };
};

const parseAtomFeed = (feedEl) => {
  const titleEl = feedEl.querySelector('title');
  const title = titleEl ? titleEl.textContent.trim() : '';
  const descEl = feedEl.querySelector('subtitle, summary, description');
  const description = descEl ? descEl.textContent.trim() : '';

  if (!title) {
    throw new Error('parse');
  }

  const entryEls = feedEl.querySelectorAll('entry');
  const items = Array.from(entryEls).map((entry) => {
    const linkEl = entry.querySelector('link[href]');
    const link = linkEl ? linkEl.getAttribute('href') : '';
    const titleNode = entry.querySelector('title');
    const itemTitle = titleNode ? titleNode.textContent.trim() : '';
    return { title: itemTitle, link };
  });

  return {
    feed: { title, description },
    items,
  };
};

export default parseRss;
