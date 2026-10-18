'use client';
import type {CSSProperties} from 'react';
import {ArrowUpCircle} from 'lucide-react';
import {researchName,storageCapacity} from '../../lib/technology';
import {factoryName,countries,goods,shipNames,specialty,biome} from '../../lib/content';
import {IndustryArt,BuildingArt,ShipArt} from './GrowthMap';
import DevelopmentArt from './DevelopmentArt';
import styles from './ProductionScene.module.css';

const districts=['곡물 농장','목재 가공소','광산·제철소','직물 공장','커피 농장·가공소','자동차 생산단지'];
const themes=['곡창과 해안 도시','침엽수림과 북방 항구','열대 커피 농장과 교역항','산비탈과 고산 도시','건조한 광산과 제철 도시','설원과 기술 도시'];

// A dedicated local scene, independent of world-map coordinates and cropping.
export default function ProductionScene({technology,country,level=1,ship=1,fleet=1,ready=false,travelling=false,onProduce,onTrade,onStock,onGrow}:{technology?:any;stock?:number[];target?:number;country:number;level?:number;ship?:number;fleet?:number;ready?:boolean;travelling?:boolean;onProduce?:()=>void;onTrade?:()=>void;onStock?:()=>void;onGrow?:()=>void}){
 const facility=technology?.version===2?researchName(country,technology.processing4?'processing4':technology.processing3?'processing3':technology.processing2?'processing2':'processing1'):technology?districts[specialty[country]]:factoryName(country,level);
 const stage=technology?.metropolis?'metropolis':technology?.city?'city':technology?.automation?'automation':technology?.industry?'industry':'craft';
 const cityStage=technology?.metropolis?'metropolis':technology?.city?'city':'craft';
 const stageName={craft:'작은 정착지',industry:'산업 도시',automation:'자동화 산업 도시',city:'생활시설을 갖춘 도시',metropolis:'종합 발전도시'}[stage];
 const backgroundPosition=`${(biome[country]%3)*50}% ${Math.floor(biome[country]/3)*100}%`;
 return <div className={`city-view ${styles.scene}`} style={{'--city-background-position':backgroundPosition} as CSSProperties}>
  <div className={styles.backdrop} role="img" aria-label={`${countries[country].climate} · ${themes[country]}`}/>
  <header className={styles.heading}><div><span>{countries[country].climate}</span><strong>{countries[country].name}</strong><small>특산물 · {goods[specialty[country]]} · {technology?stageName:themes[country]}</small></div>{ready&&onGrow&&<button className={styles.upgrade} onClick={onGrow}><ArrowUpCircle size={18}/>성장 가능</button>}</header>
  <div className={styles.district} data-city-stage={technology?stage:undefined}>
   {technology&&<div className={styles.cityEvolution} key={stage} aria-label={stageName}><DevelopmentArt stage={cityStage}/><b>{stageName}</b></div>}

   <button className={`${styles.site} ${styles.industry}`} onClick={onProduce||onGrow} disabled={!onProduce&&!onGrow} aria-label={`${facility}, 생산 ${level}단계`}><div key={level} className={`${styles.art} ${styles.construction}`}>{technology?.version===2?<IndustryArt country={country} level={technology.processing4?3:technology.processing1?2:1}/>:technology?.industry?<DevelopmentArt stage={technology.automation?'automation':'industry'}/>:<IndustryArt country={country} level={level}/>}</div><span>{facility}<small>생산 Lv.{level}</small></span></button>
   <button className={`${styles.site} ${styles.warehouse}`} onClick={onStock} disabled={!onStock}><div className={styles.art}><BuildingArt kind="warehouse"/></div><span>{technology?.version===2?researchName(country,technology.storage3?'storage3':technology.storage2?'storage2':'storage1'):'창고'}<small>{technology?.version===2?`자원별 ${storageCapacity(technology)}개 저장`:'보유 물자 확인'}</small></span></button>
   <button className={`${styles.site} ${styles.harbor}`} onClick={onTrade||onGrow} disabled={!onTrade&&!onGrow}><div className={styles.art}>{technology?.logistics?<span className={styles.logisticsArt} aria-label="물류센터 완성"><DevelopmentArt stage="logistics"/></span>:<BuildingArt kind="harbor"/>}</div><span>{technology?.logistics?'물류항':'무역항'}<small>거래 제안·확인</small></span></button>
   <button className={`${styles.site} ${styles.vessel}`} onClick={fleet===0?onGrow:onTrade||onGrow} disabled={!onTrade&&!onGrow}><div key={ship} className={`${styles.art} ${styles.boat}`}>{fleet>0?<ShipArt level={ship}/>:<BuildingArt kind="harbor"/>}</div><span>{fleet>0?shipNames[ship-1]:'첫 무역선 구입'}<small>{fleet>0?`${fleet}척 보유 · ${travelling?'운송 중':'항구 대기'}`:'특산물 5개 필요'}</small></span></button>
  </div>
 </div>;
}
