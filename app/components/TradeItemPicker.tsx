'use client';
import {Minus,Plus,Check} from 'lucide-react';
import {goods} from '../../lib/content';
import GoodArt from './GoodArt';
import styles from './TradeItemPicker.module.css';
type Props={step?:'both'|'item'|'quantity';maxQuantity?:number;items?:number[];sending:boolean;item:number;quantity:number;available:number[];onItem:(item:number)=>void;onQuantity:(quantity:number)=>void};
export default function TradeItemPicker({sending,item,quantity,available,onItem,onQuantity,step='both',maxQuantity=10,items=[0,1,2,3,4,5]}:Props){
 const max=Math.min(maxQuantity,available[item]||0);
 return <div className={styles.editor} data-step={step}>
  {step!=='quantity'&&<div className={styles.goodsPane}><h3>물자 선택</h3><div className={styles.goods} role="group" aria-label={sending?'보낼 물자':'받을 물자'}>{items.map(i=>[goods[i],i] as const).map(([name,i])=><button key={name} aria-pressed={item===i} disabled={(available[i]||0)<1} onClick={()=>onItem(i)} className={item===i?styles.selected:''}><GoodArt item={i}/><strong>{name}</strong><small>{`${sending?'우리':'상대'} 사용 가능 ${available[i]||0}개`}</small>{item===i&&<Check className={styles.check} size={16}/>}</button>)}</div></div>}
  {step!=='item'&&<div className={styles.quantityPane}><h3>{goods[item]} · 개수 선택</h3><div className={styles.stepper}><button aria-label="한 개 줄이기" disabled={quantity<=1} onClick={()=>onQuantity(quantity-1)}><Minus size={20}/></button><output aria-live="polite">{quantity}<small>개</small></output><button aria-label="한 개 늘리기" disabled={quantity>=max} onClick={()=>onQuantity(quantity+1)}><Plus size={20}/></button></div><div className={styles.numbers} role="group" aria-label={`1개부터 ${maxQuantity}개까지`}>{Array.from({length:maxQuantity},(_,i)=>i+1).map(n=><button key={n} aria-label={`${n}개`} aria-pressed={n===quantity} disabled={n>max} className={n===quantity?styles.selected:''} onClick={()=>onQuantity(n)}>{n}</button>)}</div><p>{sending?`대기 제안의 물자를 제외하고 ${available[item]}개를 보낼 수 있어요.`:`상대 나라의 사용 가능한 물자 ${available[item]||0}개 안에서 받을 수 있어요.`}</p></div>}
 </div>;
}
