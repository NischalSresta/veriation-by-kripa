import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home, { heroSizes } from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Bag from './pages/Bag';
import NotFound from './pages/NotFound';
import PageMotion from './components/PageMotion';
import { Bespoke, MeetKripa, WornBy } from './pages/Studio';

export default function App() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const frame = requestAnimationFrame(() => {
        const target = document.getElementById(hash.slice(1));
        if (!target) return;
        const reduced = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches;
        const hero = document.querySelector('.hero');
        // Account for the campaign contracting during the smooth scroll.
        const contraction =
          hero && !reduced
            ? Math.max(
                0,
                hero.getBoundingClientRect().height - heroSizes().collapsed,
              )
            : 0;
        window.scrollTo({
          top:
            target.getBoundingClientRect().top +
            window.scrollY -
            contraction -
            (window.innerWidth < 768 ? 64 : 76),
          behavior: reduced ? 'instant' : 'smooth',
        });
      });
      return () => cancelAnimationFrame(frame);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  useEffect(() => {
    document.title = `${pathname === '/' ? 'A World of Her Own' : pathname === '/shop' ? 'Shop' : pathname === '/bag' ? 'Your Bag' : pathname === '/bespoke' ? 'Bespoke' : pathname === '/worn-by' ? 'Worn By' : pathname === '/meet-kripa' ? 'Meet Kripa' : 'The Collection'} | Veriation by Kripa`;
  }, [pathname]);

  return (
    <PageMotion>
      <div id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/bag" element={<Bag />} />
            <Route path="/bespoke" element={<Bespoke />} />
            <Route path="/worn-by" element={<WornBy />} />
            <Route path="/meet-kripa" element={<MeetKripa />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </PageMotion>
  );
}

