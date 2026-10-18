import {activeItems} from './content';
/** Completed trades only: pending offers and cargo at sea are not imports yet. */
export function classroomReport(s:any,g:number){
 const count=s.mode==='competition'?18:6;const exports=Array(count).fill(0) as number[],imports=Array(count).fill(0) as number[];
 for(const v of (s.trades||[]).slice(s.reportTradeStart||0)){if(v.group===g){exports[v.give]+=v.qty;imports[v.want]+=v.wantQty??v.qty;}if(v.to===g){exports[v.want]+=v.wantQty??v.qty;imports[v.give]+=v.qty;}}
 const before=(s.before?.[g]||s.snap1?.[g]||Array(6).fill(0)) as number[],after=(s.stock?.[g]||Array(6).fill(0)) as number[];
 const additionalProduction=Array.from({length:count},(_,i)=>Math.max(0,(s.producedRound2?.[g]?.[i]||0)-(s.reportProductionBaseline?.[g]?.[i]||0))),outgoing=Array(count).fill(0) as number[];
 for(const v of s.shipments||[]){if(v.group===g)outgoing[v.give]+=v.qty;if(v.to===g)outgoing[v.want]+=v.wantQty??v.qty;}
 return {exports,imports,before,after,additionalProduction,outgoing,used:after.map((n,i)=>Math.max(0,(before[i]||0)+(additionalProduction[i]||0)+imports[i]-exports[i]-outgoing[i]-n)),changes:after.map((n,i)=>n-before[i]),beforeMet:activeItems(s).filter(i=>before[i]>=s.target).length,afterMet:activeItems(s).filter(i=>after[i]>=s.target).length,importHelp:activeItems(s).map(i=>Math.min(imports[i],Math.max(0,s.target-before[i]))),produced:s.growth?.[g]?.produced||0,members:(s.players||[]).filter((p:any)=>p.group===g).map((p:any)=>({id:p.id,name:p.name,production:(p.counts?.[0]||0)+(p.counts?.[1]||0),reflection:p.reflection||''}))};
}
