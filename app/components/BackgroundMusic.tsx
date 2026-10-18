'use client';
import {useEffect,useRef,useState} from 'react';
import {Music2} from 'lucide-react';
import {musicForPhase,musicCredits} from '../../lib/music';
export default function BackgroundMusic({paused=false,phase=0,quiet=false,controls=true}:{paused?:boolean;phase?:number;quiet?:boolean;controls?:boolean}){
 const player=useRef<HTMLAudioElement|null>(null),[enabled,Enabled]=useState(true),[volume,Volume]=useState(.4),[error,Error]=useState('');
 const track=musicForPhase(phase);
 useEffect(()=>{const a=new Audio();a.loop=true;a.preload='auto';a.onerror=()=>Error('음악을 불러오지 못했어요. 연결을 확인하고 음악 버튼을 다시 눌러 주세요.');player.current=a;try{const prefs=JSON.parse(sessionStorage.getItem('trade-music')||'null');if(prefs){Enabled(prefs.enabled!==false);if(typeof prefs.volume==='number')Volume(Math.max(0,Math.min(1,prefs.volume)));}}catch{}return()=>{a.pause();a.onerror=null;a.src='';player.current=null;};},[]);
 useEffect(()=>{const a=player.current;if(!a)return;a.pause();a.src='/audio/'+track+'.mp3';a.load();Error('');},[track]);
 useEffect(()=>{try{sessionStorage.setItem('trade-music',JSON.stringify({enabled,volume}));}catch{}},[enabled,volume]);
 useEffect(()=>{const a=player.current;if(!a)return;const update=()=>{a.volume=volume*(quiet?.4:1)*((window as any).__tradeNarrating?.22:1);if(!enabled||paused||document.hidden)a.pause();else if(a.paused&&!a.error)a.play().catch(()=>{});};update();const timer=setInterval(update,500);document.addEventListener('visibilitychange',update);window.addEventListener('pointerdown',update);window.addEventListener('keydown',update);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',update);window.removeEventListener('pointerdown',update);window.removeEventListener('keydown',update);};},[track,enabled,volume,paused,quiet]);
 async function toggle(){const a=player.current;if(!a)return;if(enabled&&!error){a.pause();Enabled(false);}else{Error('');Enabled(true);if(a.error)a.load();a.volume=volume;try{if(!paused)await a.play();}catch{Error('음악 버튼을 다시 눌러 주세요.');}}}
 return <div hidden={!controls} className="music-controls"><button title={musicCredits} className={'music-toggle '+(enabled?'playing':'')} onClick={toggle} aria-pressed={enabled}><Music2 size={19}/><span>배경음악 {enabled?'ON':'OFF'}</span></button>{enabled&&<label className="music-volume">음량<input aria-label="배경음악 음량" type="range" min="0" max="1" step=".01" value={volume} onChange={e=>Volume(+e.target.value)}/></label>}{error&&<span className="music-error" role="alert">{error}</span>}</div>;
}
