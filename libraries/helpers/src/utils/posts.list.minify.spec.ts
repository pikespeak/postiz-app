import {
  expandPosts,
  expandPostsList,
  minifyPosts,
  minifyPostsList,
} from './posts.list.minify';

const post = {
  id: 'post-1',
  content: '<p>hello</p>',
  publishDate: '2026-01-01T10:00:00.000Z',
  state: 'QUEUE',
  group: 'group-1',
  integration: {
    id: 'int-1',
    providerIdentifier: 'x',
    name: 'Demo',
    picture: null,
  },
  tags: [{ tag: { id: 'tag-1', name: 'news', color: '#fff' } }],
};

describe('posts list minify', () => {
  it('shortens the keys of the paginated list', () => {
    const minified = minifyPostsList({
      posts: [post],
      total: 1,
      page: 0,
      limit: 20,
      hasMore: false,
    });

    expect(minified).toMatchObject({ t: 1, pg: 0, l: 20, hm: false });
    expect(minified.p[0]).toMatchObject({
      i: 'post-1',
      c: '<p>hello</p>',
      n: { i: 'int-1', pi: 'x', n: 'Demo' },
      tg: [{ t: { i: 'tag-1', n: 'news', c: '#fff' } }],
    });
  });

  it('round-trips the paginated list', () => {
    const data = {
      posts: [post],
      total: 1,
      page: 0,
      limit: 20,
      hasMore: false,
    };
    expect(expandPostsList(minifyPostsList(data))).toEqual(data);
  });

  it('round-trips the calendar response', () => {
    const data = { posts: [post] };
    expect(expandPosts(minifyPosts(data))).toEqual(data);
  });

  it('keeps unknown keys and missing relations untouched', () => {
    const data = { posts: [{ id: 'p', extra: 1, integration: null }] };
    expect(expandPosts(minifyPosts(data))).toEqual(data);
  });

  it('expands an empty response to an empty post list', () => {
    expect(expandPostsList({})).toEqual({ posts: [] });
  });
});
