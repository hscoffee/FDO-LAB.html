import {Gauge,ChevronLeft,ChevronRight} from 'lucide-react';
import {adjacentSimulationSpeed,simulationSpeeds} from '../../lib/content';
import styles from './SimulationSpeedButton.module.css';
export default function SimulationSpeedButton({speed=1,disabled=false,onSpeed}:{speed?:number;disabled?:boolean;onSpeed:(speed:number)=>void}){
 return <div className={'simulation-speed-button '+styles.control} role="group" aria-label="시뮬레이션 배속"><button className={styles.step} disabled={disabled||speed<=simulationSpeeds[0]} aria-label="배속 줄이기" onClick={()=>onSpeed(adjacentSimulationSpeed(speed,-1))}><ChevronLeft size={19}/></button><output className={styles.current} aria-live="polite"><Gauge size={18}/><b>{speed}배속</b></output><button className={styles.step} disabled={disabled||speed>=simulationSpeeds[simulationSpeeds.length-1]} aria-label="배속 올리기" onClick={()=>onSpeed(adjacentSimulationSpeed(speed,1))}><ChevronRight size={19}/></button></div>;
}
