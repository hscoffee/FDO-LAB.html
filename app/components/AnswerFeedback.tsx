import GoodArt from './GoodArt';
import {goods} from '../../lib/content';
import styles from './AnswerFeedback.module.css';
type Feedback={correct:boolean;item:number;amount:number;correctText:string;explanation:string};
export default function AnswerFeedback({feedback,onNext}:{feedback:Feedback;onNext:()=>void}){
 return <section className={styles.root} aria-label="문제 풀이 결과" data-correct={feedback.correct}>
  <div className={styles.content}>
   <span className={styles.status} role="status">{feedback.correct?'정답입니다!':'정답을 확인해 보세요'}</span>
   {feedback.correct&&<div className={styles.resource}><GoodArt item={feedback.item}/><b>+{feedback.amount}</b></div>}
   <h1>{feedback.correct?`${goods[feedback.item]} ${feedback.amount}개 획득!`:`정답: ${feedback.correctText}`}</h1>
   <p>{feedback.explanation}</p>
   <small>{feedback.correct?'공동 창고에 저장했어요.':'이번 문제에는 생산 보상이 없습니다.'}</small>
  </div>
  <button className="player-primary" autoFocus onClick={onNext}>다음 문제</button>
 </section>;
}
