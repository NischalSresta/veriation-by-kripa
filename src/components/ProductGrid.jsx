import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { formatPrice, imagePath } from '../data/catalog';
import { Image, Reveal } from './UI';

export function ProductCard({
  product,
  index = 0,
  headingAs: Heading = 'h3',
  eager = false,
}) {
  const [preview, setPreview] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  return (
    <Reveal
      as="article"
      className="product-card"
      style={{ '--reveal-delay': `${(index % 4) * 65}ms` }}
    >
      <Link
        to={`/product/${product.slug}`}
        className="product-link"
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') setPreview(true);
        }}
        onFocus={() => setPreview(true)}
      >
        <div className="product-image" data-preload-images={product.images[1]?imagePath(product.images[1],560):undefined}>
          <Image
            src={imagePath(product.images[0], 400)}
            srcSet={`${imagePath(product.images[0], 400)} 400w, ${imagePath(product.images[0], 560)} 560w, ${imagePath(product.images[0])} 1000w`}
            sizes="(max-width: 767px) 45vw, (max-width: 1023px) 33vw, 25vw"
            alt={`${product.name} in ${product.color}`}
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={eager && index === 0 ? 'high' : 'auto'}
            width="560"
            height="700"
          />
          {preview && product.images[1] && (
            <Image
              className={`product-alternate ${previewLoaded ? 'is-loaded' : ''}`}
              src={imagePath(product.images[1], 560)}
              alt=""
              onLoad={() => setPreviewLoaded(true)}
              width="560"
              height="700"
            />
          )}
          <span className="product-open">
            <ArrowUpRight size={20} aria-hidden="true" />
          </span>
        </div>
        <div className="product-meta">
          <Heading>{product.name}</Heading>
          <span className="product-color">{product.color}</span>
        </div>
        <p className="price">
          {formatPrice(product.price)}
          {!product.inStock && <span className="stock-label">Sold out</span>}
          {product.compareAtPrice && (
            <s>{formatPrice(product.compareAtPrice)}</s>
          )}
        </p>
      </Link>
    </Reveal>
  );
}

export default function ProductGrid({
  products,
  headingAs = 'h3',
  eager = false,
  showControls = false,
}) {
  const rail = useRef(null);
  const [position, setPosition] = useState(1);
  const [atEnd, setAtEnd] = useState(false);
  useEffect(() => {
    if (!showControls) return;
    const node = rail.current;
    let frame = 0;
    const update = () => {
      frame = 0;
      const cards = [...node.children];
      const nearest = cards.reduce((best, card, index) =>
        Math.abs(card.offsetLeft - node.offsetLeft - node.scrollLeft) < best.distance
          ? { index, distance: Math.abs(card.offsetLeft - node.offsetLeft - node.scrollLeft) } : best,
        { index: 0, distance: Infinity });
      setPosition(nearest.index + 1);
      setAtEnd(node.scrollLeft + node.clientWidth >= node.scrollWidth - 2);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    resize.observe(node);
    node.addEventListener('scroll', schedule, { passive: true });
    update();
    return () => { resize.disconnect(); node.removeEventListener('scroll', schedule); cancelAnimationFrame(frame); };
  }, [showControls, products.length]);
  const move = direction => {
    const node = rail.current;
    const card = node.children[0];
    const gap = parseFloat(getComputedStyle(node).columnGap) || 0;
    node.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  return (
    <><div
      ref={rail}
      className="product-grid"
      role="region"
      aria-label="Products - swipe left or right to browse on mobile"
      tabIndex={0}
    >
      {products.map((product, index) => (
        <ProductCard
          product={product}
          index={index}
          headingAs={headingAs}
          eager={eager && index < 4}
          key={product.id}
        />
      ))}
    </div>{showControls && <div className="mobile-edit-controls">
      <span>Explore the edit <span className="rail-count">{String(position).padStart(2,'0')} / {String(products.length).padStart(2,'0')}</span></span>
      <div><button type="button" aria-label="Previous favourite" disabled={position === 1} onClick={() => move(-1)}><ChevronLeft size={18}/></button><button type="button" aria-label="Next favourite" disabled={atEnd} onClick={() => move(1)}><ChevronRight size={18}/></button></div>
    </div>}</>
  );
}
