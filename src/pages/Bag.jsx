import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import { useBag } from '../context/BagContext';
import { formatPrice, imagePath } from '../data/catalog';
import { Dialog, Image, Quantity } from '../components/UI';
import Checkout from '../components/Checkout';

export default function Bag() {
  const { items, count, subtotal, update, remove } = useBag();
  const [checkout, setCheckout] = useState(false);
  return (
    <section className="section bag-page page-enter">
      <div className="page-heading">
        <h1>Your bag.</h1>
        <p>
          {count
            ? `${count} ${count === 1 ? 'piece' : 'pieces'}, chosen by you.`
            : 'Good things start with a little discovery.'}
        </p>
      </div>
      {items.length ? (
        <div className="bag-layout">
          <div className="bag-items">
            {items.map((line) => (
              <article className="bag-item" key={line.variantId}>
                <Link to={`/product/${line.product.slug}`}>
                  <Image
                    src={imagePath(line.product.images[0], 560)}
                    alt={`${line.product.name} in ${line.product.color}`}
                    width="560"
                    height="700"
                  />
                </Link>
                <div className="bag-item-info">
                  <Link to={`/product/${line.product.slug}`}>
                    <h2>{line.product.name}</h2>
                  </Link>
                  <p className="muted">
                    {line.product.color} /{' '}
                    {
                      line.product.variants.find(
                        (variant) => variant.id === line.variantId,
                      ).size
                    }
                  </p>
                  <p>{formatPrice(line.unitPrice)}</p>
                  <Quantity
                    label={`Quantity for ${line.product.name}`}
                    value={line.quantity}
                    onChange={(quantity) => update(line.variantId, quantity)}
                  />
                </div>
                <div className="bag-item-end">
                  <span>{formatPrice(line.unitPrice * line.quantity)}</span>
                  <button
                    className="icon-button"
                    aria-label={`Remove ${line.product.name}`}
                    onClick={() => remove(line.variantId)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            ))}
            <Link className="text-link" to="/shop">
              Keep exploring <ArrowRight size={17} />
            </Link>
          </div>
          <aside className="bag-summary">
            <h2>A little summary.</h2>
            <div>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="muted">
              Estimated delivery: NPR 200. All prices are demo estimates.
            </p>
            <button className="button" onClick={() => setCheckout(true)}>
              Checkout <ArrowRight size={18} />
            </button>
            <p className="demo-note">Demo bag only. No orders or payments.</p>
          </aside>
        </div>
      ) : (
        <div className="empty-state">
          <ShoppingBag size={35} strokeWidth={1.4} />
          <h2>A little room for something new.</h2>
          <p>Explore the collection and find a piece that feels like you.</p>
          <Link className="button" to="/shop">
            Explore the collection <ArrowRight size={18} />
          </Link>
        </div>
      )}
      <Dialog
        open={checkout}
        onDismiss={() => setCheckout(false)}
        title="Checkout"
      >
        {checkout && <Checkout subtotal={subtotal} onDismiss={() => setCheckout(false)} />}
      </Dialog>
    </section>
  );
}
