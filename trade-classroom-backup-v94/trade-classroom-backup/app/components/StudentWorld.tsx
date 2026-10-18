'use client';
import {processedItem,competitionScore} from '../../lib/technology';
import {activeGroups,activeItems} from '../../lib/content';
import {useState} from 'react';
import {ChevronLeft,ChevronRight,Ship,Plane} from 'lucide-react';
import GoodArt from './GoodArt';
import useWorldClock from './useWorldClock';
import {voyageState} from '../../lib/routes';
import {countries,goods,shipCapacity,aircraftCapacity} from '../../lib/content';
import styles from './StudentWorld.module.css';
export default function StudentWorld({s,now}:{s:any;now:number}){
 const own=s.players.find((p:any)=>p.id===s.me)?.group??-1;
 const [tier,Tier]=useState(1),[selected,Select]=useState(''),clock=useWorldClock(s,now);
 const allVoyages=s.shipments||[],voyages=allVoyages.filter((v:any)=>v.group===own||v.to===own),focus=voyages.find((v:any)=>v.id===selected)||voyages[0],index=focus?voyages.indexOf(focus):0;
 const state=focus?voyageState(focus,clock):null,left=focus?Math.max(0,Math.ceil((focus.arrivesAt-clock)/1000)):0;
 const cargo=focus?(state?.returning?focus.want:focus.give):0,capacity=focus?(focus.capacity??(focus.transport==='air'?aircraftCapacity:shipCapacity[focus.shipLevel-1])):0;
 const count=focus?Math.min(capacity,Math.max(0,(state?.returning?focus.wantQty:focus.qty)-(state?.trip||0)*capacity)):0;
 return <div className={styles.container} aria-label="전체 국가 자원과 무역 현황">
  <header className={styles.header}><h2>{activeGroups(s).length}개 나라의 현황</h2><span>{s.paused?'일시정지 · ':''}우리나라 운송 {voyages.length}건</span></header>
  {s.mode==='competition'&&<nav className={styles.tiers} aria-label="현황 물자 단계">{[[1,'원자재'],[2,'가공품'],[3,'상위 가공품']].map(([n,label])=><button key={n} aria-pressed={tier===n} onClick={()=>Tier(Number(n))}>{label}</button>)}</nav>}
  <div className={styles.nations} style={{'--portrait-rows':activeGroups(s).length,'--nation-columns':Math.min(2,activeGroups(s).length),'--nation-rows':Math.ceil(activeGroups(s).length/2),'--wide-columns':Math.min(3,activeGroups(s).length),'--wide-rows':Math.ceil(activeGroups(s).length/3)} as React.CSSProperties}>{activeGroups(s).map((g:number)=>{const ci=s.assignment[g];const shipments=allVoyages.filter((v:any)=>v.group===g||v.to===g),offers=s.offers.filter((v:any)=>v.group===g||v.to===g);return <article key={g} className={styles.nation} data-own={g===own}>
   <div className={styles.name}><span className="nation-flag" style={{backgroundPosition:`${ci%3*50}% ${Math.floor(ci/3)*100}%`}}/><h3>{countries[ci].name}</h3>{g===own&&<small>우리</small>}</div>
   <div className={styles.resources}>{(s.mode==='competition'&&tier>1?activeGroups(s).map(g=>processedItem(s.assignment[g],tier)):activeItems(s)).map(item=>[goods[item],item] as const).map(([name,item])=><span key={name} title={name}><GoodArt item={item}/><small>{name}</small><strong>{s.stock[g][item]}</strong></span>)}</div>
   <footer><span>배 {s.growth[g].fleet??1}척{s.mode==='competition'&&` · 비행기 ${s.growth[g].aircraft||0}대`} · 운송 {shipments.length}건</span><span>제안 {s.tradeStatus?.[g]?.pending??offers.length}건</span>{s.mode==='competition'?<b>종합 {competitionScore(s,g).total}점</b>:s.landmarks?.includes(g)&&<b>랜드마크 완성</b>}</footer>
  </article>;})}</div>
  <section className={styles.voyage} aria-label="무역 운송 상황">{focus&&state?<>
   <div className={styles.voyageHeading}>{focus.transport==='air'?<Plane size={20}/>:<Ship size={20}/>}<b>{countries[s.assignment[focus.group]].name} ↔ {countries[s.assignment[focus.to]].name}</b><strong>{left}초</strong></div>
   <div className={styles.exchange}><span><GoodArt item={focus.give}/>{goods[focus.give]} {focus.qty}</span><span>교환</span><span><GoodArt item={focus.want}/>{goods[focus.want]} {focus.wantQty}</span></div>
   <div className={styles.progress} role="progressbar" aria-label="운송 진행률" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(state.progress*100)}><span style={{width:state.progress*100+'%'}}/></div>
   <div className={styles.bottom}><span>{state.returning?'귀환':focus.transport==='air'?'비행':'출항'} · {goods[cargo]} {count}개 적재 · {state.trip+1}/{state.trips}회</span><div><button disabled={!voyages.length} onClick={()=>Select(voyages[(index-1+voyages.length)%voyages.length].id)} aria-label="이전 운송"><ChevronLeft size={18}/></button><span>{index+1}/{voyages.length}</span><button disabled={!voyages.length} onClick={()=>Select(voyages[(index+1)%voyages.length].id)} aria-label="다음 운송"><ChevronRight size={18}/></button></div></div>
  </>:<div className={styles.empty}><Ship size={24}/><b>{s.mode==='competition'?'현재 이동 중인 운송 수단이 없어요':'현재 이동 중인 무역선이 없어요'}</b><span>무역이 성사되면 교환 물자와 남은 시간이 여기에 표시돼요.</span></div>}</section>
 </div>;
}
