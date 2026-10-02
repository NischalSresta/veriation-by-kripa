import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Menu, Search, ShoppingBag } from 'lucide-react';
import { useBag } from '../context/BagContext';
import { Dialog } from './UI';
import { brand } from '../data/catalog';

const links = [
  ['Shop', '/shop'],
  ['Bespoke', '/bespoke'],
  ['Worn by', '/worn-by'],
  ['Meet Kripa', '/meet-kripa'],
];

export default function Header() {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState('');
  const { count } = useBag();
  const location = useLocation();
  const [overHero, setOverHero] = useState(location.pathname === '/');
  const navigate = useNavigate();
  useEffect(() => {
    const hero = document.querySelector('.hero');
    if (!hero) {
      setOverHero(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { rootMargin: '-90px 0px 0px 0px' },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [location.pathname]);
  useEffect(() => {
    setMenu(false);
    setSearch(false);
  }, [location]);

  return (
    <>
      <div className="announcement">
        <span>Veriation by Kripa</span>
        <span>DEMO STORE · ESTIMATED PRICES IN NPR</span>
        <a
          href="/shop"
          
          rel="noreferrer"
        >
          Shop the collection <ArrowUpRight size={12} />
        </a>
      </div>
      <header className={`header ${overHero ? 'over-hero' : ''}`}>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([name, path]) => (
            <Link
              key={name}
              to={path}
              aria-current={location.pathname + location.search + location.hash === path ? 'page' : undefined}
            >
              {name}
            </Link>
          ))}
        </nav>
        <button
          className="icon-button mobile-menu"
          aria-label="Open menu"
          onClick={() => setMenu(true)}
        >
          <Menu />
        </button>
        <Link className="brand-home" to="/" aria-label="Veriation home">By Kripa.</Link>
        <div className="header-actions">
          <button
            onClick={() => setSearch(true)}
            className="search-trigger"
            aria-label="Search products"
          >
            <Search size={19} />
            <span>Search</span>
          </button>
          <Link
            className="bag-link"
            to="/bag"
            aria-label={`Shopping bag, ${count} ${count === 1 ? 'item' : 'items'}`}
          >
            <ShoppingBag size={19} />
            <span>Bag</span>
            <span className="bag-count">({count})</span>
          </Link>
        </div>
      </header>
      <Dialog
        open={menu}
        onDismiss={() => setMenu(false)}
        title="Explore Veriation"
      >
        <nav className="menu-links" aria-label="Mobile navigation">
          {[
            ...links,
            ['Tops', '/shop?category=tops'],
            ['Tailoring', '/shop?category=tailoring'],
            ['Sets', '/shop?category=sets'],
            ['Skirts', '/shop?category=skirts'],
          ].map(([name, path]) => (
            <Link key={name} to={path} onClick={() => setMenu(false)}>
              {name}
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </nav>
        <p className="muted">{brand.tagline}</p>
      </Dialog>
      <Dialog
        open={search}
        onDismiss={() => setSearch(false)}
        title="Find your next piece"
      >
        <form
          className="search-form"
          onSubmit={(event) => {
            event.preventDefault();
            navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
            setSearch(false);
          }}
        >
          <label htmlFor="header-search">Search products</label>
          <div className="search-field">
            <Search size={18} />
            <input
              id="header-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try June or Japandi"
              autoFocus
            />
          </div>
          <button className="button" type="submit">
            Search <ArrowUpRight size={17} />
          </button>
        </form>
      </Dialog>
    </>
  );
}


