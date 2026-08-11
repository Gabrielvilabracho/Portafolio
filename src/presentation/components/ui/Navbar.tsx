import { useState, useEffect, useRef } from 'react';
import { DEFAULT_LOCALE, LOCALES, localizePath, type Locale } from '../../../utils/i18n';
import { withBase } from '../../../utils/withBase';

export interface NavbarProps {
  currentLocale?: Locale;
  currentPath?: string;
}

const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
  ru: 'Русский',
};

export default function Navbar({ currentLocale = DEFAULT_LOCALE, currentPath = '/' }: NavbarProps) {
  const [blurAmount, setBlurAmount] = useState(0);
  const [bgOpacity, setBgOpacity] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const intersectingDark = useRef(new Set<Element>());

  useEffect(() => {
    if (!langOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLangOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [langOpen]);

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
  const base = import.meta.env.BASE_URL;
  const homeHref = localizePath('/', currentLocale, base);
  const contactHref = localizePath('/contact', currentLocale, base);

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
            href={homeHref}
            className="inline-flex items-center justify-center px-8 h-full"
            style={{ borderLeft: `1px solid ${borderColor}`, transition: 'border-color 0.3s' }}
          >
            <img
              src={withBase('/imagenes/gv-black.svg')}
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
          <div
            ref={langRef}
            className="relative flex items-stretch h-full"
            style={{
              marginLeft: '12px',
              borderLeft: `1px solid ${borderColor}`,
              transition: 'border-color 0.3s',
            }}
          >
            <button
              type="button"
              aria-label="Change language"
              aria-haspopup="true"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((open) => !open)}
              onMouseEnter={() => setHoveredItem('lang')}
              onMouseLeave={() => setHoveredItem(null)}
              className="flex items-center gap-2 px-8 h-full text-xs font-medium uppercase tracking-wider cursor-pointer bg-transparent border-0"
              style={{
                color: langOpen || hoveredItem === 'lang' ? 'var(--brand-orange-500)' : textColor,
                transition: 'color 0.3s',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <ellipse cx="12" cy="12" rx="4" ry="9" />
                <path d="M3 12h18" />
              </svg>
            </button>
            {langOpen && (
              <nav
                aria-label="Language"
                className="absolute top-full right-0 min-w-full"
                style={{
                  backgroundColor: isDark ? 'var(--brand-grey-900)' : '#ffffff',
                  border: `1px solid ${borderColor}`,
                  borderTop: 'none',
                }}
              >
                {LOCALES.map((locale) => {
                  const isCurrent = locale === currentLocale;
                  const isHovered = hoveredItem === `lang-${locale}`;
                  return (
                    <a
                      key={locale}
                      href={localizePath(currentPath, locale, base)}
                      aria-label={LOCALE_LABELS[locale]}
                      aria-current={isCurrent ? 'true' : undefined}
                      onMouseEnter={() => setHoveredItem(`lang-${locale}`)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="flex items-center justify-center px-8 py-3 text-xs font-medium uppercase tracking-wider"
                      style={{
                        color: isCurrent || isHovered ? 'var(--brand-orange-500)' : textColor,
                        transition: 'color 0.3s',
                      }}
                    >
                      {locale}
                    </a>
                  );
                })}
              </nav>
            )}
          </div>
          <a
            href={contactHref}
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
