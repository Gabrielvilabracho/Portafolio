import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const [blurAmount, setBlurAmount] = useState(0);
  const [bgOpacity, setBgOpacity] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const intersectingDark = useRef(new Set<Element>());

  useEffect(() => {
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / 80, 1);
      setBlurAmount(progress * 12);
      setBgOpacity(progress * 0.85);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const darkElements = document.querySelectorAll('[data-navbar-theme="dark"]');
    if (darkElements.length === 0) return;

    let observer: IntersectionObserver;

    const createObserver = () => {
      const navH = headerRef.current?.offsetHeight ?? 70;
      // Shrink the observation zone to just the navbar strip at the top of the viewport
      const bottomMargin = -(window.innerHeight - navH);

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              intersectingDark.current.add(entry.target);
            } else {
              intersectingDark.current.delete(entry.target);
            }
          });
          setIsDark(intersectingDark.current.size > 0);
        },
        {
          rootMargin: `0px 0px ${bottomMargin}px 0px`,
          threshold: 0,
        }
      );

      darkElements.forEach((el) => observer.observe(el));
    };

    createObserver();

    const handleResize = () => {
      observer.disconnect();
      intersectingDark.current.clear();
      createObserver();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const bgColor = isDark
    ? `rgba(12, 12, 12, ${bgOpacity})`
    : `rgba(255, 255, 255, ${bgOpacity})`;

  const borderColor = isDark ? 'rgba(47, 48, 50, 1)' : 'rgba(195, 196, 200, 1)';
  const textColor = isDark ? '#ffffff' : 'var(--brand-grey-600)';
  const logoFilter = isDark ? 'brightness(0) invert(1)' : 'none';

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-50"
      style={{
        height: 'var(--layout-nav-height)',
        backdropFilter: `blur(${blurAmount}px)`,
        backgroundColor: bgColor,
        borderBottom: `1px solid ${borderColor}`,
        transition: 'background-color 0.3s, border-color 0.3s',
      }}
    >
      <div className="w-full px-11 h-full flex items-stretch justify-between">

        <div className="flex items-stretch h-full">
          <a
            href="/"
            className="inline-flex items-center justify-center px-8 h-full"
            style={{ borderLeft: `1px solid ${borderColor}`, transition: 'border-color 0.3s' }}
          >
            <img
              src="/imagenes/gv-black.svg"
              alt="GV"
              height="22"
              style={{
                height: '22px',
                width: 'auto',
                display: 'block',
                filter: logoFilter,
                transition: 'filter 0.3s',
              }}
            />
          </a>

        </div>

        <div className="flex items-stretch h-full">
          <a
            href="/contact"
            onMouseEnter={() => setHoveredItem('contact')}
            onMouseLeave={() => setHoveredItem(null)}
            className="flex items-center justify-center px-8 h-full text-sm font-medium uppercase tracking-wider"
            style={{
              borderLeft: `1px solid ${borderColor}`,
              borderRight: `1px solid ${borderColor}`,
              color: hoveredItem === 'contact' ? 'var(--brand-orange-500)' : textColor,
              transition: 'color 0.3s, border-color 0.3s',
            }}
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  );
}
