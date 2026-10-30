import { useEffect, useRef, useState, type PointerEvent } from 'react';

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const CONTROL_ZOOM_STEP = 0.25;
const WHEEL_ZOOM_STEP = 0.15;

interface InteractiveSvgViewerProps {
  src: string;
  alt: string;
}

interface ViewState {
  scale: number;
  x: number;
  y: number;
}

interface PointerPosition {
  x: number;
  y: number;
}

interface DragState {
  pointerId: number;
  startPointer: PointerPosition;
  startView: ViewState;
}

interface PinchState {
  startDistance: number;
  startMidpoint: PointerPosition;
  startView: ViewState;
}

const INITIAL_VIEW: ViewState = { scale: MIN_SCALE, x: 0, y: 0 };

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function getDistance(first: PointerPosition, second: PointerPosition): number {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function getMidpoint(first: PointerPosition, second: PointerPosition): PointerPosition {
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
  };
}

function isSameView(first: ViewState, second: ViewState): boolean {
  return first.scale === second.scale && first.x === second.x && first.y === second.y;
}

export default function InteractiveSvgViewer({ src, alt }: InteractiveSvgViewerProps) {
  const [view, setView] = useState<ViewState>(INITIAL_VIEW);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const viewportRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<ViewState>(INITIAL_VIEW);
  const pointersRef = useRef(new Map<number, PointerPosition>());
  const dragRef = useRef<DragState | null>(null);
  const pinchRef = useRef<PinchState | null>(null);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const consumeWheelZoom = (event: WheelEvent) => {
      if (event.deltaY === 0) return;

      const direction = event.deltaY < 0 ? 1 : -1;
      if (setScale(viewRef.current.scale + direction * WHEEL_ZOOM_STEP)) {
        event.preventDefault();
      }
    };

    viewport.addEventListener('wheel', consumeWheelZoom, { passive: false });

    return () => viewport.removeEventListener('wheel', consumeWheelZoom);
  }, []);

  function constrainView(nextView: ViewState): ViewState {
    const scale = clamp(nextView.scale, MIN_SCALE, MAX_SCALE);
    const viewport = viewportRef.current?.getBoundingClientRect();
    const maximumX = viewport ? (viewport.width * (scale - 1)) / 2 : 0;
    const maximumY = viewport ? (viewport.height * (scale - 1)) / 2 : 0;

    return {
      scale,
      x: clamp(nextView.x, -maximumX, maximumX),
      y: clamp(nextView.y, -maximumY, maximumY),
    };
  }

  function applyView(nextView: ViewState): boolean {
    const constrainedView = constrainView(nextView);
    if (isSameView(viewRef.current, constrainedView)) return false;

    viewRef.current = constrainedView;
    setView(constrainedView);
    return true;
  }

  function setScale(nextScale: number): boolean {
    return applyView({ ...viewRef.current, scale: nextScale });
  }

  function resetView() {
    applyView(INITIAL_VIEW);
  }

  function getTrackedPointers(): [PointerPosition, PointerPosition] | null {
    const pointers = Array.from(pointersRef.current.values());
    if (pointers.length < 2) return null;

    return [pointers[0], pointers[1]];
  }

  function beginPinch() {
    const pointers = getTrackedPointers();
    if (!pointers) return;

    const [firstPointer, secondPointer] = pointers;
    pinchRef.current = {
      startDistance: Math.max(getDistance(firstPointer, secondPointer), 1),
      startMidpoint: getMidpoint(firstPointer, secondPointer),
      startView: viewRef.current,
    };
    dragRef.current = null;
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture?.(event.pointerId);

    if (pointersRef.current.size >= 2) {
      beginPinch();
      return;
    }

    if (viewRef.current.scale > MIN_SCALE) {
      dragRef.current = {
        pointerId: event.pointerId,
        startPointer: { x: event.clientX, y: event.clientY },
        startView: viewRef.current,
      };
    }
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!pointersRef.current.has(event.pointerId)) return;

    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const pinch = pinchRef.current;
    const pointers = getTrackedPointers();

    if (pinch && pointers) {
      const [firstPointer, secondPointer] = pointers;
      const scale = pinch.startView.scale * (getDistance(firstPointer, secondPointer) / pinch.startDistance);
      const midpoint = getMidpoint(firstPointer, secondPointer);
      const didChange = applyView({
        scale,
        x: pinch.startView.x + midpoint.x - pinch.startMidpoint.x,
        y: pinch.startView.y + midpoint.y - pinch.startMidpoint.y,
      });

      if (didChange) event.preventDefault();
      return;
    }

    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const didChange = applyView({
      ...drag.startView,
      x: drag.startView.x + event.clientX - drag.startPointer.x,
      y: drag.startView.y + event.clientY - drag.startPointer.y,
    });

    if (didChange) event.preventDefault();
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    pointersRef.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    }

    if (pointersRef.current.size >= 2) {
      beginPinch();
      return;
    }

    pinchRef.current = null;
    const remainingPointer = Array.from(pointersRef.current.entries())[0];
    if (remainingPointer && viewRef.current.scale > MIN_SCALE) {
      const [pointerId, position] = remainingPointer;
      dragRef.current = {
        pointerId,
        startPointer: position,
        startView: viewRef.current,
      };
      return;
    }

    dragRef.current = null;
  }

  const transform = `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`;
  const zoomPercent = Math.round(view.scale * 100);

  return (
    <div
      data-interactive-svg-viewer
      className="flex min-h-[22rem] w-full flex-col overflow-hidden bg-[#0a0a0d]"
    >
      <div
        className="flex items-center justify-between gap-3 border-b border-brand-grey-700"
        style={{ padding: 'var(--brand-scale-300) var(--brand-scale-500)' }}
      >
        <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--brand-grey-400)' }}>
          Diagram navigator
        </p>
        <div className="flex items-center gap-2" role="group" aria-label="Diagram zoom controls">
          <button
            type="button"
            aria-label="Zoom out"
            className="border border-brand-grey-600 px-3 py-2 text-xs uppercase tracking-wider"
            style={{ color: 'var(--brand-grey-100)', backgroundColor: 'var(--brand-grey-800)' }}
            onClick={() => setScale(viewRef.current.scale - CONTROL_ZOOM_STEP)}
          >
            Zoom out
          </button>
          <button
            type="button"
            aria-label="Reset zoom"
            className="border border-brand-orange-500 px-3 py-2 text-xs uppercase tracking-wider"
            style={{ color: 'var(--brand-orange-500)', backgroundColor: 'transparent' }}
            onClick={resetView}
          >
            Reset
          </button>
          <button
            type="button"
            aria-label="Zoom in"
            className="border border-brand-grey-600 px-3 py-2 text-xs uppercase tracking-wider"
            style={{ color: 'var(--brand-grey-100)', backgroundColor: 'var(--brand-grey-800)' }}
            onClick={() => setScale(viewRef.current.scale + CONTROL_ZOOM_STEP)}
          >
            Zoom in
          </button>
          <output className="min-w-11 text-right text-xs tabular-nums" style={{ color: 'var(--brand-grey-400)' }} aria-live="polite">
            {zoomPercent}%
          </output>
        </div>
      </div>

      <div
        ref={viewportRef}
        data-svg-viewer-viewport
        className="relative flex min-h-[20rem] flex-1 items-center justify-center overflow-hidden"
        role="region"
        aria-label={`Interactive viewer for ${alt}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        style={{ touchAction: 'pan-x pan-y', cursor: view.scale > MIN_SCALE ? 'grab' : 'zoom-in' }}
      >
        <img
          data-svg-viewer-diagram
          src={src}
          alt={alt}
          draggable={false}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain"
          style={{
            transform,
            transformOrigin: 'center',
            transition: prefersReducedMotion ? 'none' : 'transform 160ms ease-out',
            willChange: view.scale > MIN_SCALE ? 'transform' : 'auto',
          }}
        />
      </div>
    </div>
  );
}
