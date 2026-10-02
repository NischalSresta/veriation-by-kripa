import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { categories, collections, products } from '../data/catalog';
import ProductGrid from '../components/ProductGrid';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const category = params.get('category') || '';
  const collection = params.get('collection') || '';
  const line = params.get('line') || '';
  const sort = params.get('sort') || 'newest';
  const collectionName = collections.find(
    (item) => item.id === collection,
  )?.name;
  function filter(name, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    setParams(next, { replace: true });
  }
  const filtered = products
    .filter(
      (item) =>
        (!category || item.categoryId === category) &&
        (!collection || item.collectionIds.includes(collection)) &&
        (!line || item.lineIds.includes(line)) &&
        `${item.name} ${item.color}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === 'price-low'
        ? a.price - b.price
        : sort === 'price-high'
          ? b.price - a.price
          : b.createdAt.localeCompare(a.createdAt),
    );

  return (
    <section className="section shop-page page-enter">
      <div className="page-heading">
        <p className="eyebrow">THE VERIATION EDIT</p>
        <h1>{collectionName || 'Find your next piece.'}</h1>
        <p>Timeless essentials. A wardrobe of your own.</p>
      </div>
      <div className="shop-toolbar">
        <div className="category-tabs" aria-label="Product categories">
          {categories.map((item) => (
            <button
              key={item.id}
              aria-pressed={category === item.id}
              className={category === item.id ? 'selected' : ''}
              onClick={() => filter('category', item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <label className="sort-label">
          Sort by
          <select
            value={sort}
            onChange={(event) => filter('sort', event.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
      </div>
      <div className="catalog-controls">
        <div className="search-field">
          <Search size={17} />
          <input
            aria-label="Search catalog"
            value={query}
            onChange={(event) => filter('q', event.target.value)}
            placeholder="Search the collection"
          />
          {query && (
            <button
              className="icon-button"
              onClick={() => filter('q', '')}
              aria-label="Clear search"
            >
              <X size={17} />
            </button>
          )}
        </div>
        <span aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
        </span>
        {(collection || category || query || line) && (
          <button className="plain-button" onClick={() => setParams({})}>
            Clear filters <X size={13} />
          </button>
        )}
      </div>
      {filtered.length ? (
        <ProductGrid products={filtered} headingAs="h2" eager />
      ) : (
        <div className="empty-state">
          <h2>No pieces here just yet.</h2>
          <p>Try another search or explore the full collection.</p>
          <button className="button" onClick={() => setParams({})}>
            Explore all pieces
          </button>
        </div>
      )}
    </section>
  );
}

