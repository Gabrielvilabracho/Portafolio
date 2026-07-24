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
