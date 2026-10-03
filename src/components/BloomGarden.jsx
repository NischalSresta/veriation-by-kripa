import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { AnimatedHeading } from './Editorial';

const flowers=['Petal','Silk','Muse'];
const bloomNotes=['Soft rose. A little romance.','Champagne light. A softer kind of statement.','Sage green. Room to grow.'];
export default function BloomGarden(){
  const ref=useRef(null);const [open,setOpen]=useState(null);
  useEffect(()=>{const node=ref.current;const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){node.classList.add('garden-visible');observer.disconnect();}},{threshold:.08});observer.observe(node);return()=>observer.disconnect();},[]);
  return <section className={`bloom-garden section bloom-tone-${open ?? 'rest'}`} ref={ref} aria-labelledby="bloom-heading">
    <div className="bloom-intro"><p className="eyebrow">THE ART OF BECOMING</p><AnimatedHeading id="bloom-heading">In full bloom.</AnimatedHeading><p>A line becomes a fold. A fold becomes a feeling.</p></div>
    <div className="bloom-canvas" role="group" aria-label="Interactive floral study">
      <svg className="garden-stems" viewBox="0 0 1000 380" preserveAspectRatio="none" aria-hidden="true"><path d="M120 380 Q160 285 225 175 M550 380 Q520 280 510 100 M870 380 Q780 270 775 185"/><path d="M166 293 Q90 265 98 225 Q166 233 166 293 M540 319 Q612 270 642 288 Q612 324 540 319 M826 308 Q900 280 900 242 Q824 270 826 308"/></svg>
      {flowers.map((name,index)=><button key={name} className={`garden-flower flower-${index} ${open===index?'flower-open':''}`} aria-label={`Bloom ${name} flower`} aria-pressed={open===index} onClick={()=>{ref.current.classList.add('garden-visible');setOpen(open===index?null:index);}} onKeyDown={event=>{if(event.key==='Escape')setOpen(null);}}>
        <svg viewBox="-150 -150 300 300" aria-hidden="true"><g className="flower-head">{Array.from({length:index===1?9:7},(_,petal)=><g key={petal} transform={`rotate(${petal*360/(index===1?9:7)})`}><path className="garden-petal" style={{'--petal-delay':`${petal*32}ms`}} d="M0 12 C-18-3 -64-35 -44-81 C-35-103 -9-124 0-132 C9-121 38-107 46-82 C63-37 18-3 0 12Z"/><path className="petal-vein" d="M0 5 Q-6-52 0-109"/></g>)}<circle r="12" className="flower-heart"/><circle r="5" className="flower-heart-inner"/></g></svg>
        <span>{name}</span>
      </button>)}
    </div>
    <div className="bloom-footer"><p aria-live="polite">{open===null?'Tap a flower. Find a new feeling.':bloomNotes[open]}</p><Link className="text-link" to="/bespoke">Imagine your own piece <ArrowUpRight size={17}/></Link></div>
  </section>;
}
