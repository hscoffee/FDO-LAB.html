'use client';
import {useState} from 'react';
import {createPortal} from 'react-dom';
import GroupBoard from './GroupBoard';
import styles from './TeacherRoomPanel.module.css';
export default function TeacherRoomPanel({s,code,qr,busy,onAction,onClose}:{s:any;code:string;qr:string;busy:boolean;onAction:(action:string,args?:any)=>Promise<any>;onClose:()=>void}){
 const [message,Message]=useState('');
 return createPortal(<div className={styles.overlay} onClick={e=>{if(e.target===e.currentTarget)onClose();}} onKeyDown={e=>{if(e.key==='Escape')onClose();}}><section className={styles.panel} role="dialog" aria-modal="true" aria-label="학생 입장과 모둠 관리"><div className={styles.heading}><h2>학생 입장 · 모둠 관리</h2><button autoFocus onClick={onClose}>닫기</button></div><div className={styles.layout}><aside className={styles.invite}>{qr?<img src={qr} width={240} height={240} alt={'학생 입장 QR · 방 코드 '+code}/>:<p>QR 준비 중</p>}<strong>{code}</strong><p>학생은 QR을 찍고 모둠을 선택해요.<br/>같은 기기·브라우저로 다시 들어오면<br/>기존 학생 정보로 복귀합니다.</p><button onClick={async()=>{try{await navigator.clipboard.writeText(location.origin+'/?room='+code);Message('입장 링크를 복사했어요.');}catch{Message('QR 또는 방 코드를 사용해 주세요.');}}}>입장 링크 복사</button>{message&&<p role="status">{message}</p>}</aside><div className={styles.roster}><GroupBoard s={s} busy={busy} onAction={onAction}/></div></div></section></div>,document.body);
}
