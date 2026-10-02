import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { brand, categories, formatPrice, imagePath, products } from '../data/catalog';
import { useBag } from '../context/BagContext';
import ProductGrid from '../components/ProductGrid';
import { Dialog, Image, Quantity, Reveal } from '../components/UI';
import NotFound from './NotFound';

export default function Product() {
  const { slug } = useParams();
  const product = products.find((item) => item.slug === slug);
  return product ? (
    <ProductDetail key={product.id} product={product} />
  ) : (
    <NotFound />
  );
}

function ProductDetail({ product }) {
  const [active, setActive] = useState(0);
  const [variantId, setVariantId] = useState(product.variants.length === 1 && product.variants[0].available ? product.variants[0].id : '');
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [guide, setGuide] = useState(false);
  const swipeStart = useRef(null);
  const photos = useRef([]);
  const { add } = useBag();
  const selectedVariant = product.variants.find(v => v.id === variantId);
  function selectImage(index) {
    setActive(index);
    if (window.matchMedia('(min-width: 768px)').matches) {
      photos.current[index]?.scrollIntoView({
        block: 'start',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      });
    }
  }
  const changeImage = (direction) =>
    selectImage(
      (active + direction + product.images.length) % product.images.length,
    );
  const related = products
    .filter(
      (item) =>
        item.id !== product.id && item.categoryId === product.categoryId,
    )
    .slice(0, 4);
  function addToBag() {
    if (!variantId) {
      setFeedback('Choose your size first.');
      return;
    }
    add(product.id, variantId, quantity);
    setFeedback('Added to your bag.');
  }

  return (
    <div className="page-enter">
      <div className="product-breadcrumb">
        <Link to="/shop">
          <ArrowLeft size={15} /> Back to shop
        </Link>
        <span>
          {categories.find(c => c.id === product.categoryId)?.name} /{' '}
          {product.name}
        </span>
      </div>
      <section className="product-detail">
        <div className="product-description">
          <p className="eyebrow">VERIATION</p>
          <h1>{product.name}</h1>
          <p className="muted">{product.color}</p>
          <p>{product.description}</p>
          <details>
            <summary>About this piece</summary>
            <div className="garment-details">{product.details.slice(1).map((detail, i) => <p key={i}>{detail}</p>)}</div>
            
          </details>
          <details>
            <summary>Shipping & exchanges</summary>
            <p>
              Standard delivery: NPR 200 in this demo. Final delivery areas,
              timings and exchange terms will be confirmed before launch.
            </p>
          </details>
        </div>
        <div className="product-gallery">
          <div
            className="gallery-main"
            tabIndex={0}
            aria-label="Product gallery"
            onPointerDown={(event) => {
              if (event.pointerType === 'touch')
                swipeStart.current = event.clientX;
            }}
            onPointerUp={(event) => {
              if (swipeStart.current !== null) {
                const distance = event.clientX - swipeStart.current;
                if (Math.abs(distance) > 50) changeImage(distance < 0 ? 1 : -1);
              }
              swipeStart.current = null;
            }}
            onPointerCancel={() => {
              swipeStart.current = null;
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowLeft')
                event.preventDefault();
              if (event.key === 'ArrowRight') changeImage(1);
              if (event.key === 'ArrowLeft') changeImage(-1);
            }}
          >
            <div className="gallery-frame">
              {product.images.map((image, index) => (
                <Image
                  key={image}
                  ref={(node) => {
                    photos.current[index] = node;
                  }}
                  className={`gallery-image ${active === index ? 'is-active' : ''}`}
                  src={imagePath(image)}
                  alt={`${product.name} in ${product.color}, view ${index + 1}`}
                  width="1000"
                  height="1250"
                  draggable={false}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                />
              ))}
            </div>
            {product.images.length > 1 && (
              <div className="gallery-controls">
                <button
                  className="icon-button"
                  aria-label="Previous image"
                  onClick={() => changeImage(-1)}
                >
                  <ChevronLeft size={19} />
                </button>
                <span aria-live="polite" aria-atomic="true">
                  {active + 1} / {product.images.length}
                </span>
                <button
                  className="icon-button"
                  aria-label="Next image"
                  onClick={() => changeImage(1)}
                >
                  <ChevronRight size={19} />
                </button>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="thumbnails">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={active === index}
                  className={active === index ? 'selected' : ''}
                  onClick={() => selectImage(index)}
                >
                  <Image
                    src={imagePath(image, 560)}
                    alt=""
                    loading="lazy"
                    width="560"
                    height="700"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="purchase">
          <p className="detail-price">{formatPrice(selectedVariant?.price ?? product.price)}</p>
          {product.compareAtPrice && (
            <p className="muted">
              <s>{formatPrice(product.compareAtPrice)}</s>
            </p>
          )}
          <div className="size-heading">
            <span>Select size</span>
            <button className="plain-button" onClick={() => setGuide(true)}>
              Size help
            </button>
          </div>
          <div className="size-options" role="group" aria-label="Select size">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                disabled={!variant.available}
                aria-pressed={variantId === variant.id}
                className={variantId === variant.id ? 'selected' : ''}
                onClick={() => {
                  setVariantId(variant.id);
                  setFeedback('');
                }}
              >
                {variant.size}
              </button>
            ))}
          </div>
          <div className="quantity-row">
            <span>Quantity</span>
            <Quantity
              value={quantity}
              onChange={(value) => {
                setQuantity(value);
                setFeedback('');
              }}
            />
          </div>
          <button className="button add-button" onClick={addToBag} disabled={!product.inStock}>
            {!product.inStock ? 'Sold out' : feedback === 'Added to your bag.' ? (
              <>
                <Check size={18} /> Added to bag
              </>
            ) : (
              <>
                Add to bag <ArrowRight size={18} />
              </>
            )}
          </button>
          <div className="product-feedback" role="status">
            {feedback}
            {feedback === 'Added to your bag.' && (
              <Link to="/bag">
                View bag <ArrowRight size={14} />
              </Link>
            )}
          </div>
          <p className="demo-note">
            Estimated demo price. Sizes and stock are preview fixtures.
          </p>
        </div>
      </section>
      <Reveal as="section" className="section related">
        <div className="section-heading">
          <h2>You may also like.</h2>
          <Link className="text-link" to="/shop">
            Explore all <ArrowRight size={18} />
          </Link>
        </div>
        <ProductGrid products={related} />
      </Reveal>
      <Dialog
        open={guide}
        onDismiss={() => setGuide(false)}
        title="Find your fit"
      >
        <p>
          Demo sizes for this piece: {product.variants.map(v => v.size).join(', ')}. Unavailable options are disabled.
        </p>
        <p className="muted">
          Sizes are example options for this storefront preview. The final size chart and measurements will be added before launch.
        </p>
        <button className="button" onClick={() => setGuide(false)}>Continue shopping</button>
      </Dialog>
    </div>
  );
}

