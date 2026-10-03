import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { categories, collections, imagePath, products } from '../data/catalog';
import ProductGrid from '../components/ProductGrid';
import { Image, Reveal } from '../components/UI';
import { AnimatedHeading, Appreciation, BespokePreview, FounderStory, WornStories } from '../components/Editorial';
import WorkHero, { ClientWorkShowcase } from '../components/WorkHero';
import AtelierMotion from '../components/AtelierMotion';
import BloomGarden from '../components/BloomGarden';

// Shared by the scroll morph and anchor navigation, so both land consistently.
export function heroSizes() {
  const mobile = window.innerWidth < 768;
  const expanded = Math.max(
    window.innerHeight,
    mobile ? 520 : 540,
  );
  return {
    expanded,
    collapsed: expanded - Math.min(40, window.innerHeight * 0.03),
    travel: Math.max(320, Math.min(620, window.innerHeight * 0.65)),
  };
}

export default function Home() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('home-motion');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, displayed = null, lastTime = 0;
    function update(time=performance.now()) {
      frame = 0;
      const mobile = window.innerWidth < 768;
      const { expanded, travel } = heroSizes();
      const target = motion.matches
        ? 1
        : Math.min(1, Math.max(0, window.scrollY / travel));
      if(displayed===null||motion.matches)displayed=target;
      const delta=Math.min(64,Math.max(1,time-lastTime||16));lastTime=time;
      displayed+=(target-displayed)*(1-Math.exp(-delta/65));
      if(Math.abs(target-displayed)<0.0005)displayed=target;
      const progress=displayed*displayed*(3-2*displayed);
      const logoStart = Math.max(205, Math.min(460, window.innerWidth * 0.35));
      const logoEnd = parseFloat(getComputedStyle(root).getPropertyValue('--header-logo-width'));
      root.style.setProperty(
        '--hero-height',
        `${expanded}px`,
      );
      root.style.setProperty('--hero-travel',`${motion.matches?0:travel+200}px`);
      root.style.setProperty('--hero-progress', progress);
      root.style.setProperty(
        '--hero-logo-y',
        `${window.innerHeight * (mobile ? 0.45 : 0.43) + ((mobile ? 32 : 38) - window.innerHeight * (mobile ? 0.45 : 0.43)) * progress}px`,
      );
      root.style.setProperty(
        '--hero-logo-width',
        `${logoStart + (logoEnd - logoStart) * progress}px`,
      );
      root.style.setProperty('--hero-nav-opacity', Math.min(1, progress * 4));
      root.style.setProperty('--hero-logo-scale', (logoStart + (logoEnd-logoStart)*progress)/logoEnd);
      root.classList.toggle('hero-opening', progress < 0.04);
      root.classList.toggle('hero-attached',progress>=0.94);
      if(displayed!==target)frame=requestAnimationFrame(update);
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    motion.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      motion.removeEventListener('change', schedule);
      root.classList.remove('hero-opening');
      root.classList.remove('hero-attached');
      root.classList.remove('home-motion');
      [
        '--hero-height',
        '--hero-progress',
        '--hero-logo-y',
        '--hero-logo-width',
        '--hero-nav-opacity',
        '--hero-logo-scale',
        '--hero-travel',
      ].forEach((name) => root.style.removeProperty(name));
    };
  }, []);
  return (
    <div className="home-editorial">
      <div className="hero-scroll-scene"><WorkHero/></div>

      <Reveal as="section" className="section" id="new-arrivals">
        <div className="section-heading">
          <div><p className="eyebrow">THE EVERYDAY EDIT</p><AnimatedHeading>Wear it your way.</AnimatedHeading><p>Original studio favourites, ready for your wardrobe.</p></div>
          <Link className="text-link" to="/shop?collection=everyday-edit">View the edit <ArrowUpRight size={19} /></Link>
        </div>
        <ProductGrid showControls products={['duo-charm-top-white','lumi-top-brown','nora-jacket','japandi-top-pink'].map(slug=>products.find(p=>p.slug===slug)).filter(Boolean)} />
      </Reveal>

      <AtelierMotion/>
      <ClientWorkShowcase/>
      <WornStories compact />
      <BloomGarden/>
      <BespokePreview />
      <FounderStory />
      <Appreciation />

      <Reveal as="section" className="section category-section">
        <div className="section-heading"><AnimatedHeading>Find your everyday.</AnimatedHeading></div>
        <div className="zefo-category-grid">
          {categories.filter(c=>c.id).map(c=>(
            <Link key={c.id} to={`/shop?category=${c.id}`} className="zefo-category">
              <Image src={imagePath(c.image,560)} alt={`Veriation ${c.name}`} width="560" height="700" loading="lazy" />
              <div><h3>{c.name}</h3><ArrowUpRight size={20} /></div>
            </Link>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="section collections-section" id="collections">
        <div className="section-heading"><AnimatedHeading>A different kind of everyday.</AnimatedHeading></div>
        <div className="collection-grid">
          {collections.map(c=>(
            <Link key={c.id} to={`/shop?collection=${c.id}`} className="collection-tile">
              <div className="collection-photo"><Image src={imagePath(c.image,1600)} srcSet={`${imagePath(c.image,800)} 800w, ${imagePath(c.image,1600)} 1600w`} sizes="(max-width: 767px) 100vw, 55vw" alt={c.name} loading="lazy" width="1600" height="1000" /></div>
              <div className="collection-caption"><div><h3>{c.name}</h3><p>{c.description}</p></div><ArrowUpRight size={24} /></div>
            </Link>
          ))}
        </div>
      </Reveal>

    </div>
  );
}

