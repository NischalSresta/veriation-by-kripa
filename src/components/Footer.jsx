import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { brand } from '../data/catalog';
export default function Footer() {
 return <footer className="footer"><div className="footer-main">
  <div className="footer-brand"><Link className="footer-brand-name" to="/" aria-label="Veriation home">Veriation by Kripa</Link><p>By Kripa. Made personal.</p><p className="muted">Ready-to-wear favourites and bespoke possibilities, brought together in one creative world.</p></div>
  <div><h2>Shop</h2><Link to="/shop">All pieces</Link><Link to="/shop?category=tops">Tops</Link><Link to="/shop?category=sets">Sets</Link><Link to="/shop?category=tailoring">Tailoring</Link><Link to="/shop?category=skirts">Skirts</Link></div>
  <div><h2>Her world</h2><Link to="/bespoke">Bespoke</Link><Link to="/worn-by">Worn by</Link><Link to="/meet-kripa">Meet Kripa</Link><Link to="/bag">Your bag</Link></div>
  <div><h2>Stay connected</h2><p>A personal point of view.</p><div className="social-links"><a href={brand.instagram} target="_blank" rel="noreferrer">Veriation <ArrowUpRight size={12}/></a><a href={brand.bespoke} target="_blank" rel="noreferrer">Designed by Kripa <ArrowUpRight size={12}/></a><a href="https://www.instagram.com/kripaaa___/" target="_blank" rel="noreferrer">Kripa’s journal <ArrowUpRight size={12}/></a></div></div>
 </div><div className="footer-bottom"><span>© {new Date().getFullYear()} Veriation</span><span>Demo store. Estimated prices. Campaign imagery recreated with AI.</span><a href="#top">Back to top ↑</a></div></footer>;
}
