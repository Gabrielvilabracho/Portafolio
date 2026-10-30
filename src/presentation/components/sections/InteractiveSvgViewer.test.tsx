// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import InteractiveSvgViewer from './InteractiveSvgViewer';

Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true);

interface RenderedViewer {
  container: HTMLDivElement;
  root: Root;
}

interface PointerEventDetails {
  pointerId: number;
  pointerType: string;
  clientX: number;
  clientY: number;
}

async function renderViewer(): Promise<RenderedViewer> {
  const container = document.createElement('div');
  const root = createRoot(container);

  await act(async () => {
    root.render(
      <InteractiveSvgViewer
        src="/imagenes/Frame 9-2.svg"
        alt="Document Intelligence platform architecture and operational workflow"
      />,
    );
  });

  return { container, root };
}

function createPointerEvent(type: string, details: PointerEventDetails): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    pointerId: { value: details.pointerId },
    pointerType: { value: details.pointerType },
    clientX: { value: details.clientX },
    clientY: { value: details.clientY },
  });

  return event;
}

async function dispatchPointerEvent(element: HTMLElement, type: string, details: PointerEventDetails): Promise<Event> {
  const event = createPointerEvent(type, details);

  await act(async () => {
    element.dispatchEvent(event);
  });

  return event;
}

describe('InteractiveSvgViewer', () => {
  it('zooms with the labelled controls and resets to the complete diagram', async () => {
    const { container, root } = await renderViewer();

    const zoomIn = container.querySelector<HTMLButtonElement>('button[aria-label="Zoom in"]');
    const reset = container.querySelector<HTMLButtonElement>('button[aria-label="Reset zoom"]');
    const diagram = container.querySelector<HTMLImageElement>('img');

    expect(zoomIn).not.toBeNull();
    expect(reset).not.toBeNull();
    expect(diagram?.alt).toBe('Document Intelligence platform architecture and operational workflow');
    expect(diagram?.style.transform).toContain('scale(1)');

    await act(async () => {
      zoomIn?.click();
    });

    expect(diagram?.style.transform).toContain('scale(1.25)');

    await act(async () => {
      reset?.click();
    });

    expect(diagram?.style.transform).toContain('scale(1)');
    root.unmount();
  });

  it('consumes wheel input only when it can zoom the diagram', async () => {
    const { container, root } = await renderViewer();
    const viewport = container.querySelector<HTMLDivElement>('[data-svg-viewer-viewport]');
    const diagram = container.querySelector<HTMLImageElement>('[data-svg-viewer-diagram]');

    expect(viewport).not.toBeNull();

    const wheelAtMinimum = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 100 });
    await act(async () => {
      viewport?.dispatchEvent(wheelAtMinimum);
    });

    expect(wheelAtMinimum.defaultPrevented).toBe(false);

    const zoomInWheel = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: -100 });
    await act(async () => {
      viewport?.dispatchEvent(zoomInWheel);
    });

    expect(zoomInWheel.defaultPrevented).toBe(true);
    expect(diagram?.style.transform).toContain('scale(1.15)');
    root.unmount();
  });

  it('zooms with a two-pointer pinch and bounds drag panning inside the viewer', async () => {
    const { container, root } = await renderViewer();
    const viewport = container.querySelector<HTMLDivElement>('[data-svg-viewer-viewport]');
    const diagram = container.querySelector<HTMLImageElement>('[data-svg-viewer-diagram]');

    expect(viewport).not.toBeNull();
    Object.defineProperty(viewport, 'getBoundingClientRect', {
      value: () => new DOMRect(0, 0, 300, 200),
    });

    await dispatchPointerEvent(viewport!, 'pointerdown', { pointerId: 1, pointerType: 'touch', clientX: 100, clientY: 100 });
    await dispatchPointerEvent(viewport!, 'pointerdown', { pointerId: 2, pointerType: 'touch', clientX: 200, clientY: 100 });
    const pinchMove = await dispatchPointerEvent(viewport!, 'pointermove', {
      pointerId: 2,
      pointerType: 'touch',
      clientX: 250,
      clientY: 100,
    });

    expect(pinchMove.defaultPrevented).toBe(true);
    expect(diagram?.style.transform).toContain('scale(1.5)');

    await dispatchPointerEvent(viewport!, 'pointerup', { pointerId: 1, pointerType: 'touch', clientX: 100, clientY: 100 });
    await dispatchPointerEvent(viewport!, 'pointermove', {
      pointerId: 2,
      pointerType: 'touch',
      clientX: 10000,
      clientY: 100,
    });

    expect(diagram?.style.transform).toContain('translate3d(75px, 0px, 0)');
    root.unmount();
  });

  it('does not animate transforms when reduced motion is preferred', async () => {
    const originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({
        matches: true,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }),
    });

    try {
      const { container, root } = await renderViewer();
      const diagram = container.querySelector<HTMLImageElement>('[data-svg-viewer-diagram]');

      expect(diagram?.style.transition).toBe('none');
      root.unmount();
    } finally {
      if (originalMatchMedia) {
        Object.defineProperty(window, 'matchMedia', originalMatchMedia);
      } else {
        Reflect.deleteProperty(window, 'matchMedia');
      }
    }
  });
});
