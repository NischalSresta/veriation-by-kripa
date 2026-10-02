import { useEffect, useId, useRef, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';

export function Reveal({
  children,
  className = '',
  as: Tag = 'div',
  ...props
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const element = ref.current;
    element.classList.add('reveal-ready');
    // Keep first-viewport content painted; stagger only content reached by scrolling.
    if (element.getBoundingClientRect().top < window.innerHeight) {
      element.classList.add('reveal-above-fold');
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('revealed');
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${className}`} {...props}>
      {children}
    </Tag>
  );
}

export function Image({ src, alt, ...props }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return failed ? (
    <div
      className={`image-fallback ${props.className || ''}`}
      role="img"
      aria-label={alt}
    >
      Image unavailable
    </div>
  ) : (
    <img src={src} alt={alt} onError={() => setFailed(true)} {...props} />
  );
}

export function Dialog({ open, onDismiss, title, children }) {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onDismiss}
      onClick={(event) => {
        if (event.target === event.currentTarget) onDismiss();
      }}
    >
      <div className="dialog-content">
        <div className="dialog-header">
          <h2 id={titleId}>{title}</h2>
          <button
            className="icon-button"
            onClick={onDismiss}
            aria-label="Close dialog"
          >
            <X />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

export function Quantity({ value, onChange, label = 'Quantity' }) {
  return (
    <div className="quantity" role="group" aria-label={label}>
      <button
        aria-label={`Decrease ${label.toLowerCase()}`}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
      >
        <Minus size={15} />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        aria-label={`Increase ${label.toLowerCase()}`}
        onClick={() => onChange(value + 1)}
        disabled={value >= 99}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
