import { Component, useState, type ReactNode } from 'react';
import LogbookGlobe from '../animations/LogbookGlobe.tsx';
import { logbookEntries } from './logbookEntries';

/**
 * WebGL can fail (GPU process disabled, headless browsers, old hardware).
 * Without a boundary, a Globe crash unmounts the whole Logbook island.
 */
class GlobeErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            minHeight: '32em',
            background: '#18191b',
            backgroundImage: "url('/imagenes/cross-background.svg')",
            backgroundSize: 'cover',
          }}
        >
          <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--brand-grey-500)' }}>
            Interactive map unavailable — WebGL is disabled in this browser
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export const entries = logbookEntries;

export default function LogbookController() {
  const [current, setCurrent] = useState(0);
  const entry = entries[current];

  return (
    <>
      {/* Header row */}
      <div
        className="border-b border-brand-grey-700"
        style={{ padding: 'var(--brand-scale-1100) var(--brand-scale-900)', position: 'relative' }}
      >
        <div className="flex flex-col gap-4">
          <p
            className="flex items-center gap-2 text-xs uppercase tracking-widest leading-none"
            style={{ color: 'var(--brand-grey-400)' }}
          >
            <span
              className="inline-block shrink-0"
              style={{ width: '0.85em', height: '0.85em', backgroundColor: 'var(--brand-orange-500)' }}
            />
            Logbook
          </p>
          <h2
            className="uppercase font-normal text-white"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.02em', maxWidth: '20em', lineHeight: 1.1 }}
          >
            From the radar screen to the neural network.
          </h2>
        </div>

        {/* Pagination squares — bottom right, just above the line */}
        <div className="flex items-center gap-2" style={{ position: 'absolute', bottom: '12px', right: 'var(--brand-scale-900)' }}>
          {entries.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to entry ${i + 1}`}
              style={{
                width: '0.875em',
                height: '0.875em',
                border: '1px solid',
                borderColor: i === current ? 'var(--brand-orange-500)' : 'var(--brand-grey-600)',
                background: i === current ? 'var(--brand-orange-500)' : 'var(--brand-grey-750)',
                cursor: 'pointer',
                transition: 'background 0.2s, border-color 0.2s',
                flexShrink: 0,

              }}
            />
          ))}
        </div>
      </div>

      {/* Grid: Globe + Entry */}
      <div className="grid grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-3 border-brand-grey-700 lg:border-r" style={{ minHeight: '32em' }}>
          <GlobeErrorBoundary>
            <LogbookGlobe currentEntry={current} />
          </GlobeErrorBoundary>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4" style={{ padding: 'var(--brand-scale-1000) var(--brand-scale-900)' }}>
          <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--brand-orange-500)' }}>
            {entry.tag}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--brand-grey-100)', whiteSpace: 'pre-line' }}>
            {entry.text}
          </p>
        </div>
      </div>
    </>
  );
}
