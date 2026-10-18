// Shared presentation timing; gameplay durations remain owned by the server.
export function studentStageTab(phase:number,lessonActivities=false){
 if(phase===7||phase===2)return lessonActivities===true?'inquiry':'stock';
 if(phase===5)return 'trade';
 if(phase===6)return 'results';
 return 'produce';
}
export function stageRemaining(s:{phase:number;paused?:boolean;left?:number;end?:number;resultEnd?:number},now:number){
 const end=s.phase===6&&s.resultEnd?s.resultEnd:s.end;
 return Math.max(0,Math.ceil((s.paused?(s.left||0):(end||0)-now)/1000));
}
export function celebrationRemaining(s:{phase:number;winners?:number[];celebrationUntil?:number},now:number){
 if(s.phase!==6||!s.winners?.length)return 0;
 return Math.max(0,Math.min(10000,(s.celebrationUntil||0)-now));
}
export function tradeTurnLabel(slot:number,teamSize:number){
 return `${((slot%Math.max(1,teamSize))+Math.max(1,teamSize))%Math.max(1,teamSize)+1}/${Math.max(1,teamSize)}`;
}

export function simulationPollMs(s:any){return s?.simulation&&!s.simulation.mixed?Math.max(150,Math.round(1500/(s.clockSpeed||s.simulation.speed||1))):2000;}
