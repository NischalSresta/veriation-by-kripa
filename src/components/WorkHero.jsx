import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { AnimatedHeading } from './Editorial';
import { clientLooks, heroWork } from '../data/landingLooks';

export function WorkPhoto({look, decorative=false, portraitFallback=false, cropOverride}) {
  const [failed,setFailed]=useState(false);
  const crop=cropOverride??look.crop;
  if(failed)return portraitFallback?null:<div className="work-image-error" role={decorative?undefined:'img'} aria-label={decorative?undefined:look.detail}>Photograph unavailable</div>;
  return <svg className="work-photo" viewBox={`${crop.x} ${crop.y} ${crop.width} ${crop.height}`} preserveAspectRatio={`${look.align} slice`} role={decorative?undefined:'img'} aria-label={decorative?undefined:`${look.name}: ${look.detail}. ${look.credit}.`} aria-hidden={decorative?true:undefined} focusable="false" style={{background:look.background}}>
    <image href={`/images/veriation/work/${look.image}.png`} x="0" y="0" width={look.width} height={look.height} onError={()=>setFailed(true)}/>
  </svg>;
}

export default function WorkHero() {
  const [hovered,setHovered]=useState(null);
  const [focused,setFocused]=useState(null);
  const [chosen,setChosen]=useState(null);
  const [portraitFailed,setPortraitFailed]=useState(false);
  const [coarse,setCoarse]=useState(false);
  const [small,setSmall]=useState(false);
  const [ready,setReady]=useState(false);
  const controls=useRef([]);
  const active=ready?(focused??hovered??chosen):null;
  const current=active===null?null:heroWork[active];

  useEffect(()=>{
    const root=document.documentElement;
    const sync=()=>setReady(root.classList.contains('hero-attached'));
    const observer=new MutationObserver(sync);observer.observe(root,{attributes:true,attributeFilter:['class']});sync();
    return()=>observer.disconnect();
  },[]);
  useEffect(()=>{if(!ready){setHovered(null);setFocused(null);setChosen(null);}},[ready]);
  useEffect(()=>{
    const pointer=window.matchMedia('(hover: none), (pointer: coarse)');
    const viewport=window.matchMedia('(max-width: 767px)');
    const update=()=>{setCoarse(pointer.matches);setSmall(viewport.matches);};
    update();pointer.addEventListener('change',update);viewport.addEventListener('change',update);
    return()=>{pointer.removeEventListener('change',update);viewport.removeEventListener('change',update);};
  },[]);

  const dismiss=()=>{setHovered(null);setFocused(null);setChosen(null);};
  const follow=event=>{
    if(!ready||event.pointerType!=='mouse'||coarse||focused!==null)return;
    if(event.target.closest('a,button'))return;
    const box=event.currentTarget.getBoundingClientRect();
    const next=Math.max(0,Math.min(2,Math.floor((event.clientX-box.left)/box.width*3)));
    setChosen(null);setHovered(next);
  };
  const leave=event=>{
    // Touch choices persist after the finger lifts; mouse previews never latch.
    if(event.pointerType==='mouse'){setHovered(null);setChosen(null);}
  };
  const keySelect=(event,index)=>{
    if(event.altKey||event.ctrlKey||event.metaKey)return;
    let next;
    if(event.key==='ArrowRight')next=(index+1)%3;
    if(event.key==='ArrowLeft')next=(index+2)%3;
    if(event.key==='Home')next=0;
    if(event.key==='End')next=2;
    if(next!==undefined){event.preventDefault();setChosen(null);setHovered(null);setFocused(next);controls.current[next]?.focus();}
  };

  return <section className="hero work-hero" aria-labelledby="hero-title" data-work-state={current?.id??'portrait'} onPointerMove={follow} onPointerLeave={leave} onPointerCancel={()=>setHovered(null)} onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();dismiss();}}}>
    <div className="hero-photo work-stage">
      <img className="work-portrait" src={portraitFailed?'/images/veriation/kripa-floral-original.png':'/images/veriation/kripa-garden-hero.svg'} width="1672" height="941" alt="Kripa in her original pink floral dress and yellow hair flower, with an AI-enhanced garden background" draggable="false" fetchPriority="high" onError={()=>setPortraitFailed(true)}/>
      <div className="work-zones">{heroWork.map((look,index)=><div className={`work-zone ${active===index?'is-active':''}`} id={`hero-work-${look.id}`} key={look.id} aria-hidden={active!==index}>
        <div className="work-zone-photo"><WorkPhoto look={look} portraitFallback cropOverride={small?look.mobileCrop:undefined}/></div>
      </div>)}</div>
      {!portraitFailed&&<span className="portrait-credit">Original portrait · AI-enhanced background</span>}
    </div>
    <div className="hero-caption">
      <div className="work-heading"><p className="eyebrow">VERIATION BY KRIPA</p><AnimatedHeading as="h1" id="hero-title">A world of her own.</AnimatedHeading><p>Her imagination. Worn your way.</p></div>
      <div className="work-controls">
        <p className="work-instruction"><span className="work-mouse-hint">Explore left · centre · right</span><span className="work-touch-hint">Tap a story. Tap again to return.</span></p>
        <div className="work-picker" role="group" aria-label="Explore three pieces by Kripa">{heroWork.map((look,index)=><button
          key={look.id} ref={node=>{controls.current[index]=node;}} type="button"
          aria-pressed={active===index} aria-controls={`hero-work-${look.id}`} aria-label={`Explore ${look.label}: ${look.detail}`}
          onPointerEnter={event=>{if(event.pointerType==='mouse'&&!coarse&&focused===null)setHovered(index);}}
          onPointerLeave={event=>{if(event.pointerType==='mouse')setHovered(null);}}
          onPointerDown={()=>setHovered(null)}
          onFocus={event=>{if(event.currentTarget.matches(':focus-visible')){setHovered(null);setChosen(null);setFocused(index);}}}
          onBlur={()=>setFocused(null)}
          onClick={event=>{const open=active===index;setHovered(null);if(event.detail===0){setChosen(null);setFocused(open?null:index);}else{setFocused(null);setChosen(open?null:index);}}}
          onKeyDown={event=>keySelect(event,index)}><span>{String(index+1).padStart(2,'0')}</span>{look.label}</button>)}</div>
        <div className="work-credit">
          <p>{current?.detail??'By Kripa. Made personal.'}</p>
          <a href={current?.source??'https://www.instagram.com/kripaaa___/'} target="_blank" rel="noreferrer">{current?.name??'Meet the designer'} <ArrowUpRight size={12}/></a>
        </div>
      </div>
      <div className="hero-links"><Link className="button" to="/shop">Shop the collection <ArrowUpRight size={18}/></Link><Link className="text-link" to="/bespoke">Discover bespoke <ArrowUpRight size={18}/></Link></div>
    </div>
  </section>;
}

export function ClientWorkShowcase(){
  return <section className="section client-work-showcase">
    <div className="section-heading"><AnimatedHeading>From her imagination. Into their world.</AnimatedHeading><Link className="text-link" to="/bespoke">Discover bespoke <ArrowUpRight size={18}/></Link></div>
    <div className="client-work-grid">{clientLooks.map(look=><article key={look.id}><div className="client-work-photo"><WorkPhoto look={look}/></div><h3>{look.title}</h3><p>{look.credit}</p><a className="source-link" href={look.source} target="_blank" rel="noreferrer">{look.name} <ArrowUpRight size={13}/></a></article>)}</div>
  </section>;
}
