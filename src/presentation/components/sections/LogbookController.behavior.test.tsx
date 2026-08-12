// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const controllerMocks = vi.hoisted(() => ({
	isWebGLAvailable: true,
	rendererThrows: false,
}));

vi.mock('../../../utils/webgl', () => ({
	canUseWebGL: () => controllerMocks.isWebGLAvailable,
}));

vi.mock('../animations/LogbookGlobe.tsx', () => ({
	default: () => {
		if (controllerMocks.rendererThrows) {
			throw new Error('WebGL renderer initialization failed');
		}

		return <div>Mock globe mounted</div>;
	},
}));

import LogbookController from './LogbookController';

interface RenderedController {
  container: HTMLDivElement;
  root: Root;
}

async function renderController(): Promise<RenderedController> {
  const container = document.createElement('div');
  const root = createRoot(container);

  await act(async () => {
    root.render(<LogbookController />);
  });

  return { container, root };
}

describe('LogbookController WebGL behavior', () => {
	afterEach(() => {
		controllerMocks.isWebGLAvailable = true;
		controllerMocks.rendererThrows = false;
	});

	it('mounts the globe when WebGL is available', async () => {
		controllerMocks.isWebGLAvailable = true;
		const { container, root } = await renderController();

		expect(container.textContent).toContain('Mock globe mounted');
		expect(container.textContent).not.toContain('Interactive map unavailable');

    root.unmount();
	});

	it('renders the WebGL-unavailable fallback', async () => {
		controllerMocks.isWebGLAvailable = false;
		const { container, root } = await renderController();

		expect(container.textContent).toContain('Interactive map unavailable — WebGL is disabled in this browser');
		expect(container.textContent).not.toContain('Mock globe mounted');

    root.unmount();
	});

	it('renders the renderer-error fallback', async () => {
		controllerMocks.isWebGLAvailable = true;
		controllerMocks.rendererThrows = true;
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

		try {
			const { container, root } = await renderController();

			expect(container.textContent).toContain('Interactive map unavailable — the globe renderer could not initialize');
			expect(container.textContent).not.toContain('Mock globe mounted');

      root.unmount();
    } finally {
      consoleError.mockRestore();
    }
  });
});
