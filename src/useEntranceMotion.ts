import { useLayoutEffect } from 'react';

const ease = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

// Backwards fill covers entrance delays; no persistent styles hide content.
export function useEntranceMotion() {
  useLayoutEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set<Animation>();
    let observer: IntersectionObserver | undefined;

    function reveal(element: Element, id: string, delay = 0, distance = 18, duration = 620) {
      if (preference.matches || typeof element.animate !== 'function') return;
      const base = getComputedStyle(element).transform;
      const transform = base === 'none' ? '' : base;
      // Keep the main content painted while it moves into place. Fading the
      // largest element from zero delays LCP until its entrance has finished.
      const fade = !element.matches('.hero h1, .hero-main-window');
      const animation = element.animate(
        [
          { opacity: fade ? 0 : 1, transform: `translate3d(0, ${distance}px, 0) ${transform}`.trim() },
          { opacity: 1, transform: base },
        ],
        { duration, delay, easing: ease, fill: 'backwards' },
      );
      animation.id = id;
      animations.add(animation);
      animation.finished.then(() => animations.delete(animation)).catch(() => animations.delete(animation));
    }

    if (!preference.matches) {
      // Establish the page, then introduce the promise, action, and actual app.
      const entrance: [string, number, number][] = [
        ['.header-inner', 0, 8],
        ['.app-emblem', 50, 12],
        ['.hero h1', 110, 18],
        ['.hero-copy>p:not(.hero-note)', 190, 14],
        ['.hero-actions', 260, 12],
        ['.hero-note', 320, 8],
        ['.hero-main-window', 350, 28],
        ['.landscape-window', 460, 20],
        ['.brief-window', 540, 20],
        ['.changelog-page-heading', 100, 18],
      ];
      const prerendered = document.getElementById('root')?.dataset.prerendered === 'true';
      for (const [selector, delay, distance] of prerendered ? [] : entrance) {
        const element = document.querySelector(selector);
        if (element) reveal(element, `page-entrance:${selector}`, delay, distance);
      }
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(entries => {
          let stagger = 0;
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            observer?.unobserve(entry.target);
            reveal(entry.target, 'scroll-entrance', stagger, 22, 650);
            stagger = Math.min(stagger + 85, 255);
          }
        }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
        document.querySelectorAll('.workflow-bridge, .feature-intro, .feature-card, .workspace-copy, .workspace-art, .download-panel, .faq-heading, .faq-items details, .footer-top, .release-entry, .changelog-end').forEach(element => observer?.observe(element));
      }
    }

    const cancel = () => {
      if (!preference.matches) return;
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
    };
    preference.addEventListener('change', cancel);
    return () => {
      observer?.disconnect();
      preference.removeEventListener('change', cancel);
      animations.forEach(animation => animation.cancel());
    };
  }, []);
}
