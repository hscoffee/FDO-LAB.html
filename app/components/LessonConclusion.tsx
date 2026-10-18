'use client';
import {useState} from 'react';
import styles from './LessonConclusion.module.css';
// Verbatim from the teacher's uploaded lesson plan, page 5, <배움 정리>.
// This is a lesson-plan quotation, not a claim of verbatim textbook wording.
export const conclusionAnswers=['생산 조건','필요한 물자','무역'];
export function ConclusionSentence({revealed,onToggle}:{revealed:number[];onToggle:(i:number)=>void}){
 const blank=(i:number)=><button className={styles.blank} aria-label={`${i+1}번 빈칸 ${revealed.includes(i)?'답 숨기기':'답 보기'}`} aria-pressed={revealed.includes(i)} onClick={()=>onToggle(i)}>{revealed.includes(i)?conclusionAnswers[i]:<span>{i+1}</span>}</button>;
 return <p className={styles.sentence}>나라마다 {blank(0)}이 달라 {blank(1)}를 모두 충분히 생산하기 어렵기 때문에 {blank(2)}이 필요하다.</p>;
}
export default function LessonConclusion(){
 const [revealed,Reveal]=useState<number[]>([]);
 return <section className={styles.lesson} aria-label="학습 목표 정리"><header><small>학습 목표</small><h1>무역이 필요한 까닭 알아보기</h1><p>우리 모둠의 경험을 떠올리며 빈칸을 눌러 정리해 봅시다.</p></header><article className={styles.core}><h2>배움 정리</h2><ConclusionSentence revealed={revealed} onToggle={i=>Reveal(old=>old.includes(i)?old.filter(n=>n!==i):[...old,i])}/></article><footer><button onClick={()=>Reveal([])}>빈칸 다시 가리기</button></footer></section>;
}
