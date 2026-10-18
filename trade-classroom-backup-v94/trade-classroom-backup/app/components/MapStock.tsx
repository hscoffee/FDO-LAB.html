import {memo} from 'react';
import GoodArt from './GoodArt';
import {goods} from '../../lib/content';
function MapStock({stock,target=10,items=[0,1,2,3,4,5]}:{stock:number[];target?:number;items?:number[]}){return <div className="map-resource-grid" aria-label="지도 위 보유 물자">{items.map(item=>[goods[item],item] as const).map(([name,item])=>{const count=stock[item]||0;return <span className={'map-resource-count '+(count>=target?'achieved':'')} key={name} data-empty={count===0} aria-label={`${name} ${count}개`} title={`${name} ${count}개`}><GoodArt item={item}/><b>{count}</b></span>;})}</div>;}
export default memo(MapStock,(a,b)=>JSON.stringify(a.items)===JSON.stringify(b.items)&&a.target===b.target&&a.stock.length===b.stock.length&&a.stock.every((v,i)=>v===b.stock[i]));
