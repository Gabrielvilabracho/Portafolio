interface CanvasLike {
  getContext(type: string): unknown | null;
}

/**
 * Verify that the browser can create a WebGL context before mounting a
 * WebGL-backed React island. The fallback context covers older Safari builds.
 */
export function canUseWebGL(createCanvas = (): CanvasLike => document.createElement('canvas')): boolean {
  try {
    const canvas = createCanvas();
    return Boolean(
      canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}
