'use client';
import {useState} from 'react';
import GrowthMap from './GrowthMap';
import {specialty} from '../../lib/content';
import {routeVoyageMs} from '../../lib/routes';
// A visual example, kept separate from live rooms and their classroom rules.
export function showcaseState(t=Date.now()){
 const factory=[3,2,1,2,3,1],ship=[3,2,1,2,3,2],landmarks=[0,4];
 return {phase:5,end:t+3600000,players:[],groups:[0,1,2,3,4,5],items:[0,1,2,3,4,5],assignment:[0,1,2,3,4,5],
 stock:Array.from({length:6},(_,g)=>Array.from({length:6},(_,i)=>(landmarks.includes(g)?30:7)+((g*11+i*7)%18)+(i===specialty[g]?28:0))),
 growth:factory.map((level,g)=>({factory:level,ship:ship[g],fleet:1,aircraft:g%3===0?1:0,produced:[240,145,62,168,285,85][g],tradeVolume:[160,55,18,65,195,44][g],importedTypes:[0,1,2],factoryAt:0,shipAt:0})),
 target:30,landmarks,activity:[],shipments:Array.from({length:8},(_,n)=>{
  const air=n>=6,g=air?(n-6)*3:n,slot=0,to=(g+(air?2:1))%6,duration=air?120000:Math.max(144000,routeVoyageMs(g,to,ship[g])*4);
  const departedAt=t-duration*((n*.173+.09)%1);
  return {transport:air?'air':'ship',id:'showcase-'+n,group:g,to,shipSlot:slot,give:specialty[g],want:specialty[to],qty:10,wantQty:10,shipLevel:ship[g],trips:1,departedAt,arrivesAt:departedAt+duration};
 })};
}
export default function Showcase(){const [s]=useState(()=>showcaseState());return <div className="entry-world" aria-hidden="true"><GrowthMap s={s} now={Date.now()} busy readOnly showcase onAction={async()=>undefined}/></div>;}
