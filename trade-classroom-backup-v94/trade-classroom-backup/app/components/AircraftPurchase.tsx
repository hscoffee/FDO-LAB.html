import PlaneArt from './PlaneArt';
import {airLimit} from '../../lib/technology';
import {effectiveAircraftCapacity,goods,specialty,aircraftCost,aircraftCapacity} from '../../lib/content';
export default function AircraftPurchase({s,group,busy,act}:{s:any;group:number;busy:boolean;act:(action:string,args?:any,notice?:string)=>Promise<any>}){
 if(s.mode!=='competition')return null;
 const count=s.growth[group].aircraft||0,limit=airLimit(s.technology?.[group]),capacity=effectiveAircraftCapacity(s,group),owned=count>=limit,unlocked=!!s.technology?.[group]?.aviation,item=specialty[s.assignment[group]],free=s.availableStock?.[group]?.[item]??s.stock[group][item],flying=s.shipments.some((v:any)=>v.group===group&&v.transport==='air');
 return <div className="aircraft-purchase"><PlaneArt/><div><b>무역 비행기 {count} / {limit}대</b><small>{owned?flying?'비행 중 · 귀환 후 사용 가능':'대기 중':unlocked?`특산물 ${goods[item]} ${aircraftCost}개로 구입`:'항공 연구 완료 시 첫 1대 지급'} · 최대 {capacity}개 · 빠른 운송</small></div>{!owned&&<button disabled={busy||!unlocked||free<aircraftCost||s.paused||s.phase!==5} onClick={()=>act('buyAircraft',{group},'무역 비행기를 구입했어요!')}>비행기 구입</button>}</div>;
}
