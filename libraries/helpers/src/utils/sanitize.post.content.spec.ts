import { sanitizePostContent } from './sanitize.post.content';

describe('sanitizePostContent', () => {
  it.each([undefined, null, 42, ''])('returns an empty string for %p', (v) => {
    expect(sanitizePostContent(v)).toBe('');
  });

  it('keeps allowed formatting tags', () => {
    const html = '<p><strong>bold</strong> <u>under</u></p>';
    expect(sanitizePostContent(html)).toBe(html);
  });

  it('removes scripts and event handlers', () => {
    expect(
      sanitizePostContent(
        '<p onclick="alert(1)">hi<script>alert(1)</script></p>'
      )
    ).toBe('<p>hi</p>');
  });

  it('drops javascript: links but keeps http links', () => {
    expect(sanitizePostContent('<a href="javascript:alert(1)">x</a>')).toBe(
      '<a>x</a>'
    );
    expect(sanitizePostContent('<a href="https://example.com">x</a>')).toBe(
      '<a href="https://example.com">x</a>'
    );
  });

  it('keeps mention attributes', () => {
    const html =
      '<span data-mention-id="1" data-mention-label="someone">@someone</span>';
    expect(sanitizePostContent(html)).toBe(html);
  });
});
