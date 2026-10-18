'use client';
import {shipLimit} from '../../lib/technology';
import {ShipArt} from './GrowthMap';
import GoodArt from './GoodArt';
import {goods,specialty,fleetCosts,shipNames} from '../../lib/content';
import styles from './FleetPurchase.module.css';
export default function FleetPurchase({s,group,busy,act}:{s:any;group:number;busy:boolean;act:(action:string,args:any,notice?:string)=>Promise<any>}){
 const limit=s.mode==='competition'?shipLimit(s.technology?.[group]):3,costs=[5,10,20,25,30].slice(0,limit);const gr=s.growth[group],shipLevel=Math.max(1,Math.min(3,Number(gr.ship)||1)),count=gr.fleet??0,item=specialty[s.assignment[group]],free=s.availableStock?.[group]?.[item]??s.stock[group][item];
 return <div className={styles.root} data-competition={s.mode==='competition'} data-ship-level={shipLevel}><header><h2>우리나라 무역선 {count} / {limit}척</h2><p>현재 Lv.{shipLevel} · {shipNames[shipLevel-1]} · 구입하는 배에도 같은 성능이 적용돼요.</p></header><div className={styles.stages}>{costs.map((cost,i)=><article key={i} data-current={i===count} data-owned={i<count}><div className={styles.ships}>{Array.from({length:s.mode==='competition'?1:i+1},(_,k)=><ShipArt key={k} level={shipLevel}/>)}</div><div><h3>{i+1}척 보유</h3><b>동시 무역 {i+1}건</b><span><GoodArt item={item}/>{goods[item]} {cost}개 지출</span><small>{i<count?'구입 완료':i===count?'다음 구입':'앞으로 구입'}</small></div></article>)}</div><p className={styles.stock}>사용 가능 {goods[item]} {free}개 · 구입에 쓴 물자는 창고에서 차감돼요.</p>{count<limit?<button disabled={busy||s.paused||![1,2,4,5].includes(s.phase)||free<costs[count]} onClick={()=>act('buyShip',{group,fleet:count},'무역선을 구입했어요!')}>{count+1}척째 무역선 구입 · {goods[item]} {costs[count]}개</button>:<strong>{s.mode==='competition'?'현재 보유 한도에 도달했어요!':'무역선 3척 구입 완료!'}</strong>}</div>;
}
