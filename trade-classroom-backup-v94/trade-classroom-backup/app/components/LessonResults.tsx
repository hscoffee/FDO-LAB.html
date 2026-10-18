'use client';
import {useState} from 'react';
import LessonTextInput from './LessonTextInput';
import {CountryEvidence} from './ResultsCharts';
import {worksheetQuestions,worksheetOf} from '../../lib/lesson-learning';
import styles from './ClassroomReport.module.css';
import learning from './LessonLearning.module.css';
export default function LessonResults({s,group,busy,act}:{s:any;group:number;busy:boolean;act:(a:string,b?:any,n?:string)=>Promise<any>}){
 const me=s.players.find((p:any)=>p.id===s.me),[step,Step]=useState(0),[evidence,Evidence]=useState(false),[draft,Draft]=useState(()=>worksheetOf(me));
 const q=worksheetQuestions[step],saved=me?.worksheet&&worksheetQuestions.every(q=>draft[q.key]===me.worksheet[q.key]);
 return <section className={learning.activity+' '+styles.root}><header><small>발표 학습지</small><h1>생산과 무역 경험을 정리해 봅시다.</h1></header><nav className={learning.steps} aria-label="발표 학습지 항목">{worksheetQuestions.map((q,i)=><button key={q.key} aria-pressed={step===i&&!evidence} onClick={()=>{Step(i);Evidence(false);}}>{i+1} · {q.concept}</button>)}<button aria-pressed={evidence} onClick={()=>Evidence(!evidence)}>실제 기록</button></nav><div className={learning.scroller}>{evidence?<CountryEvidence s={s} group={group}/>:<><h2 className={learning.question}>{step===2?'3 · 무역의 필요성':q.question}</h2><p className={learning.hint}>{q.hint}</p>{step===0&&me?.lessonNotes?.[7]?.text&&<div className={learning.savedNotes}><b>처음 예상</b><p>{me.lessonNotes[7].text}</p></div>}{step===2&&<div className={learning.savedNotes}>{worksheetQuestions.slice(0,2).map(q=><p key={q.key}><b>{q.concept}</b> · {draft[q.key]||'앞 항목의 기록을 먼저 확인해요.'}</p>)}</div>}<label>{q.concept}에 대한 내 생각<LessonTextInput key={q.key} className={learning.answer} aria-label={q.concept+'에 대한 내 생각'} maxLength={240} initialValue={draft[q.key]} onText={text=>Draft(v=>({...v,[q.key]:text}))} placeholder="우리나라의 생산·무역 경험을 근거로 적어요."/></label></>}</div><footer><span role="status">{saved?'학습지 저장 완료 · 교사 발표판에 반영됨':`${worksheetQuestions.filter(q=>draft[q.key].trim()).length}/3 항목 작성`}</span>{!evidence&&step<2&&<button onClick={()=>Step(step+1)}>다음 항목</button>}<button disabled={busy||!Object.values(draft).some(v=>v.trim())} onClick={()=>act('lessonWorksheet',draft,'학습지를 저장했어요. 교사 발표판에 반영됩니다.')}>학습지 저장</button></footer></section>;
}
