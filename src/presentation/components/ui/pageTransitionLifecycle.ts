import { stripLocalePrefix } from '../../../utils/i18n';
import { stripBase } from '../../../utils/withBase';

export const COVER_MS = 600;
export const HOLD_MS = 150;
export const LOADER_GATE_MS = COVER_MS + HOLD_MS;
export const LEAVE_FALLBACK_MS = 1200;

export interface PageTransitionNavigationEvent {
  loader?: () => Promise<void>;
}

export interface PageTransitionPreparation {
  event: PageTransitionNavigationEvent;
  prefersReducedMotion: boolean;
  activateCurtain: () => void;
  waitForGate?: (milliseconds: number) => Promise<void>;
}

const waitForGate = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

/** Derive a readable page label from a base-prefixed, localized destination pathname. */
export function getPageTransitionLabel(
  pathname: string,
  base = import.meta.env.BASE_URL
): string {
  const routePath = stripLocalePrefix(stripBase(pathname, base)).replace(/\/$/, '');
  const lastSegment = routePath.split('/').pop() ?? '';

  return lastSegment ? lastSegment.replace(/-/g, ' ') : 'Home';
}

export function preparePageTransition({
  event,
  prefersReducedMotion,
  activateCurtain,
  waitForGate: gate = waitForGate,
}: PageTransitionPreparation): boolean {
  if (prefersReducedMotion) return false;

  activateCurtain();

  const originalLoader = event.loader;
  const covered = gate(LOADER_GATE_MS);
  if (originalLoader) {
    event.loader = async () => {
      await Promise.all([originalLoader(), covered]);
    };
  }

  return true;
}
