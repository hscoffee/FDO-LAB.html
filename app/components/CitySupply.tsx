'use client';
import {useState} from 'react';
import {goods,countries} from '../../lib/content';
import {citySupplyItems,cityUses,competitionScore} from '../../lib/technology';
import GoodArt from './GoodArt';
import styles from './CitySupply.module.css';
export default function CitySupply({s,group,busy,act}:{s:any;group:number;busy:boolean;act:(a:string,args?:any,notice?:string)=>Promise<any>}){
 const [tier,Tier]=useState(2),t=s.technology[group],score=competitionScore(s,group),stock=s.availableStock?.[group]||s.stock[group];
 return <section className={styles.root} aria-label="도시 생활 물자 공급"><p>다른 나라의 가공품 2개 또는 고급 가공품 1개를 시민 생활에 사용해요. 같은 나라의 기본 공급은 1단계, 고급 공급은 2단계로 인정돼요. 고급으로 바꿔도 차이만 추가되며, 나라별 최대 2단계입니다.</p><div className={styles.tabs}><button aria-pressed={tier===2} onClick={()=>Tier(2)}>가공품</button><button aria-pressed={tier===3} onClick={()=>Tier(3)}>고급 가공품</button><strong>도시 생활 {score.city}/10점</strong></div><div className={styles.list}>{citySupplyItems(s,group).filter(i=>i<12?tier===2:tier===3).map(item=>{const ci=(item-6)%6,done=(t.supplies?.[ci]||0)>=tier;return <article key={item}><GoodArt item={item}/><div><b>{goods[item]}</b><small>{countries[ci].name} · {cityUses[ci]}</small><span>사용 가능 {stock[item]||0}개 · {tier===2?'기본':'고급'} 공급</span></div><button disabled={busy||s.paused||s.phase!==5||done||(stock[item]||0)<(tier===2?2:1)} onClick={()=>act('supplyCity',{item},'도시 생활에 물자를 공급했어요.')}>{done?'공급 완료':`${tier===2?2:1}개 공급`}</button></article>;})}</div><small>보유 물자 최대 10점 + 도시 생활 최대 10점 = 자원·생활 20점. 참여 나라 수에 맞춰 도시 점수를 계산합니다.</small></section>;
}
