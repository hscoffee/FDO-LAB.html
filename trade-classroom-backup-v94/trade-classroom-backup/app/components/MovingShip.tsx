'use client';
import {memo,useEffect,useRef,useState} from 'react';
import {countries,shipCapacity,aircraftCapacity} from '../../lib/content';
import {seaRoute,flightRoute,routePoint,voyageState,voyageLegRemaining} from '../../lib/routes';
import {ShipArt} from './GrowthMap';
import GoodArt from './GoodArt';
import PlaneArt from './PlaneArt';
function MovingShip({v,from,to,serverNow,paused=false,pauseAt=0,endedAt=0,loop=false,speed=1,onSelect}:{v:any;from:number;to:number;serverNow:number;paused?:boolean;pauseAt?:number;endedAt?:number;loop?:boolean;speed?:number;onSelect?:()=>void}){
 const root=useRef<HTMLDivElement>(null),status=useRef<HTMLSpanElement>(null),origin=useRef({server:serverNow,local:0}),[cargo,Cargo]=useState({returning:false,trip:0});
 useEffect(()=>{const t=performance.now();if(!origin.current.local||Math.abs(serverNow-(origin.current.server+(t-origin.current.local)*speed))>1500)origin.current={server:serverNow,local:t};},[serverNow,speed]);
 useEffect(()=>{
  let frame=0,lastCargo='';
  const route=v.transport==='air'?flightRoute:seaRoute;
  const outward=route(from,to,false),homeward=route(from,to,true);
  const animate=(t:number)=>{
   let clock=endedAt||(paused?pauseAt:origin.current.server+(t-origin.current.local)*speed);
   if(loop)clock=v.departedAt+Math.max(0,clock-v.departedAt)%(v.arrivesAt-v.departedAt);
   const a=voyageState(v,clock),r=a.returning?homeward:outward,p=routePoint(r,a.leg);
   const before=routePoint(r,Math.max(0,a.leg-.003)),ahead=routePoint(r,Math.min(1,a.leg+.003));
   if(root.current){
    root.current.style.left=p.x+'%';root.current.style.top=p.y+'%';
    root.current.classList.toggle('heading-left',ahead.rawX<before.rawX);
    root.current.style.setProperty('--flight-angle',Math.atan2(ahead.y-before.y,(ahead.rawX-before.rawX)*1.5)*180/Math.PI+'deg');
    root.current.dataset.journey=a.returning?'returning':'outbound';
    const remaining=voyageLegRemaining(v,clock);if(status.current)status.current.textContent=`${a.returning?'귀항':'출항'} (${remaining}초)`;
   }
   const k=a.returning+'-'+a.trip;if(k!==lastCargo){lastCargo=k;Cargo({returning:a.returning,trip:a.trip});}
   frame=requestAnimationFrame(animate);
  };
  animate(performance.now());
  return()=>cancelAnimationFrame(frame);
 },[v.departedAt,v.arrivesAt,v.trips,v.transport,from,to,paused,pauseAt,endedAt,loop,speed]);
 const capacity=v.capacity??(v.transport==='air'?aircraftCapacity:shipCapacity[v.shipLevel-1]);const count=Math.min(capacity,Math.max(0,(cargo.returning?v.wantQty:v.qty)-cargo.trip*capacity));
 return <div ref={root} className={"travelling-ship smooth-vessel "+(v.transport==='air'?'air-freight':'')} data-transport={v.transport||'ship'} onClick={onSelect} role={onSelect?"button":undefined} tabIndex={onSelect?0:undefined} onKeyDown={e=>{if(onSelect&&(e.key==="Enter"||e.key===" "))onSelect();}}><span className="vessel-hull">{v.transport==='air'?<PlaneArt/>:<ShipArt level={v.shipLevel}/>}</span><span className="vessel-caption"><span className="vessel-load" aria-label={`${countries[from].name} · ${cargo.returning?'귀환':v.transport==='air'?'비행':'출항'} · 운송 물자 ${count}개`}><span className="nation-flag" role="img" aria-label={countries[from].name+' 국기'} style={{backgroundPosition:`${from%3*50}% ${Math.floor(from/3)*100}%`}}/><GoodArt item={cargo.returning?v.want:v.give}/><b>{count}</b></span><span ref={status} className="vessel-status">{`출항 (${Math.ceil((v.arrivesAt-v.departedAt)/(2*(v.trips||1))/1000)}초)`}</span></span></div>;
}
export default memo(MovingShip);
