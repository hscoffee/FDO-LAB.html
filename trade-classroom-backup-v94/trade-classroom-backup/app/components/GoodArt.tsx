import {useId} from 'react';
import {goods} from '../../lib/content';
export default function GoodArt({item,className=''}:{item:number;className?:string}){
 const processed=item>=6,index=processed?item-6:item,columns=processed?4:3,w=processed?384:512,h=processed?1024/3:512,x=(index%columns)*w,y=Math.floor(index/columns)*h,clipId=useId();
 // Clip the atlas in image coordinates, independently of the container aspect ratio.
 return <svg className={'good-art '+className} viewBox={`${x} ${y} ${w} ${h}`} preserveAspectRatio="xMidYMid meet" style={{overflow:'hidden'}} role="img" aria-label={goods[item]}>
  <defs><clipPath id={clipId} clipPathUnits="userSpaceOnUse"><rect x={x} y={y} width={w} height={h}/></clipPath></defs>
  <image href={processed?"/assets/processed-items.png":"/assets/resources-items.png"} width="1536" height="1024" clipPath={`url(#${clipId})`}/>
 </svg>;
}
