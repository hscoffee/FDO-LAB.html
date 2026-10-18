'use client';
import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {victoryPresentation,countries} from '../../lib/content';
import {landmarkFanfare} from '../../lib/sound';
import styles from './LandmarkNotice.module.css';
function ConstructionNotice({s,roomKey,voice,onVoice}:{s:any;roomKey:string;voice:boolean;onVoice:(key:string)=>void}){
 const [event,Event]=useState<any>(null),seen=useRef(new Set((s.activity||[]).filter((e:any)=>e.kind==='landmark').map((e:any)=>e.id))),queue=useRef<any[]>([]),running=useRef(false),alive=useRef(true),callbacks=useRef({voice,onVoice}),room=useRef(roomKey);callbacks.current={voice,onVoice};
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;queue.current=[];};},[]);
 useEffect(()=>{if(room.current!==roomKey){room.current=roomKey;seen.current=new Set((s.activity||[]).filter((e:any)=>e.kind==='landmark').map((e:any)=>e.id));queue.current=[];Event(null);return;}
  for(const e of [...(s.activity||[])].reverse()){if(e.kind==='landmark'&&!seen.current.has(e.id)){seen.current.add(e.id);queue.current.push({...e,country:s.assignment[e.group],roomKey});}}
  async function next(){if(running.current)return;running.current=true;while(queue.current.length&&alive.current){const item=queue.current.shift();await landmarkFanfare();if(!alive.current||item.roomKey!==room.current)continue;Event(item);window.dispatchEvent(new CustomEvent('trade-landmark-focus',{detail:{group:item.group}}));if(callbacks.current.voice)callbacks.current.onVoice('win-'+item.country);await new Promise(resolve=>setTimeout(resolve,5500));if(alive.current)Event(null);}running.current=false;}
  void next();
 },[s.activity,roomKey]);
 if(!event)return null;
 return createPortal(<div className={styles.notice} role="status" aria-live="polite"><span className={styles.flag} aria-hidden="true" style={{backgroundPosition:`${event.country%3*50}% ${Math.floor(event.country/3)*100}%`}}/><div><small>랜드마크 건설 완료</small><strong>{countries[event.country].name}가 랜드마크를 건설했습니다!</strong></div></div>,document.body);
}

export function VictoryCard({s,onClose}:{s:any;onClose?:()=>void}){const result=victoryPresentation(s);return <div className={styles.victoryBackdrop}><section className={styles.victoryCard} role="status" aria-live="polite"><span className={styles.victoryFlag} aria-hidden="true" style={{backgroundPosition:`${s.assignment[result.winners[0]]%3*50}% ${Math.floor(s.assignment[result.winners[0]]/3)*100}%`}}/><h2>{result.title}</h2><p>{result.message}</p>{result.reason==='score'&&s.lessonScores&&<small>{result.winners.map(g=>countries[s.assignment[g]].name+' '+s.lessonScores[g]+'점').join(' · ')}</small>}{onClose&&<button onClick={onClose}>확인</button>}</section></div>;}
function WinnerNotice({s,roomKey,voice,onVoice}:{s:any;roomKey:string;voice:boolean;onVoice:(key:string)=>void}){
 const [show,Show]=useState(false),seen=useRef(''),callbacks=useRef({voice,onVoice});callbacks.current={voice,onVoice};
 useEffect(()=>{if(s.phase!==6||!s.winners?.length){Show(false);return;}const signature=roomKey+':'+s.endedAt+':'+s.winners.join(',');if(seen.current===signature)return;seen.current=signature;
 const remaining=Math.min(10000,Math.max(0,10000-(Date.now()-(s.celebrationRealAt||s.endedAt||Date.now()))));if(!remaining)return;
 try{if(sessionStorage.getItem('trade-victory:'+roomKey)===signature)return;sessionStorage.setItem('trade-victory:'+roomKey,signature);}catch{}
 Show(true);void landmarkFanfare();if(callbacks.current.voice){const result=victoryPresentation(s);callbacks.current.onVoice('victory:'+result.reason+':'+s.winners.map((g:number)=>s.assignment[g]).join(','));}
 const timer=setTimeout(()=>Show(false),remaining);return()=>clearTimeout(timer);
 },[s.phase,s.endedAt,roomKey]);
 if(!show||typeof document==='undefined')return null;return createPortal(<VictoryCard s={s} onClose={()=>Show(false)}/>,document.body);
}
export default function LandmarkNotice(props:{s:any;roomKey:string;voice:boolean;onVoice:(key:string)=>void}){return <>{props.s.mode==='competition'&&<ConstructionNotice {...props}/>}<WinnerNotice {...props}/></>;}
