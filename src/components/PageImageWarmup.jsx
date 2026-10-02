import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Download ahead of the scroll reveal, with only two background requests at once.
export default function PageImageWarmup() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    let cancelled=false, started=false, running=0, idle=null, fallback=null;
    const queue=[], seen=new Set(), disposers=new Set();
    const main=document.getElementById('main');
    if(!main)return;
    const finishImage=(image, done)=>{
      let finished=false;
      const finish=()=>{if(finished)return;finished=true;image.removeEventListener('load',finish);image.removeEventListener('error',finish);clearTimeout(timeout);disposers.delete(cleanup);if(image.naturalWidth&&image.decode)image.decode().catch(()=>{}).then(done);else done();};
      const cleanup=()=>{image.removeEventListener('load',finish);image.removeEventListener('error',finish);clearTimeout(timeout);};
      const timeout=setTimeout(finish,12000);
      image.addEventListener('load',finish);image.addEventListener('error',finish);disposers.add(cleanup);
      return finish;
    };
    const pump=()=>{
      if(cancelled||!started)return;
      while(running<2&&queue.length){
        const task=queue.shift();running++;
        const image=task.node||new window.Image();
        const finish=finishImage(image,()=>{running--;pump();});
        image.fetchPriority='low';image.decoding='async';
        if(task.node){image.loading='eager';if(image.complete)finish();}
        else {image.src=task.src;if(image.complete)finish();}
      }
    };
    const add=(src,node)=>{if(!src||seen.has(src))return;seen.add(src);queue.push({src,node});};
    const scan=()=>{
      main.querySelectorAll('img').forEach(image=>{if(!image.complete)add(image.currentSrc||image.src,image);});
      main.querySelectorAll('[data-preload-src]').forEach(image=>add(image.dataset.preloadSrc));
      main.querySelectorAll('[data-preload-images]').forEach(element=>element.dataset.preloadImages.split('|').forEach(src=>add(src)));
      pump();
    };
    const start=()=>{if(cancelled||started)return;started=true;clearTimeout(fallback);scan();};
    // Let opening photographs win before starting the lower-priority queue.
    const opening=[...main.querySelectorAll('img')].filter(image=>{const box=image.getBoundingClientRect();return !image.complete&&box.top<innerHeight&&box.bottom>0;});
    let waiting=opening.length;
    opening.forEach(image=>finishImage(image,()=>{if(--waiting===0)start();}));
    fallback=setTimeout(start,2000);
    if(!waiting){if('requestIdleCallback' in window)idle=window.requestIdleCallback(start,{timeout:500});else idle=setTimeout(start,100);}
    const observer=new MutationObserver(scan);
    observer.observe(main,{childList:true,subtree:true,attributes:true,attributeFilter:['src','srcset','data-preload-src','data-preload-images']});
    return()=>{cancelled=true;observer.disconnect();clearTimeout(fallback);if('cancelIdleCallback' in window)window.cancelIdleCallback(idle);else clearTimeout(idle);disposers.forEach(dispose=>dispose());};
  },[pathname,search]);
  return null;
}
