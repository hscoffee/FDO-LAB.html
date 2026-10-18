'use client';
import {X} from 'lucide-react';
import {activeItems,countries,goods,specialty,productionAmount} from '../../lib/content';
import {geographicAnchors} from '../../lib/routes';
import {terrainAsset} from '../../lib/presentation';
import GoodArt from './GoodArt';
import styles from './CountryOverview.module.css';
export default function CountryOverview({s,group,onClose}:{s:any;group:number;onClose:()=>void}){
 const ci=s.assignment[group],c=countries[ci],level=s.growth[group].factory,[x,y]=geographicAnchors[ci];
 return <section className={styles.panel} role="dialog" aria-modal="true" aria-label={`${c.name} 기후와 생산 조건`}><header><div><small>국가 탐색</small><h2>{c.name}</h2><p>{c.climate} · 특산물 {goods[specialty[ci]]}</p></div><button onClick={onClose} aria-label="국가 정보 닫기"><X size={22}/></button></header><div className={styles.body}><div className={styles.location}><img src={terrainAsset} alt="세계지도에서 선택한 국가의 위치"/><span className={styles.marker} style={{left:x+'%',top:y+'%'}}><i/><b>{c.name}</b></span></div><div className={styles.facts}>{c.facts.map((fact,i)=><article key={fact}><b>{['자연환경','자원','자본','기술'][i]}</b><p>{fact}</p></article>)}</div><section className={styles.production}><h3>정답 1개당 생산량 <small>현재 생산시설 {level}단계</small></h3><div>{activeItems(s).map(item=><article key={item} data-specialty={item===specialty[ci]}><GoodArt item={item}/><span>{goods[item]}</span><b>{productionAmount(ci,item,level,s.mode==='competition')}개</b></article>)}</div><p>{c.reason}</p></section></div></section>;
}
