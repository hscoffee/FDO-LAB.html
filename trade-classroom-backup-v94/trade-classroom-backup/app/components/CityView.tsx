'use client';
import {ArrowUpCircle} from 'lucide-react';
import MapStock from './MapStock';
import {factoryName,countries,goods,specialty,biome} from '../../lib/content';
import {terrainAsset,facilityPositions,harborPositions,warehousePositions} from '../../lib/presentation';
import {geographicAnchors} from '../../lib/routes';
import {IndustryArt,BuildingArt} from './GrowthMap';
export default function CityView({stock,items,target=20,country,level=1,ship=1,ready=false,travelling=false,onProduce,onTrade,onStock,onGrow}:{stock?:number[];items?:number[];target?:number;country:number;level?:number;ship?:number;ready?:boolean;travelling?:boolean;onProduce?:()=>void;onTrade?:()=>void;onStock?:()=>void;onGrow?:()=>void}){
 const district=factoryName(country,level),center=[facilityPositions[country][0]*15.36,facilityPositions[country][1]*10.24],warehouse=[warehousePositions[country][0]*15.36,warehousePositions[country][1]*10.24],port=[harborPositions[country][0]*15.36,harborPositions[country][1]*10.24],crop=[Math.max(0,Math.min(1071,(Math.min(center[0],port[0])+Math.max(center[0],port[0]))/2-232)),Math.max(0,Math.min(599,(Math.min(center[1],port[1])+Math.max(center[1],port[1]))/2-212))];
 return <div className={'city-view native-city building-city biome-'+biome[country]+' era-'+level}><svg className="city-landscape" viewBox={`${crop.join(' ')} 465 425`} preserveAspectRatio="xMidYMid meet" aria-label={countries[country].name+' 도시 지도'}><image href={terrainAsset} width="1536" height="1024"/>
 <foreignObject x={center[0]-67} y={center[1]-95} width="135" height="140"><button className="city-building" onClick={onProduce||onGrow} disabled={!onProduce&&!onGrow}><IndustryArt country={country} level={level}/><span>{district}<small>생산 Lv.{level}</small></span></button></foreignObject>
 <foreignObject x={warehouse[0]-57} y={warehouse[1]-85} width="115" height="125"><button className="city-building" onClick={onStock} disabled={!onStock}><BuildingArt kind="warehouse"/><span>창고</span></button></foreignObject>
 <foreignObject x={port[0]-60} y={port[1]-72} width="120" height="130"><button className="city-building" onClick={onTrade||onGrow} disabled={!onTrade&&!onGrow}><BuildingArt kind="harbor"/><span>무역항<small>{travelling?'운송 중':'무역 Lv.'+ship}</small></span></button></foreignObject></svg>
 <div className="city-caption"><span>{countries[country].climate}</span><strong>{countries[country].name}</strong><small>특산물 · {goods[specialty[country]]}</small></div>
 {ready&&onGrow&&<button className="city-upgrade" onClick={onGrow}><ArrowUpCircle size={19}/> 성장 가능</button>}{stock&&<div className="city-map-stock"><MapStock stock={stock} target={target} items={items}/></div>}</div>;
}
