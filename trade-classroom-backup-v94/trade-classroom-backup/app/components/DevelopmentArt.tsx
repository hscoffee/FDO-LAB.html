import type {CSSProperties} from 'react';
const stages=['craft','industry','automation','logistics','city','metropolis'];
export default function DevelopmentArt({stage,className=''}:{stage:string;className?:string}){
 const i=Math.max(0,stages.indexOf(stage));
 return <span className={'development-art '+className} data-development-art={stage} aria-hidden="true" style={{backgroundPosition:`${i%3*50}% ${Math.floor(i/3)*100}%`} as CSSProperties}/>;
}
