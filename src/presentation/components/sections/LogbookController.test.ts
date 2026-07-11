import { describe, expect, it, vi } from 'vitest';

vi.mock('react-globe.gl', () => ({
  default: () => null,
}));

import { ROUTE_LABELS, ports } from '../animations/LogbookGlobe';
import { logbookEntries } from './logbookEntries';

describe('Logbook route contract', () => {
  it('derives one globe route from each shared logbook entry', () => {
    expect(ROUTE_LABELS).toEqual(logbookEntries.map((entry) => entry.routeLabels));
    expect(ROUTE_LABELS).toHaveLength(logbookEntries.length);
  });

  it('resolves every route label to an existing globe port label', () => {
    const portLabels = new Set(ports.map((port) => port.label));

    for (const entry of logbookEntries) {
      for (const label of entry.routeLabels) {
        expect(portLabels.has(label)).toBe(true);
      }
    }
  });
});
