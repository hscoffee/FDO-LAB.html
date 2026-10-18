import GoodArt from './GoodArt';
import {goods} from '../../lib/content';
export default function TokenPile({count,item,compact=false}:{count:number;item:number;compact?:boolean}){
 const n=Math.max(0,Math.floor(count)),hundreds=Math.floor(n/100),tens=Math.floor(n%100/10),units=n%10;
 // One denomination group never grows with inventory size.
 return <div className={'token-pile denominated '+(compact?'tiny':'')} role="img" aria-label={`${goods[item]} ${n}개: 100개 묶음 ${hundreds}, 10개 묶음 ${tens}, 낱개 ${units}`} title={`${goods[item]} ${n}개`}>
 {[[hundreds,100,'hundred'],[tens,10,'bundle'],[units,1,'unit']].map(([amount,value,kind])=>Number(amount)>0&&<div key={kind} className="token-denomination" aria-hidden="true"><span className={'resource-token '+kind}><GoodArt item={item}/>{Number(value)>1&&<b>{value}</b>}</span><strong>×{amount}</strong></div>)}
 {n===0&&<span className="no-tokens">없음</span>}</div>;
}
