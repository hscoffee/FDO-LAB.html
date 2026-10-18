'use client';
import {createPortal} from 'react-dom';
import styles from './TeacherActionNotice.module.css';
export default function TeacherActionNotice({action,error,onDismiss}:{action:string;error:string;onDismiss:()=>void}){
 if(typeof document==='undefined'||(!action&&!error))return null;
 return createPortal(<div className={styles.notice} role={error?'alert':'status'} aria-live="polite" aria-atomic="true">{error?<><span>{error}</span><button onClick={onDismiss}>닫기</button></>:<span>{action==='next'?'다음 활동으로 전환 중…':action==='previous'?'이전 활동으로 전환 중…':'진행 상태 변경 중…'}</span>}</div>,document.body);
}
