'use client';
import {activityInstruction} from '../../lib/lesson-learning';
import {useState} from 'react';
import GoodArt from './GoodArt';
import LessonTextInput from './LessonTextInput';
import {activeGroups,activeItems,countries,goods} from '../../lib/content';
import styles from './LessonLearning.module.css';
export const lessonPrompts:Record<number,{title:string;steps:string[]}>={
7:{title:'생산 조건을 보고 예상해요',steps:['자연환경·자원·자본·기술 중 유리한 조건을 찾아요.','잘 생산할 물자와 만들기 어려울 물자를 예상하고 까닭을 이야기해요.']},
1:{title:'예상과 실제 생산을 비교해요',steps:['같은 문제를 맞혀도 물자별 생산량이 같나요?','모둠 친구와 다른 물자도 생산해 보고, 처음 예상과 비교해요.']},
2:{title:'창고를 비교하고 해결 방법을 찾아요',steps:['목표보다 부족한 물자와 여유 있는 물자를 찾아요.','현황 지도에서 그 물자가 많은 나라를 찾고, 서로 무엇을 교환할지 의논해요.']},
5:{title:'근거를 정하고 무역해요',steps:['필요한 물자·보낼 물자·거래 상대를 모둠과 의논해요.','물자가 도착하면 부족분이 줄었는지 확인해요. 상대 나라도 무엇을 얻었나요?']},
6:{title:'경험을 근거로 발표해요',steps:['부족했던 물자 → 보낸 물자 → 받은 물자 → 달라진 점을 연결해요.','여러 나라의 공통점을 찾아 무역이 필요한 까닭을 설명해요.']}
};
export function LessonGuide({s}:{s:any}){if(s.mode==='competition'||!lessonPrompts[s.phase])return null;return <aside className={styles.guide} aria-label="현재 활동 안내"><b>{activityInstruction(s.phase)}</b></aside>;}
export default function LessonActivity({s,group,busy,act}:{s:any;group:number;busy:boolean;act:(action:string,args?:any,notice?:string)=>Promise<any>}){
 const me=s.players.find((p:any)=>p.id===s.me),saved=me?.lessonNotes?.[s.phase]||{},p=lessonPrompts[s.phase]||lessonPrompts[2],ci=s.assignment[group],c=countries[ci];
 const [draft,Draft]=useState<any>(saved);const set=(key:string,value:string)=>Draft((v:any)=>({...v,[key]:value}));
 const select=(key:string,label:string,options:[number,string][]) => <label>{label}<select value={draft[key]??''} onChange={e=>set(key,e.target.value)}><option value="">선택해요</option>{options.map(([v,n])=><option key={v} value={v}>{n}</option>)}</select></label>;
 const items=activeItems(s).map(i=>[i,goods[i]] as [number,string]);
 return <section className={styles.activity}><div className={styles.heading}><small>{p.title}</small><h1>{activityInstruction(s.phase)}</h1></div><div className={styles.scroller}>{[7,1].includes(s.phase)?<><div className={styles.facts}>{c.facts.map((f,i)=><article key={f}><b>{['자연환경','자원','자본','기술'][i]}</b><p>{f}</p></article>)}</div><div className={styles.fields}>{select('expected','잘 생산할 것 같은 물자',items)}{select('condition','근거가 되는 조건',['자연환경','자원','자본','기술'].map((n,i)=>[i,n]))}</div></>:<><div className={styles.stock}>{items.map(([i,n])=><article key={i}><b><GoodArt item={i}/><span>{n}</span></b><strong>{s.stock[group][i]}개</strong><small>{s.stock[group][i]<s.target?`${s.target-s.stock[group][i]}개 부족`:'목표 이상'}</small></article>)}</div><div className={styles.fields}>{select('give','보낼 물자',items)}{select('want','필요한 물자',items)}{select('partner','도움을 주고받을 나라',activeGroups(s).filter(g=>g!==group).map(g=>[g,countries[s.assignment[g]].name]))}</div></>}
 <label className={styles.reason}>{[7,1].includes(s.phase)?'그렇게 예상한 까닭은?':'왜 이 물자를 교환하려고 하나요?'}<LessonTextInput maxLength={240} initialValue={draft.text||''} onText={text=>set('text',text)} placeholder="모둠에서 이야기한 생각을 짧게 남겨요."/></label></div><footer><span role="status">{saved.at?'활동 기록 저장됨 · 다시 저장할 수 있어요':'각자 생각을 남기고 모둠과 나눠요.'}</span><button disabled={busy||!draft.text?.trim()} onClick={()=>act('lessonNote',{...draft,phase:s.phase},'활동 기록을 저장했어요.')}>활동 기록 저장</button></footer></section>;
}
