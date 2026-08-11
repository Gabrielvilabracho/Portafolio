import { describe, expect, it, vi } from 'vitest';
import { getPageTransitionLabel, preparePageTransition } from './pageTransitionLifecycle';

describe('getPageTransitionLabel', () => {
  it('identifies the base-prefixed default-locale home route as Home', () => {
    expect(getPageTransitionLabel('/Portafolio/', '/Portafolio/')).toBe('Home');
  });

  it('removes the base and locale before formatting a nested route label', () => {
    expect(getPageTransitionLabel('/Portafolio/es/case-studies/', '/Portafolio/')).toBe('case studies');
  });
});

describe('PageTransition timing contract', () => {
  it('releases the loader only after the 600 ms cover and 150 ms readable hold', async () => {
    vi.useFakeTimers();

    try {
      const originalLoader = vi.fn(async () => {});
      const event = { loader: originalLoader };
      const activateCurtain = vi.fn();

      preparePageTransition({
        event,
        prefersReducedMotion: false,
        activateCurtain,
      });

      const gatedLoader = event.loader;
      expect(gatedLoader).toBeDefined();

      let resolved = false;
      const loading = gatedLoader!().then(() => {
        resolved = true;
      });

      await vi.advanceTimersByTimeAsync(599);
      expect(resolved).toBe(false);

      await vi.advanceTimersByTimeAsync(1);
      // The curtain has fully covered the page, but the readable hold is still active.
      expect(resolved).toBe(false);

      await vi.advanceTimersByTimeAsync(149);
      expect(resolved).toBe(false);

      await vi.advanceTimersByTimeAsync(1);
      await loading;
      expect(resolved).toBe(true);
      expect(originalLoader).toHaveBeenCalledOnce();
      expect(activateCurtain).toHaveBeenCalledOnce();
    } finally {
      vi.useRealTimers();
    }
  });

  it('bypasses curtain activation and loader gating when reduced motion is preferred', async () => {
    const originalLoader = vi.fn(async () => {});
    const event = { loader: originalLoader };
    const activateCurtain = vi.fn();
    const waitForGate = vi.fn(async () => {});

    const activated = preparePageTransition({
      event,
      prefersReducedMotion: true,
      activateCurtain,
      waitForGate,
    });

    await event.loader?.();

    expect(activated).toBe(false);
    expect(event.loader).toBe(originalLoader);
    expect(originalLoader).toHaveBeenCalledOnce();
    expect(activateCurtain).not.toHaveBeenCalled();
    expect(waitForGate).not.toHaveBeenCalled();
  });
});
