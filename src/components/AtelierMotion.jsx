import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const studies = [
  {word:'Sketch', note:'A line becomes a possibility.', copy:'Explore the silhouettes, details and individual stories behind her bespoke pieces.', path:'/bespoke', action:'Explore bespoke'},
  {word:'Drape', note:'A feeling, shaped in fabric.', copy:'Discover flowing satin, considered tailoring and everyday pieces with a personal point of view.', path:'/shop', action:'Shop the collection'},
  {word:'Become', note:'Her imagination. Your story.', copy:'See how people wear her work and make each piece part of their own world.', path:'/worn-by', action:'See who wears it'},
];

// Decorative garment seams, drawn as original vector artwork rather than icons.
export function CoutureLine({className=''}) {
  return <svg className={`couture-line ${className}`} viewBox="0 0 520 650" aria-hidden="true" focusable="false" fill="none">
    <path className="seam seam-outline" pathLength="1" d="M184 67 C204 118 243 123 264 78 L300 56 L338 135 C319 208 300 248 310 290 C324 354 392 445 439 577 C339 625 219 634 86 582 C133 455 188 372 203 292 C216 223 181 167 160 131 Z"/>
    <path className="seam seam-drape" pathLength="1" d="M163 135 C216 153 256 147 331 141 M198 255 C235 281 270 277 309 254 M202 292 C235 330 271 337 314 305 M194 334 C235 393 290 412 338 356 M173 389 C216 469 310 516 374 437 M140 473 C208 560 309 591 414 527"/>
    <path className="seam seam-thread" pathLength="1" d="M184 67 C160 25 76 14 62 69 C36 172 460 10 464 188 C468 326 33 221 45 413 C48 468 82 518 110 540"/>
  </svg>;
}

export default function AtelierMotion() {
  const [active,setActive]=useState(0);
  const ref=useRef(null);
  const tabs=useRef([]);
  useEffect(()=>{
    const observer=new IntersectionObserver(([entry])=>ref.current?.classList.toggle('is-in-view',entry.isIntersecting),{threshold:.15});
    observer.observe(ref.current);
    return()=>observer.disconnect();
  },[]);
  const current=studies[active];
  return <section ref={ref} className={`atelier-study study-${active}`} aria-label="Explore Kripa’s creative world">
    <div className="atelier-heading"><p className="eyebrow">A STUDY IN POSSIBILITY</p><p className="atelier-instruction">Three ways into her world. <span>Choose a word.</span></p></div>
    <div className="atelier-layout">
      <div className="atelier-words" role="tablist" aria-label="A creative journey">{studies.map((study,index)=><button key={study.word} ref={node=>{tabs.current[index]=node;}} role="tab" id={`study-tab-${index}`} aria-controls="atelier-panel" aria-selected={active===index} tabIndex={active===index?0:-1} onClick={()=>setActive(index)} onKeyDown={event=>{let next;if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(index+1)%3;if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(index+2)%3;if(event.key==='Home')next=0;if(event.key==='End')next=2;if(next!==undefined){event.preventDefault();setActive(next);tabs.current[next]?.focus();}}}><span className="atelier-number">0{index+1}</span><span className="atelier-word">{study.word}<span className="atelier-stop">.</span></span><ArrowUpRight aria-hidden="true"/></button>)}</div>
      <div className="atelier-art"><CoutureLine/><span className="atelier-art-note">A visual study of form & flow</span></div>
    </div>
    <div className="atelier-panel" id="atelier-panel" role="tabpanel" aria-labelledby={`study-tab-${active}`} tabIndex={0}><div key={active} className="atelier-panel-copy"><h2>{current.note}</h2><p>{current.copy}</p><Link className="text-link" to={current.path}>{current.action} <ArrowUpRight size={17}/></Link></div></div>
  </section>;
}
