import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function EnterScreen({ onEntered }) {
  const dialog = useRef(null);
  const [value, setValue] = useState(0);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    dialog.current.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.current?.close();
      document.body.style.overflow = overflow;
    };
  }, []);
  useEffect(() => {
    if (!leaving) return;
    try {
      sessionStorage.setItem('zefo-entered-v1', 'yes');
    } catch {}
    const timer = setTimeout(
      onEntered,
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 600,
    );
    return () => clearTimeout(timer);
  }, [leaving, onEntered]);
  const enter = () => setLeaving(true);

  return (
    <dialog
      ref={dialog}
      className={`entry-screen ${leaving ? 'leaving' : ''}`}
      aria-label="Welcome to ZEFO"
      onCancel={(event) => {
        event.preventDefault();
        enter();
      }}
    >
      <div className="entry-top">
        <span>ZEFO</span>
        <span>PERSONAL. PREMIUM. CONCEPT-DRIVEN.</span>
      </div>
      <div className="entry-center">
        <img
          src="/images/zefo/zefo-logo-400.webp"
          width="400"
          height="111"
          alt="ZEFO"
        />
        <p>Fashion with a personal point of view.</p>
      </div>
      <div className="entry-bottom">
        <label className="entry-slider" style={{ '--progress': value / 100 }}>
          <span>Swipe to enter</span>
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            autoFocus
            aria-label="Swipe to enter ZEFO"
            disabled={leaving}
            onChange={(event) => {
              const next = Number(event.target.value);
              setValue(next);
              if (next >= 92) enter();
            }}
            onPointerUp={() => {
              if (!leaving) setValue(0);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') enter();
            }}
          />
          <span className="entry-handle" aria-hidden="true">
            <ArrowRight size={22} />
          </span>
        </label>
        <button className="entry-skip" onClick={enter} disabled={leaving}>
          Or enter the store <ArrowRight size={14} />
        </button>
        <span className="entry-caption">THE WORLD OF ZEFO</span>
      </div>
    </dialog>
  );
}
