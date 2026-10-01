import { hasLinks, stripLinks } from './strip.links';

describe('hasLinks', () => {
  it.each([
    'see https://example.com',
    'see http://www.example.com/path?a=1',
    'see example.com',
    'see bit.ly/abc',
  ])('detects a link in "%s"', (text) => {
    expect(hasLinks(text)).toBe(true);
  });

  it.each(['plain text', 'mail user@example.com', '', null, undefined])(
    'finds no link in "%s"',
    (text) => {
      expect(hasLinks(text)).toBe(false);
    }
  );
});

describe('stripLinks', () => {
  it('removes scheme and bare-domain links and collapses whitespace', () => {
    expect(stripLinks('read https://example.com and example.org now')).toBe(
      'read and now'
    );
  });

  it('removes anchors left empty after stripping', () => {
    expect(
      stripLinks('<p>go <a href="x">https://example.com</a> now</p>')
    ).toBe('<p>go now</p>');
  });

  it('keeps email addresses', () => {
    expect(stripLinks('mail user@example.com')).toBe('mail user@example.com');
  });

  it('returns an empty string for missing input', () => {
    expect(stripLinks(undefined)).toBe('');
  });
});
