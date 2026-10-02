import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
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
}) {
  return (
    <div
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
    </div>
  );
}
import { useState } from 'react';
