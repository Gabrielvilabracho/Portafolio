import { describe, expect, it } from 'vitest';
import { canUseWebGL } from './webgl';

const canvasWith = (...contexts: string[]) => () => ({
  getContext: (name: string) => (contexts.includes(name) ? {} : null),
});

describe('canUseWebGL', () => {
  it('accepts a standard WebGL context, including Safari’s legacy fallback', () => {
    expect(canUseWebGL(canvasWith('webgl'))).toBe(true);
    expect(canUseWebGL(canvasWith('experimental-webgl'))).toBe(true);
  });

  it('accepts WebGL2 and rejects browsers that cannot create either context', () => {
    expect(canUseWebGL(canvasWith('webgl2'))).toBe(true);
    expect(canUseWebGL(canvasWith())).toBe(false);
  });

  it('treats context creation errors as genuinely unavailable', () => {
    expect(canUseWebGL(() => {
      throw new Error('canvas unavailable');
    })).toBe(false);
  });
});
