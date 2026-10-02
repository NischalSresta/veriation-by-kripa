import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const COVER_MS = 340;
const REVEAL_MS = 600;

// White mosaic tiles dissolve independently, matching the supplied frames.
export default function PageMotion({ children }) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? '' : 'uncover',
  );
  const busy = useRef(false);
  const timer = useRef(null);
  const columns = window.innerWidth < 768 ? 4 : 10;
  const rows = Math.ceil(window.innerHeight / (window.innerWidth / columns));
  const tileCount = columns * rows;
  useEffect(() => {
    timer.current = setTimeout(() => setPhase(''), REVEAL_MS);
    return () => clearTimeout(timer.current);
  }, []);

  function onNavigate(event) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const link = event.target.closest('a[href]');
    if (!link || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href);
    if (
      url.origin !== location.origin ||
      url.pathname === location.pathname ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    event.preventDefault();
    if (busy.current) return;
    clearTimeout(timer.current);
    busy.current = true;
    setPhase('cover');
    timer.current = setTimeout(() => {
      navigate(url.pathname + url.search + url.hash);
      setPhase('uncover');
      document.getElementById('main')?.focus({ preventScroll: true });
      timer.current = setTimeout(() => {
        setPhase('');
        busy.current = false;
      }, REVEAL_MS);
    }, COVER_MS);
  }

  return (
    <div onClickCapture={onNavigate}>
      {children}
      {phase && (
        <div
          className={`page-wipe ${phase}`}
          style={{ '--columns': columns, '--rows': rows }}
          aria-hidden="true"
        >
          {Array.from({ length: tileCount }, (_, index) => (
            <span
              key={index}
              style={{
                '--delay': `${Math.round((((index * 29) % tileCount) / tileCount) * 260)}ms`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
