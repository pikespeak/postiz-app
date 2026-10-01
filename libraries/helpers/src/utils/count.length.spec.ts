import { countLength, textSlicer, weightedLength } from './count.length';

describe('countLength', () => {
  it('uses the plain string length for generic providers', () => {
    expect(countLength('linkedin', 'hello')).toBe(5);
  });

  it('counts UTF-8 bytes for threads', () => {
    expect(countLength('threads', 'ü')).toBe(2);
  });

  it('uses the weighted twitter length for x', () => {
    expect(countLength('x', 'a'.repeat(10))).toBe(10);
    expect(countLength('x', 'https://example.com/a/very/long/path')).toBe(23);
  });
});

describe('weightedLength', () => {
  it('weights CJK characters double', () => {
    expect(weightedLength('日本')).toBe(4);
  });
});

describe('textSlicer', () => {
  it('returns the requested end for non-x providers', () => {
    expect(textSlicer('linkedin', 10, 'a'.repeat(50))).toEqual({
      start: 0,
      end: 10,
    });
  });

  it('keeps the requested end when the text fits on x', () => {
    expect(textSlicer('x', 280, 'short')).toEqual({ start: 0, end: 280 });
  });

  it('cuts after the last character that fits when the text is too long for x', () => {
    const text = 'a'.repeat(10);
    const { start, end } = textSlicer('x', 5, text);
    expect(text.slice(start, end)).toBe('aaaaa');
  });

  it('never splits an emoji when cutting for x', () => {
    const text = 'a😀😀😀';
    const { start, end } = textSlicer('x', 5, text);
    expect(text.slice(start, end)).toBe('a😀😀');
  });

  it('keeps an empty text empty on x', () => {
    const { start, end } = textSlicer('x', 5, '');
    expect(''.slice(start, end)).toBe('');
  });
});
