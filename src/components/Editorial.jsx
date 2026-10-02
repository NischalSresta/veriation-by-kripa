import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, Maximize2 } from 'lucide-react';
import { brand, imagePath } from '../data/catalog';
import { appreciation, features, personalInstagram, projects, studioFilmSource } from '../data/editorial';
import { Dialog, Image, Reveal } from './UI';

export function AnimatedHeading({children,as:Tag='h2',className='',...props}){
 const ref=useRef(null);
 useEffect(()=>{const node=ref.current;const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(media.matches)return;node.classList.add('words-ready');
  const observer=new IntersectionObserver(([e])=>{if(e.isIntersecting){node.classList.add('words-visible');observer.disconnect();}},{threshold:.12});observer.observe(node);
  const change=()=>{if(media.matches)node.classList.remove('words-ready');};media.addEventListener('change',change);
  return()=>{observer.disconnect();media.removeEventListener('change',change);};
 },[]);
 const text=String(children);
 return <Tag ref={ref} className={`animated-heading ${className}`} aria-label={text} {...props}>{text.split(' ').map((word,i)=><span className="word-mask" aria-hidden="true" key={i}><span style={{'--word-delay':`${i*70}ms`}}>{word}</span>{' '}</span>)}</Tag>;
}
export function EditorialPhoto({name,alt,className=''}){
 return <Image className={className} src={imagePath(name,800)} srcSet={`${imagePath(name,400)} 400w, ${imagePath(name,800)} 800w, ${imagePath(name,1600)} 1600w`} sizes="(max-width:767px) 100vw, 50vw" width="800" height="1000" loading="lazy" alt={alt}/>;
}
export function WornStories({compact=false}){
 const items=compact?features.slice(0,4):features;const [active,setActive]=useState(0);const current=items[active];const start=useRef(null);const uid=useId();
 const change=(n)=>setActive((n+items.length)%items.length);
 return <section className="worn-section section" id="worn-by">
  <div className="section-heading"><div><p className="eyebrow">THE PIECES, THE PEOPLE</p><AnimatedHeading as={compact?'h2':'h1'}>Worn by. Made personal.</AnimatedHeading></div>{compact&&<Link className="text-link" to="/worn-by">All the stories <ArrowUpRight size={18}/></Link>}</div>
  <div className="worn-layout" data-preload-images={items.map(item=>imagePath(item.image,800)).join("|")}>
   <div className="worn-photo" onPointerDown={e=>{if(e.pointerType==='touch')start.current=e.clientX;}} onPointerUp={e=>{if(start.current!==null){const distance=e.clientX-start.current;if(Math.abs(distance)>45)change(active+(distance<0?1:-1));start.current=null;}}}>
    <EditorialPhoto key={current.image} name={current.image} alt={`${current.name} wearing work credited to Kripa`}/><span className="worn-photo-caption">A piece of her story.</span>
   </div>
   <div className="worn-copy">
    <div className="story-tabs" role="tablist" aria-label="Choose a wearer">{items.map((item,i)=><button key={item.id} role="tab" id={`${uid}-tab-${i}`} aria-controls={`${uid}-panel`} aria-selected={active===i} tabIndex={active===i?0:-1} onClick={()=>change(i)} onKeyDown={e=>{let next;if(e.key==='ArrowRight')next=(i+1)%items.length;if(e.key==='ArrowLeft')next=(i-1+items.length)%items.length;if(e.key==='Home')next=0;if(e.key==='End')next=items.length-1;if(next!==undefined){e.preventDefault();change(next);document.getElementById(`${uid}-tab-${next}`)?.focus();}}}>{item.name}</button>)}</div>
    <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${active}`} tabIndex={0} className="story-panel" key={current.id}>
     <p className="eyebrow">WORN BY {current.name}</p><h3>{current.context}</h3><p>{current.credit}</p>
     <Link className="button" to={current.productId?`/product/${current.productId}`:`/bespoke#${current.projectId}`}>{current.productId?'Shop this piece':'Discover the piece'} <ArrowUpRight size={18}/></Link>
     <a className="source-link" href={current.source} target="_blank" rel="noreferrer">View the original post <ArrowUpRight size={13}/></a>
    </div>
    <div className="story-controls"><span>{String(active+1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</span><div><button className="icon-button" aria-label="Previous wearer" onClick={()=>change(active-1)}><ChevronLeft/></button><button className="icon-button" aria-label="Next wearer" onClick={()=>change(active+1)}><ChevronRight/></button></div></div>
   </div>
  </div>
 </section>;
}
export function ProjectGallery({items=projects,compact=false}){
 const [selected,setSelected]=useState(null);const [photo,setPhoto]=useState(0);
 const images=selected?.images||[];
 const move=n=>setPhoto((n+images.length)%images.length);
 return <><div className={`bespoke-grid ${compact?'compact':''}`} data-preload-images={items.flatMap(item=>item.images.map(name=>imagePath(name,1600))).join("|")}>{items.map(item=><Reveal as="article" className="bespoke-project" key={item.id} id={item.id}>
  <button className="project-photo" onClick={()=>{setSelected(item);setPhoto(0);}} aria-label={`View ${item.occasion} gallery`}><EditorialPhoto name={item.images[0]} alt={`${item.person} — ${item.occasion}`}/><span className="project-zoom"><Maximize2 size={17}/></span></button>
  <div className="project-caption"><span className="eyebrow">{item.occasion}</span><h3>{item.name}</h3><p>{item.person}</p>{!compact&&<><p className="project-description">{item.description}</p><a className="source-link" href={item.source} target="_blank" rel="noreferrer">Original story <ArrowUpRight size={13}/></a></>}</div>
 </Reveal>)}</div>
 <Dialog open={!!selected} onDismiss={()=>setSelected(null)} title={selected?.occasion||'Project gallery'}>{selected&&<div className="project-lightbox" onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();move(photo+1);}if(e.key==='ArrowLeft'){e.preventDefault();move(photo-1);}}}>
  <Image src={imagePath(images[photo],1600)} alt={`${selected.person} — ${selected.occasion}, photograph ${photo+1}`} width="1000" height="1250"/>
  <div className="lightbox-controls"><button className="icon-button" aria-label="Previous project photograph" disabled={images.length<2} onClick={()=>move(photo-1)}><ChevronLeft/></button><span aria-live="polite">{photo+1} / {images.length}</span><button className="icon-button" aria-label="Next project photograph" disabled={images.length<2} onClick={()=>move(photo+1)}><ChevronRight/></button></div>
  <p>{selected.description}</p><a className="text-link" href={brand.bespoke} target="_blank" rel="noreferrer">Discuss your bespoke piece <ArrowUpRight size={17}/></a>
 </div>}</Dialog></>;
}
export function BespokePreview(){const preview=[projects[2],{...projects[3],images:['luni-beach','luni-vietnam']},projects[5]];return <section className="bespoke-preview section"><div className="section-heading"><div><p className="eyebrow">DESIGNED BY KRIPA</p><AnimatedHeading>Made for your moment.</AnimatedHeading></div><Link className="text-link" to="/bespoke">Explore bespoke <ArrowUpRight size={18}/></Link></div><ProjectGallery items={preview} compact/><div className="bespoke-preview-note"><p>Some pieces are chosen.<br/><em>Others are imagined, just for you.</em></p><a className="text-link" href={brand.bespoke} target="_blank" rel="noreferrer">Begin a conversation <ArrowUpRight size={18}/></a></div></section>;}
export function FounderStory({full=false}){
 const [playing,setPlaying]=useState(false);
 const [filmFailed,setFilmFailed]=useState(false);
 const filmButton=useRef(null);const restoreFilmFocus=useRef(false);
 useEffect(()=>{if(!playing&&restoreFilmFocus.current){filmButton.current?.focus();restoreFilmFocus.current=false;}},[playing]);
 return <section className={`founder-section section ${full?'full':''}`} id="meet-kripa">
  <div className="founder-portrait"><EditorialPhoto name="kripa-portrait" alt="Kripa wearing a dark draped outfit in a sunlit courtyard"/><span className="founder-signature">By Kripa.</span></div>
  <div className="founder-copy"><p className="eyebrow">THE PERSON BEHIND THE PIECES</p><AnimatedHeading as={full?'h1':'h2'}>A little art. A world of her own.</AnimatedHeading><p>From sketching in notebooks as a design student to running her own studio, Kripa has built a practice around dressing people in pieces that feel personal.</p><p>Veriation is her ready-to-wear world. Designed by Kripa is where individual stories become bespoke pieces, handcrafted in Nepal.</p>
   <div className="founder-links"><Link className="text-link" to="/shop">Explore her collection <ArrowUpRight size={17}/></Link>{!full&&<Link className="text-link" to="/meet-kripa">Meet Kripa <ArrowUpRight size={17}/></Link>}</div>
   <div className="studio-film">{playing?<div className="film-player">{filmFailed?<p role="status">This browser cannot play the film. Watch the original studio story below.</p>:<video src="/videos/kripa-studio.mp4" controls autoPlay muted playsInline preload="none" aria-label="Kripa’s original studio film" onError={()=>setFilmFailed(true)}/>}<a className="source-link" href={studioFilmSource} target="_blank" rel="noreferrer">The original studio story <ArrowUpRight size={13}/></a><button className="source-link" onClick={()=>{restoreFilmFocus.current=true;setPlaying(false);}}>Close film</button></div>:<button ref={filmButton} className="film-poster" onClick={()=>{setFilmFailed(false);setPlaying(true);}} aria-label="Play Kripa’s studio story"><EditorialPhoto name="kripa-day" alt="Kripa in a floral dress"/><span><Play size={20}/><span>Inside her world<small>A studio story by Kripa</small></span></span></button>}</div>
   {full&&<div className="founder-social"><a className="source-link" href={personalInstagram} target="_blank" rel="noreferrer">Kripa’s personal journal <ArrowUpRight size={13}/></a><a className="source-link" href={brand.bespoke} target="_blank" rel="noreferrer">Designed by Kripa <ArrowUpRight size={13}/></a><a className="source-link" href={studioFilmSource} target="_blank" rel="noreferrer">Original studio film <ArrowUpRight size={13}/></a></div>}
  </div>
 </section>;
}
export function Appreciation(){return <section className="appreciation-section section"><p className="eyebrow">IN THEIR OWN WORDS</p><AnimatedHeading>More than something to wear.</AnimatedHeading><div className="appreciation-grid">{appreciation.map(item=><Reveal as="figure" key={item.name}><EditorialPhoto name={item.image} alt={`The piece shared by ${item.name}`}/><blockquote>“{item.quote}”</blockquote><figcaption><strong>{item.name}</strong><span>{item.context}</span><a className="source-link" href={item.source} target="_blank" rel="noreferrer">Read the original <ArrowUpRight size={13}/></a></figcaption></Reveal>)}</div></section>;}
