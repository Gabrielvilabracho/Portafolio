import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import VideoPlayer from './VideoPlayer.astro';

const sources = [
  { src: '/videos/case-study-walkthrough.webm', type: 'video/webm' },
  { src: '/videos/case-study-walkthrough.mp4', type: 'video/mp4' },
] as const;

async function render() {
  const container = await AstroContainer.create();
  return container.renderToString(VideoPlayer, {
    props: {
      poster: '/imagenes/case-study-walkthrough-poster.jpg',
      title: 'Document intelligence case study walkthrough',
      sources,
    },
  });
}

describe('VideoPlayer', () => {
  it('renders the required poster and meaningful title', async () => {
    const html = await render();

    expect(html).toContain('poster="/imagenes/case-study-walkthrough-poster.jpg"');
    expect(html).toContain('title="Document intelligence case study walkthrough"');
    expect(html).toMatch(/<span[^>]*>Document intelligence case study walkthrough<\/span>/);
  });

  it('defers supported local source URLs until playback is activated', async () => {
    const html = await render();
    const deferredMarkup = html.slice(0, html.indexOf('<noscript>'));

    expect(deferredMarkup).toContain('data-src="/videos/case-study-walkthrough.webm"');
    expect(deferredMarkup).toContain('data-src="/videos/case-study-walkthrough.mp4"');
    expect(deferredMarkup).toContain('type="video/webm"');
    expect(deferredMarkup).toContain('type="video/mp4"');
    expect(deferredMarkup).not.toMatch(/<source[^>]*\ssrc=/);
    expect(deferredMarkup).toContain('preload="none"');
  });

  it('renders an accessible Play button', async () => {
    const html = await render();

    expect(html).toMatch(
      /<button[^>]*type="button"[^>]*data-video-play[^>]*aria-label="Play Document intelligence case study walkthrough"[^>]*>/,
    );
    expect(html).toMatch(/<span[^>]*>Play<\/span>/);
  });

  it('renders a native no-script fallback with the same sources', async () => {
    const html = await render();
    const noscriptMarkup = html.slice(html.indexOf('<noscript>'));

    expect(noscriptMarkup).toContain('<video class="video-player__media" controls');
    expect(noscriptMarkup).toContain('src="/videos/case-study-walkthrough.webm" type="video/webm"');
    expect(noscriptMarkup).toContain('src="/videos/case-study-walkthrough.mp4" type="video/mp4"');
  });
});
