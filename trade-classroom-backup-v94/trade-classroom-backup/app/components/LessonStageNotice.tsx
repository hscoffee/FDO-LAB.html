'use client';
import {useEffect,useState} from 'react';
import {createPortal} from 'react-dom';
import {specialtyNotice,firstProductionNotice} from '../../lib/lesson-learning';
import styles from './LessonStageNotice.module.css';
export default function LessonStageNotice({s,roomKey,sound,onListen}:{s:any;roomKey:string;sound:boolean;onListen:(key:string)=>void}){
 const [open,Open]=useState(false);
 const active=s.mode!=='competition'&&s.lessonFlow&&[1,5].includes(s.phase);
 useEffect(()=>{Open(!!active);},[active,s.phase,roomKey]);
 if(!open||!active||typeof document==='undefined')return null;
 return createPortal(<LessonStageCard phase={s.phase} onClose={()=>Open(false)}/>,document.body);
}
export function LessonStageCard({phase,onClose}:{phase:number;onClose:()=>void}){return <div className={styles.backdrop}><section className={styles.card} role="dialog" aria-modal="true" aria-labelledby="specialty-notice-title"><small>{phase===1?'1차 물자 생산':'2차 생산 · 무역'}</small><h2 id="specialty-notice-title">{phase===1?'모든 물자를 생산할 수 있어요':'이제 특산물만 생산할 수 있어요'}</h2><p>{phase===1?firstProductionNotice:specialtyNotice}</p><strong>{phase===1?'우리나라가 잘 만드는 특산물을 찾아보세요.':'부족한 물자는 다른 나라와 무역해 보세요.'}</strong><div><button autoFocus onClick={()=>onClose()}>확인 · 활동 시작</button></div></section></div>;}
