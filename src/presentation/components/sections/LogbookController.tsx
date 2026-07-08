import { Component, useState, type ReactNode } from 'react';
import LogbookGlobe from '../animations/LogbookGlobe.tsx';

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

const entries = [
  {
    tag: 'Entry 01 — Enlisted',
    text: `I began my career in the Navy, trained as a Tactical Systems Operator specialized in radar. My job was to read the picture no one else could see: contacts, bearings, and speeds emerging from noise on a screen — and turn them into decisions in real time.

But more than the technical skill, what I want to convey is what it means to truly understand and describe the reality of the world we live in. That experience shaped my humanitarian values and sharpened my critical view of how the hidden realities of our society actually work. It was a turning point — a reality everyone should witness, if only to learn to appreciate, respect, and look after one another a little more.`,
  },
  {
    tag: 'Entry 02 — Participation in SNMG / SNMCMG · NATO',
    text: `Integration into NATO's Standing Naval Forces — the core of the Alliance's permanent maritime presence, ready to respond to crises and military exercises. Both forces operate under Allied Maritime Command (MARCOM).

SNMG — frigates, destroyers, and logistic support ships providing continuous escort and defense capability, deployed in Northern European and Atlantic waters or the Mediterranean depending on the group.

SNMCMG — minehunters and command ships dedicated to keeping shipping lanes safe by searching for, detecting, and neutralizing sea mines, including both modern devices and historical ordnance from the World Wars.`,
  },
  {
    tag: 'Entry 03 — Operation Sea Guardian · NATO',
    text: `NATO maritime mission focused on maritime situational awareness, counter-terrorism deterrence, and regional security capacity-building. Its aim is not direct humanitarian rescue, but ensuring maritime security through surveillance and countering arms trafficking and terrorist networks.

Humanitarian assistance and rescue — as a military force, there is an international legal obligation to assist any vessel in distress or shipwrecked persons detected within the area of operations.

Aegean Sea precedent — NATO previously deployed a dedicated support and reconnaissance mission to curb illicit trafficking of people, in cooperation with Greece, Turkey, and the European Union.`,
  },
  {
    tag: 'Entry 04 — Operation Atalanta · EU NAVFOR Somalia',
    text: `EU naval operation deployed in the Indian Ocean, the Red Sea, and the Gulf of Aden, off the coast of Somalia, under the Common Security and Defence Policy (CSDP). The EU's first naval mission, launched in 2008 in response to the rise of Somali piracy.

Counter-piracy — deterrence, prevention, and suppression of acts of piracy and armed robbery off the Somali coast.

Protection of vulnerable shipping — escorting World Food Programme (WFP) vessels and AMISOM/AUSSOM shipments, along with other especially exposed maritime traffic.

Maritime surveillance and security — monitoring illegal fishing and illicit activities in the region (arms and drug trafficking), in coordination with EU NAVFOR, CMF, and formerly NATO.`,
  },
];

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
          <p className="text-sm leading-relaxed" style={{ color: 'var(--brand-grey-300)', whiteSpace: 'pre-line' }}>
            {entry.text}
          </p>
        </div>
      </div>
    </>
  );
}
