import {newTechnology,recipe,prerequisite,techKeys,techNames,craftedNames,industryNames,developmentScore,researchName,researchDuration,researchEffect,processedItem,storageCapacity,shipLimit,airLimit,competitionScore,creditTrade,itemValue,citySupplyItems,cityUses} from './technology';
import {lessonVoyageMs,routeVoyageMs,flightVoyageMs,tradeVoyageMs} from './routes';
import {lessonScore,maxShipLoad,maxGroupSize,groupSizeTarget,tradeItems,effectiveAircraftCapacity,factoryName,simulationSpeeds,aircraftCapacity,aircraftCost,effectiveShipCapacity,goalOptions,productionItems,maxStudents,quizzes,countries,goods,secondary,specialty,fleetCosts,productionAmount,factoryRequirements,shipRequirements,shipCapacity,voyageMs,shipNames,activeGroups,activeItems,productionPhase} from './content';
// A virtual clock only for the administrator's all-bot simulation.
export function gameNow(s:any):number {const sim=s.simulation;if(s.phase===6&&s.celebrationRealAt!==undefined)return s.endedAt+Date.now()-s.celebrationRealAt;if(sim?._now!==undefined)return sim._now;if(sim?.clockReal!==undefined&&s.paused)return s.pauseAt||sim.clockGame;if(sim?.clockReal!==undefined)return sim.clockGame+(Date.now()-sim.clockReal)*(s.paused?0:(sim.speed||1));return Date.now();}
export function advanceSimulation(s:any){const sim=s.simulation;if(!sim)return;const target=gameNow(s),start=Math.max(sim.processedAt??target,target-1800000);try{for(let at=start+1000;at<=target&&s.phase!==6;at+=1000){sim._now=at;simulateStep(s);}sim._now=target;simulateStep(s);sim.processedAt=target;}finally{delete sim._now;}}
export const zero=()=>Array.from({length:6},()=>[0,0,0,0,0,0]);
export const newGrowth=()=>({factory:1,ship:1,fleet:0,fleetSpent:0,aircraft:0,produced:0,importedTypes:[] as number[],tradeVolume:0,factoryAt:0,shipAt:0});
export function initial(token:string){return {teacher:token,rules:7,lessonVoyageRules:3,traderRules:1,traders:{} as Record<number,string>,goalVersion:30,mode:"lesson",lessonFlow:true,phase:0,end:0,paused:false,left:0,pauseAt:0,duration:300,target:30,roundSeconds:60,lobbyGroups:[0,1,2,3,4,5],players:[] as any[],assignment:[0,1,2,3,4,5],stock:zero(),snap1:zero(),before:zero(),producedRound2:zero(),tradeGain:[0,0,0,0,0,0],growth:Array.from({length:6},newGrowth),offers:[] as any[],shipments:[] as any[],trades:[] as any[],activity:[] as any[],seen:[] as string[]};}
function must(ok:any,msg:string){if(!ok)throw new Error(msg);}
export function normalize(s:any){
 if(s.mode==='competition'){s.technology??=Array.from({length:6},newTechnology);s.lessonFlow=false;
 for(let g=0;g<6;g++){const t=s.technology[g];if(t.version!==2){const legacy=t.crafted||0;t.version=2;t.research=null;t.craftReadyAt=0;s.stock[g][processedItem(s.assignment[g])]=(s.stock[g][processedItem(s.assignment[g])]||0)+legacy;t.processing1=!!t.industry;t.processing2=!!t.automation;t.transport1=!!t.logistics;}for(const field of ['stock','before','snap1','producedRound2'])if(s[field]?.[g])for(let i=0;i<18;i++)s[field][g][i]??=0;t.crafted=s.stock[g][processedItem(s.assignment[g])]||0;}
 }
 if(s.mode==='simulation'&&!s.lessonFlow){s.lessonFlow=true;s.duration=300;s.roundSeconds=60;if(s.phase===3||s.phase===4)s.phase=5;if(s.phase>0&&s.phase!==6)s.end=gameNow(s)+({7:240,1:300,2:240,5:480}[s.phase as 7]||240)*1000;}
 if(s.simulation&&s.players.some((p:any)=>!p.bot)&&!s.simulation.mixed){const at=gameNow(s);s.simulation.mixed=true;s.simulation.speed=1;if(s.simulation.clockReal!==undefined){s.simulation.clockGame=at;s.simulation.clockReal=Date.now();s.simulation.processedAt=at;}}
 s.mode??=s.lessonFlow?"lesson":s.simulation?"simulation":"lesson";
 if(s.mode==="lesson"||s.mode==="simulation"){s.lessonFlow=true;s.duration=300;s.roundSeconds=60;}
 if(!s.simulation&&s.phase===0&&s.rules<4){s.duration=300;s.target=30;s.roundSeconds=60;s.lessonFlow=true;s.rules=4;}
 if(s.goalVersion!==30){s.target=30;s.goalVersion=30;}
 if(!s.traderRules){s.traders={};for(const g of activeGroups(s)){const p=s.players.find((p:any)=>p.group===g&&!p.bot)||s.players.find((p:any)=>p.group===g);if(p)s.traders[g]=p.id;}s.traderRules=1;}
 s.traders??={};s.players.forEach((p:any)=>{if(!p.bot)p.lastSeen??=gameNow(s);});syncTraders(s);
 // Older rooms keep their existing inventory. Historic growth cannot be recovered accurately.
 delete s.canalOpen;delete s.canalOpenedAt;delete s.suezOpen;delete s.suezOpenedAt;s.growth??=Array.from({length:6},newGrowth);s.shipments??=[];s.producedRound2??=zero();s.tradeGain??=[0,0,0,0,0,0];s.activity??=[];s.pauseAt??=0;s.growth.forEach((gr:any,g:number)=>{gr.fleet??=(s.shipments.some((v:any)=>v.group===g)||(s.trades||[]).some((v:any)=>v.group===g))?1:0;gr.fleetSpent??=0;gr.aircraft??=0;});
 if(s.mode!=='competition'&&s.lessonVoyageRules!==3){
  const anchor=s.paused?s.pauseAt:gameNow(s);
  for(const v of s.shipments){if(v.transport==='air'||v.createdBy==='연출 체험'||v.arrivesAt<=anchor)continue;const elapsed=Math.max(0,Math.min(1,(anchor-v.departedAt)/(v.arrivesAt-v.departedAt))),duration=lessonVoyageMs(s.assignment[v.group],s.assignment[v.to],v.shipLevel,v.trips||1);v.departedAt=anchor-elapsed*duration;v.arrivesAt=v.departedAt+duration;}
  s.lessonVoyageRules=3;
 }

}
function record(s:any,group:number,kind:string,text:string,item:number,to?:number){s.activity.unshift({id:crypto.randomUUID(),group,kind,text,item,to,at:gameNow(s)});const counts=new Map<number,number>();s.activity=s.activity.filter((e:any)=>{const n=(counts.get(e.group)||0)+1;counts.set(e.group,n);return n<=8;});}
export function activeSlot(s:any){const remain=s.paused?s.left:s.end-gameNow(s);return Math.max(0,Math.floor(((s.lessonFlow?480000:s.roundSeconds*4000)-remain)/(s.roundSeconds*1000)));}
export function question(p:any,s:any){return (p.seed+p.cursor*7+(s.phase>=4?5:0))%quizzes.length;}
export function upgradeReady(g:any,type:string){if(type==='factory'){const r=factoryRequirements[g.factory];return !!r&&g.produced>=r.production&&g.importedTypes.length>=r.types;}if(type==='ship')return g.ship<3&&g.tradeVolume>=shipRequirements[g.ship];return false;}
export const capacity=(s:any,g:number)=>effectiveShipCapacity(s,g);
export const shipBusy=(s:any,g:number)=>s.shipments.some((v:any)=>v.group===g&&v.transport!=='air');
export const fleetFull=(s:any,g:number)=>s.shipments.filter((v:any)=>v.group===g&&v.transport!=='air').length>=(s.growth[g].fleet??1);
export const aircraftBusy=(s:any,g:number)=>s.shipments.filter((v:any)=>v.group===g&&v.transport==='air').length>=(s.growth[g].aircraft||0);
export function tradeLeader(s:any,g:number){const team=s.players.filter((p:any)=>p.group===g);return team.find((p:any)=>p.id===s.traders?.[g])||team.find((p:any)=>!p.bot)||team[0];}
export function syncTraders(s:any){
 s.traders??={};const now=gameNow(s);
 for(const g of activeGroups(s)){const team=s.players.filter((p:any)=>p.group===g),current=team.find((p:any)=>p.id===s.traders[g]);
 if(!current){delete s.traders[g];if(s.phase>0){const p=team.find((p:any)=>!p.bot)||team[0];if(p)s.traders[g]=p.id;}continue;}
 if(s.phase===0||current.bot||!current.lastSeen||now-current.lastSeen<=45000)continue;
 const next=team.find((p:any)=>p.id!==current.id&&!p.bot&&p.lastSeen&&now-p.lastSeen<=45000);
 if(next){s.traders[g]=next.id;record(s,g,'trader',`${next.name} 학생이 연결이 끊긴 ${current.name} 학생 대신 모둠 대표를 맡습니다.`,specialty[s.assignment[g]]);}
 }
}
export function heartbeat(s:any,token:string){const p=s.players.find((p:any)=>p.token===token);if(p&&!p.bot&&(!p.lastSeen||gameNow(s)-p.lastSeen>=10000+((p.seed||0)%6)*1500))p.lastSeen=gameNow(s);syncTraders(s);}

const score=lessonScore;
function incomingAmount(s:any,g:number,item:number){return s.shipments.reduce((n:number,v:any)=>n+(v.group===g&&v.want===item?v.wantQty:0)+(v.to===g&&v.give===item?v.qty:0),0);}
export function settle(s:any,force=false){
 if((s.paused&&!force)||s.winners?.length)return;
 for(const v of [...s.shipments].sort((a:any,b:any)=>a.arrivesAt-b.arrivesAt)){if(s.mode==='competition'?v.arrivesAt>Math.min(gameNow(s),s.end||gameNow(s)):!force&&v.arrivesAt>Math.min(gameNow(s),s.end||gameNow(s)))continue;
 const beforeA=score(s,v.group),beforeB=score(s,v.to);
 s.stock[v.group][v.want]+=v.wantQty;s.stock[v.to][v.give]+=v.qty;
 if(s.mode==='competition'){creditTrade(s,v.group,v.give,v.qty);creditTrade(s,v.to,v.want,v.wantQty);}
 // Gain includes exports removed on departure and imports added on arrival.
 s.tradeGain[v.group]+=score(s,v.group)-beforeA;s.tradeGain[v.to]+=score(s,v.to)-beforeB;
 for(const [group,item] of [[v.group,v.want],[v.to,v.give]]){const gr=s.growth[group];gr.tradeVolume+=v.qty+v.wantQty;if(!gr.importedTypes.includes(item))gr.importedTypes.push(item);}
 s.trades.unshift({...v,at:gameNow(s)});
 record(s,v.group,'trade',`${v.createdBy||'우리나라'} 학생이 ${countries[s.assignment[v.to]].name}에 ${goods[v.give]} ${v.qty}개를 수출하고 ${goods[v.want]} ${v.wantQty}개를 수입했습니다.`,v.want);
 record(s,v.to,'trade',`${v.acceptedBy} 학생이 ${countries[s.assignment[v.group]].name}에 ${goods[v.want]} ${v.wantQty}개를 수출하고 ${goods[v.give]} ${v.qty}개를 수입했습니다.`,v.give);
 s.shipments=s.shipments.filter((x:any)=>x.id!==v.id);
 checkWinner(s);if(s.winners?.length)break;
 }
}
export function landmarkReady(s:any,g:number){return s.mode!=='competition'&& [1,2,4,5].includes(s.phase)&&(!s.end||gameNow(s)<s.end)&&!s.paused&&activeItems(s).every((i:number)=>s.stock[g][i]-s.offers.filter((o:any)=>o.group===g&&o.give===i).reduce((sum:number,o:any)=>sum+o.qty,0)>=s.target);}
export function finishLesson(s:any,reason='score',winners?:number[]){
 if(s.phase===6&&s.winners?.length)return;
 for(const v of s.shipments){s.stock[v.group][v.give]+=v.qty;s.stock[v.to][v.want]+=v.wantQty??v.qty;}s.shipments=[];
 s.lessonScores=Array.from({length:6},(_,g)=>lessonScore(s,g));
 if(!winners){if(s.landmarks?.length){reason='landmark';winners=[s.landmarks[0]];}else{const groups=activeGroups(s),highest=Math.max(...groups.map(g=>s.lessonScores[g]));winners=groups.filter(g=>s.lessonScores[g]===highest);}}
 const at=gameNow(s);s.winners=winners;s.victoryReason=reason;s.phase=6;s.end=0;s.paused=false;s.offers=[];s.endedAt=at;s.celebrationRealAt=Date.now();s.celebrationUntil=at+10000;s.resultEnd=at+550000;
 for(const g of winners!)record(s,g,'victory',countries[s.assignment[g]].name+' 국가 승리',specialty[s.assignment[g]]);
}
function constructLandmark(s:any,g:number){
 if(s.landmarks?.includes(g))return;
 s.landmarks??=[];s.landmarks.push(g);s.landmarkBuiltAt??={};s.landmarkBuiltAt[g]=gameNow(s);
 record(s,g,'landmark',`${countries[s.assignment[g]].name}가 랜드마크를 건설했습니다!`,s.assignment[g]);
 finishLesson(s,'landmark',[g]);
}
export function checkWinner(s:any){
 // Only virtual students construct automatically; real students press the warehouse button.
 if(s.mode!=='simulation'||s.phase<4||s.phase>5||s.winners?.length)return;
 for(const g of activeGroups(s)){if(!s.players.some((p:any)=>p.group===g&&!p.bot)&&landmarkReady(s,g)){constructLandmark(s,g);break;}}
}

function resumeSimulationClock(s:any){if(s.paused&&s.simulation?.clockReal!==undefined){s.simulation.clockGame=gameNow(s);s.simulation.clockReal=Date.now();}}
function advance(s:any){resumeSimulationClock(s);
 if(s.mode==='competition'){finishCompetition(s);return;}
 if(s.lessonFlow){if(s.phase===7){s.phase=1;s.end=gameNow(s)+s.duration*1000;}else if(s.phase===1){s.snap1=structuredClone(s.stock);s.before=structuredClone(s.stock);s.reportProductionBaseline=structuredClone(s.producedRound2);s.reportTradeStart=s.trades.length;s.phase=2;s.end=gameNow(s)+240000;}else if([2,3,4].includes(s.phase)){s.before=structuredClone(s.stock);s.reportProductionBaseline=structuredClone(s.producedRound2);s.reportTradeStart=s.trades.length;s.phase=5;s.end=gameNow(s)+480000;}else if(s.phase===5){settle(s,gameNow(s)<s.end);if(s.winners?.length)return;finishLesson(s);}s.paused=false;return;}

 if(s.phase===1)s.snap1=structuredClone(s.stock);
 if(s.phase===3){s.stock=zero();s.producedRound2=zero();s.tradeGain=[0,0,0,0,0,0];s.offers=[];s.players.forEach((x:any)=>x.cursor=0);}
 if(s.phase===4)s.before=structuredClone(s.stock);
 if(s.phase===5){settle(s,true);s.offers=[];if(s.winners?.length)return;}
 s.phase++;s.paused=false;s.end=[1,4].includes(s.phase)?gameNow(s)+s.duration*1000:s.phase===5?gameNow(s)+s.roundSeconds*4000:0;
}
export function tick(s:any){normalize(s);completeResearch(s);if(s.phase===6)return;if(s.mode==='competition'&&!s.paused&&s.end&&gameNow(s)>=s.end){finishCompetition(s);return;}settle(s);checkWinner(s);if(!s.paused&&s.end&&gameNow(s)>=s.end)advance(s);}
export function change(s:any,b:any,token:string){
 tick(s);if(b.action==='personalNext'||b.action==='personalPause'){must(s.personalToken===token,'개인 체험에서만 사용할 수 있어요.');return change(s,{action:b.action==='personalNext'?'next':'pause'},s.teacher);}
 const teacher=token===s.teacher,p=s.players.find((x:any)=>x.token===token),a=b.action;
 if(a==='simStudentAction'){must(teacher&&s.simulation,'교사의 시뮬레이션에서만 사용할 수 있어요.');const student=s.players.find((x:any)=>x.id===b.studentId&&x.bot);must(student,'가상 학생을 선택해 주세요.');must(['answer','offer','accept','reject','cancel','recommend','upgrade','buyShip','buyAircraft','buildLandmark','craft','technology','supplyCity','transferTrader','reflection','lessonNote','lessonWorksheet'].includes(b.command),'학생 기능만 사용할 수 있어요.');return change(s,{...(b.args||{}),action:b.command},student.token);}

 if(a==='openCanal'||a==='openSuez')throw new Error('지원하지 않는 기능입니다.');
 if(a==='simLandmark'){must(s.mode!=='competition','경쟁모드에서는 테크트리를 발전시켜요.');must(teacher&&s.mode==='simulation'&&s.simulation&&!s.simulation.mixed,'가상 학생 전용 시뮬레이션에서 체험해 주세요.');landmarkDemo(s);return;}

 if(a==='join'){const existing=s.players.find((x:any)=>x.token===token);if(existing)return;must(!teacher,'교사 화면에서는 학생으로 입장할 수 없어요.');must(s.players.length<maxStudents,`이 방은 학생 ${maxStudents}명까지 입장할 수 있어요.`);must(s.phase!==6,'종료된 게임이에요.');const name=String(b.name||'').trim().slice(0,20);must(name,'이름 또는 번호를 입력해 주세요.');const group=b.group===undefined&&s.phase===0?(activeGroups(s).find(g=>s.players.filter((p:any)=>p.group===g).length<groupSizeTarget(s,g))??activeGroups(s).reduce((a,b)=>s.players.filter((p:any)=>p.group===a).length<=s.players.filter((p:any)=>p.group===b).length?a:b)):Number(b.group);must(Number.isInteger(group)&&group>=0&&group<6,'모둠을 선택해 주세요.');must(activeGroups(s).includes(group),'게임에 참여 중인 모둠을 선택해 주세요.');must(s.players.filter((p:any)=>p.group===group).length<maxGroupSize,'한 모둠은 최대 6명까지 참여할 수 있어요.');s.groupSizes={...(s.groupSizes||{}),[group]:Math.max(groupSizeTarget(s,group),s.players.filter((p:any)=>p.group===group).length+1)};if(b.role==='trader')must(!s.players.some((p:any)=>p.group===group&&p.id===s.traders[group]),'이 모둠의 대표는 이미 정해졌어요. 모든 학생은 무역할 수 있어요.');const id=crypto.randomUUID();s.players.push({id,token,name,group,seed:Math.floor(Math.random()*24),cursor:0,counts:[0,0],reflection:'',lastSeen:gameNow(s)});if(b.role==='trader'||(b.role===undefined&&!s.traders[group]))s.traders[group]=id;return;}

 must(teacher||p,'입장 정보가 없어요. 다시 입장해 주세요.');
 if(['assign','auto','start','addGroup','deleteGroup','next','previous','pause','settings','remove','groupSize','addVirtual','balanceGroups','simulate','simReset','simAuto','simSpeed','simProfile'].includes(a)){
 must(teacher,'교사만 진행할 수 있어요.');
 // A delayed/double click must never advance a newer stage (including timer transitions).
 if(['next','previous'].includes(a)&&b.fromPhase!==undefined&&b.fromPhase!==s.phase)return;
 if(a==='groupSize'){must(s.phase===0,'게임 시작 전에 모둠 정원을 정해 주세요.');const g=Number(b.group),size=Number(b.size);must(activeGroups(s).includes(g)&&Number.isInteger(size)&&size>=1&&size<=maxGroupSize,'모둠과 정원을 확인해 주세요.');s.groupSizes={...(s.groupSizes||{}),[g]:size};return;}
 if(a==='addVirtual'||a==='balanceGroups'){
 must(s.phase===0,'게임 시작 전에 가상 학생을 추가해 주세요.');const groups=activeGroups(s);let additions:number[]=[];
 if(a==='addVirtual'){const g=Number(b.group);must(Number.isInteger(g)&&groups.includes(g),'추가할 모둠을 확인해 주세요.');must(s.players.filter((p:any)=>p.group===g).length<groupSizeTarget(s,g),'이 모둠은 정원이 찼어요. 필요한 경우 모둠 정원을 먼저 바꿔 주세요.');additions=[g];}
 else{must(s.players.every((p:any)=>groups.includes(p.group)),'미배정 학생을 먼저 모둠으로 옮겨 주세요.');for(const g of groups)for(let n=s.players.filter((p:any)=>p.group===g).length;n<groupSizeTarget(s,g);n++)additions.push(g);}
 must(s.players.length+additions.length<=maxStudents,`모둠 인원을 맞추면 ${maxStudents}명을 초과해요. 학생을 옮기거나 모둠을 조정해 주세요.`);
 if(!additions.length)return;
 for(const g of additions){const number=s.players.filter((p:any)=>p.bot).length+1;const bot={id:crypto.randomUUID(),token:crypto.randomUUID(),name:`가상 학생 ${number}`,group:g,seed:Math.floor(Math.random()*24),cursor:0,counts:[0,0],reflection:'',bot:true};s.players.push(bot);if(!s.players.some((p:any)=>p.group===g&&p.id===s.traders[g])){s.traders[g]=(s.players.find((p:any)=>p.group===g&&!p.bot)||bot).id;}}
 s.simulation??={last:0,phase:-1,waitUntil:0,events:[],autoUpgrade:true,mixed:false};s.simulation.mixed=s.players.some((p:any)=>!p.bot);return;
 }
 if(a==='simulate'){if(s.players.some((p:any)=>!p.bot))return change(s,{action:'balanceGroups'},token);must(s.phase===0,'대기실에서 가상 학생을 추가해 주세요.');must(s.players.length<maxStudents,`이미 ${maxStudents}명이 입장했어요.`);populateSimulation(s,s.mode==='simulation'||s.mode==='competition');return;}
 if(a==='simReset'){must(s.simulation,'시뮬레이션 방에서만 다시 할 수 있어요.');const profile=s.simulation.profile||'standard',speed=s.simulation.speed||1,mode=s.mode,target=s.target,seen=s.seen,lobbyGroups=[...activeGroups(s)],groupSizes={...s.groupSizes},humans=s.players.filter((p:any)=>!p.bot).map((p:any)=>({...p,cursor:0,counts:[0,0],reflection:'',worksheet:undefined,worksheetUpdatedAt:undefined,lessonNotes:undefined}));Object.assign(s,initial(s.teacher));s.mode=mode;s.seen=seen;s.lobbyGroups=lobbyGroups;s.groupSizes=groupSizes;s.players=humans;populateSimulation(s,mode==='simulation'||mode==='competition');s.simulation.profile=profile;s.target=target;if(!s.simulation.mixed&&!s.personalToken)s.simulation.speed=speed;change(s,{action:'start'},token);return;}
 if(a==='simSpeed'){must(s.simulation&&!s.simulation.mixed&&!s.personalToken&&s.players.every((p:any)=>p.bot)&&(s.mode==='simulation'||s.simulation.demo),'관리자 가상 학생 시뮬레이션에서만 배속을 바꿀 수 있어요.');const speed=Number(b.speed);must(simulationSpeeds.includes(speed),'지원하지 않는 배속이에요.');const now=gameNow(s);s.simulation.clockGame=now;s.simulation.clockReal=Date.now();s.simulation.processedAt=now;s.simulation.speed=speed;return;}
 if(a==='simProfile'){must(s.simulation&&!s.simulation.mixed&&!s.personalToken,'가상 학생 전용 시뮬레이션에서만 바꿀 수 있어요.');must(['standard','classroom'].includes(b.profile),'지원하지 않는 체험 조건이에요.');s.simulation.profile=b.profile;for(const p of s.players.filter((p:any)=>p.bot))p.nextProductionAt=gameNow(s)+3000+(p.seed%7)*1000;return;}
 if(a==='simAuto'){must(s.simulation,'시뮬레이션 방에서만 조절할 수 있어요.');s.simulation.autoUpgrade=!!b.enabled;return;}
 if(a==='settings'){must(s.phase===0,'대기실에서만 설정할 수 있어요.');s.duration=s.mode==='lesson'?300:Math.max(30,Math.min(600,Number(b.duration)||300));if(b.target!==undefined){const target=Number(b.target);must(goalOptions.includes(target),'목표량은 20·25·30개 중 선택해 주세요.');s.target=target;}s.roundSeconds=s.mode==='lesson'?60:Math.max(15,Math.min(180,Number(b.roundSeconds)||60));}
 if(a==='assign'){must(s.phase!==6,'결과 탐구에서는 모둠을 바꿀 수 없어요.');const x=s.players.find((x:any)=>x.id===b.id),g=Number(b.group);must(x,'학생을 찾지 못했어요.');must(Number.isInteger(g)&&g>=(s.phase===0?-1:0)&&g<6,'모둠을 확인해 주세요.');if(x.group===g)return;if(g>=0&&!b.swapId)must(s.players.filter((p:any)=>p.group===g).length<maxGroupSize,'한 모둠은 최대 6명까지 참여할 수 있어요.');const swap=b.swapId?s.players.find((y:any)=>y.id===b.swapId):null;if(b.swapId){must(swap&&swap.group===g&&swap.id!==x.id&&x.group>=0,'맞바꿀 학생을 확인해 주세요.');swap.group=x.group;}must(g===-1&&s.phase===0||activeGroups(s).includes(g),'참여 중인 모둠으로 옮겨 주세요.');x.group=g;if(g>=0)s.groupSizes={...(s.groupSizes||{}),[g]:Math.max(groupSizeTarget(s,g),s.players.filter((p:any)=>p.group===g).length)};}

 if(a==='addGroup'){must(s.phase===0,'게임 시작 전에 모둠을 추가해 주세요.');const groups=activeGroups(s);must(groups.length<6,'최대 6개 모둠까지 만들 수 있어요.');const g=[0,1,2,3,4,5].find(g=>!groups.includes(g))!;s.lobbyGroups=[...groups,g].sort((a,b)=>a-b);return;}
 if(a==='deleteGroup'){must(s.phase===0,'게임 시작 전에 모둠을 삭제해 주세요.');const groups=activeGroups(s),g=Number(b.group);must(groups.includes(g),'삭제할 모둠을 확인해 주세요.');must(groups.length>1,'최소 1개 모둠은 남겨 주세요.');s.lobbyGroups=groups.filter(x=>x!==g);s.players.forEach((p:any)=>{if(p.group===g)p.group=-1;});return;}
 if(a==='auto'){must(s.phase===0,'게임 시작 전 배정해 주세요.');const groups=activeGroups(s);must(s.players.length<=groups.length*maxGroupSize,'모둠당 최대 6명이 되도록 모둠을 추가해 주세요.');s.players.forEach((x:any,i:number)=>x.group=groups[Math.floor(i*groups.length/s.players.length)]);for(const g of groups){s.groupSizes={...(s.groupSizes||{}),[g]:Math.max(groupSizeTarget(s,g),s.players.filter((p:any)=>p.group===g).length)};const current=s.players.find((p:any)=>p.id===s.traders[g]&&p.group===g),first=s.players.find((p:any)=>p.group===g);if(!current&&first)s.traders[g]=first.id;}}
 if(a==='remove'){must(s.phase===0,'게임 시작 전만 내보낼 수 있어요.');s.players=s.players.filter((x:any)=>x.id!==b.id);if(!s.players.some((p:any)=>p.bot)&&s.mode!=='simulation'&&!s.personalToken)delete s.simulation;}
 if(a==='start'){must(s.phase===0,'이미 시작했어요.');must(s.players.length>0&&s.players.every((x:any)=>x.group>=0&&activeGroups(s).includes(x.group)),'학생을 먼저 모둠에 배정해 주세요.');s.groups=Array.from(new Set(s.players.map((p:any)=>p.group))).sort((a:any,b:any)=>a-b);s.assignment=[0,1,2,3,4,5];for(let i=5;i>0;i--){const j=Math.floor(Math.random()*(i+1));[s.assignment[i],s.assignment[j]]=[s.assignment[j],s.assignment[i]];}s.items=activeItems({...s,items:undefined});s.phase=s.mode==='competition'?5:s.lessonFlow?7:1;syncTraders(s);s.end=gameNow(s)+(s.mode==='competition'?1200:s.lessonFlow?240:s.duration)*1000;if(s.mode==='competition'){s.technology=Array.from({length:6},newTechnology);s.competitionTrade=Array.from({length:6},()=>({value:0,exported:{}}));for(const g of activeGroups(s)){for(const i of activeItems(s))s.stock[g][i]=8;s.stock[g][specialty[s.assignment[g]]]=16;}s.before=structuredClone(s.stock);s.snap1=structuredClone(s.stock);}}
 if(a==='previous'){must(s.mode!=='competition','경쟁모드는 이전 단계가 없어요.');
 const order=s.lessonFlow?[7,1,2,5,6]:[1,2,3,4,5,6],index=order.indexOf(s.phase);must(index>0,'첫 활동에서는 이전 단계가 없어요.');
 if(s.paused){const shift=gameNow(s)-s.pauseAt;for(const v of s.shipments){v.departedAt+=shift;v.arrivesAt+=shift;}}
 resumeSimulationClock(s);s.phase=order[index-1];s.paused=false;s.left=0;s.pauseAt=0;
 const seconds=s.lessonFlow?({7:240,1:s.duration,2:240,5:480} as Record<number,number>)[s.phase]:[1,4].includes(s.phase)?s.duration:s.phase===5?s.roundSeconds*4:0;
 s.end=seconds?gameNow(s)+seconds*1000:0;delete s.victoryReason;delete s.lessonScores;delete s.resultEnd;delete s.winners;delete s.endedAt;delete s.celebrationUntil;delete s.celebrationRealAt;
 if(s.phase!==5)s.offers=[];
 if(s.simulation){s.simulation.phase=-1;s.simulation.last=gameNow(s);s.simulation.waitUntil=gameNow(s)+6000;s.simulation.finished=false;}
 return;
 }
 if(a==='next'){must(s.phase>0&&s.phase!==6,'넘어갈 단계가 없어요.');advance(s);}
 if(a==='pause'){must(s.end>0||s.paused||(s.simulation&&s.phase>0&&s.phase<6),'진행 중인 타이머가 없어요.');if(s.paused){const shift=gameNow(s)-s.pauseAt;for(const v of s.shipments){v.departedAt+=shift;v.arrivesAt+=shift;}if(s.mode==='competition')for(const t of s.technology){if(t.research){t.research.startedAt+=shift;t.research.endsAt+=shift;}t.craftReadyAt=(t.craftReadyAt||0)+shift;}s.end=s.left>0?gameNow(s)+s.left:0;if(s.simulation?.clockReal!==undefined){s.simulation.clockGame=gameNow(s);s.simulation.clockReal=Date.now();}s.paused=false;if(s.simulation){s.simulation.last=gameNow(s);s.simulation.waitUntil=gameNow(s)+6000;}}else{s.left=Math.max(0,s.end-gameNow(s));s.pauseAt=gameNow(s);s.paused=true;}}
 return;}
 if(a==='transferTrader'){
 const next=s.players.find((x:any)=>x.id===b.id),g=next?.group;must(next&&g>=0&&activeGroups(s).includes(g),'같은 모둠 학생을 선택해 주세요.');must(s.phase!==6,'결과 탐구에서는 담당을 바꿀 수 없어요.');must(teacher||(p?.group===g&&tradeLeader(s,g)?.id===p.id),'교사 또는 현재 모둠 대표만 대표 역할을 넘길 수 있어요.');s.traders[g]=next.id;record(s,g,'trader',`${next.name} 학생이 모둠 대표를 맡습니다.`,specialty[s.assignment[g]]);return;
 }
 if(a==='buyAircraft'){
 must(s.mode==='competition'&&s.phase===5&&!s.paused&&s.end>gameNow(s),'경쟁모드 진행 중에만 비행기를 구입할 수 있어요.');
 const g=p?.group;must(p&&g>=0,'학생 화면에서 우리나라를 선택해 주세요.');if(b.group!==undefined)must(Number(b.group)===g,'우리나라 비행기만 구입할 수 있어요.');
 must(s.technology[g]?.aviation,'항공 운송 연구를 먼저 완성하세요.');const gr=s.growth[g];must(gr.aircraft<airLimit(s.technology[g]),'현재 항공기 보유 한도에 도달했어요.');
 const item=specialty[s.assignment[g]],free=s.stock[g][item]-s.offers.filter((o:any)=>o.group===g&&o.give===item).reduce((n:number,o:any)=>n+o.qty,0);must(free>=aircraftCost,`특산물 ${goods[item]} ${aircraftCost}개가 필요해요.`);
 s.stock[g][item]-=aircraftCost;gr.aircraft++;record(s,g,'aircraft',`${countries[s.assignment[g]].name}가 무역 비행기를 구입했습니다. 최대 ${aircraftCapacity}개씩 빠르게 운송합니다.`,item);return;
 }
 if(a==='buyShip'){
 must(!s.paused&&[1,2,4,5].includes(s.phase),'생산·비교·무역 활동에서 구입해 주세요.');
 const g=teacher&&s.simulation?Number(b.group):p?.group;must(Number.isInteger(g)&&g>=0&&g<6&&(p||s.simulation),'우리나라를 선택해 주세요.');if(p&&b.group!==undefined)must(Number(b.group)===p.group,'우리나라만 구입할 수 있어요.');
 const gr=s.growth[g],item=specialty[s.assignment[g]],cost=([5,10,20,25,30][gr.fleet]);must(gr.fleet<(s.mode==='competition'?shipLimit(s.technology[g]):3),'현재 선박 보유 한도에 도달했어요.');must(b.fleet===gr.fleet,'선박 수가 변경됐어요. 최신 상태를 확인하세요.');
 const free=s.stock[g][item]-s.offers.filter((o:any)=>o.group===g&&o.give===item).reduce((n:number,o:any)=>n+o.qty,0);must(free>=cost,`특산물 ${goods[item]} ${cost}개가 필요해요.`);s.stock[g][item]-=cost;gr.fleet++;gr.fleetSpent+=cost;gr.fleetAt=gameNow(s);record(s,g,'fleet',`${countries[s.assignment[g]].name}가 ${goods[item]} ${cost}개로 무역선을 구입했습니다. 보유 ${gr.fleet}척 · 동시 무역 ${gr.fleet}건.`,item);return;
 }
 if(a==='supplyCity'){
 const g=p?.group;must(p&&g>=0&&s.mode==='competition'&&s.phase===5&&!s.paused&&s.end>gameNow(s),'경쟁모드 진행 중에 도시 물자를 공급해 주세요.');if(b.group!==undefined)must(Number(b.group)===g,'우리나라만 발전시킬 수 있어요.');
 const item=Number(b.item);must(Number.isInteger(item)&&citySupplyItems(s,g).includes(item),'다른 나라에서 만든 가공품을 선택해 주세요.');const ci=(item-6)%6,tier=item<12?2:3,t=s.technology[g];t.supplies??={};must((t.supplies[ci]||0)<tier,'이 나라의 같은 단계 물자는 이미 공급했어요.');
 const free=s.stock[g][item]-s.offers.filter((o:any)=>o.group===g&&o.give===item).reduce((n:number,o:any)=>n+o.qty,0);const amount=tier===2?2:1;must(free>=amount,'필요한 가공품을 수입하거나 무역 제안에 묶인 물자를 확인해 주세요.');
 s.stock[g][item]-=amount;t.supplies[ci]=tier;record(s,g,'supply',`${p.name} 학생이 ${goods[item]} ${amount}개를 ${cityUses[ci]}에 공급했습니다. 도시 생활 점수가 올랐습니다.`,item);return;
 }
 if(a==='craft'||a==='technology'){
 const g=p?.group;must(p&&g>=0,'학생 화면에서 우리나라를 선택해 주세요.');const country=s.assignment[g];
 must(s.mode==='competition'&&s.phase===5&&!s.paused&&s.end>gameNow(s),'경쟁 진행 중에만 제작·연구할 수 있어요.');if(b.group!==undefined)must(Number(b.group)===g,'우리나라만 발전시킬 수 있어요.');
 const t=s.technology[g],tier=Number(b.tier||2),key=a==='craft'?(tier===3?'craft3':'craft2'):String(b.key);
 if(a==='craft'){must([2,3].includes(tier),'가공 단계를 확인해 주세요.');must(tier===2?t.processing1:t.processing3,'가공 연구를 먼저 완성해 주세요.');must(gameNow(s)>=(t.craftReadyAt||0),'가공이 끝난 뒤 다시 제작해 주세요.');}
 else{must(techKeys.includes(key as any),'기술을 확인해 주세요.');must(!t[key],'이미 연구한 기술이에요.');must(!t.research,'진행 중인 연구가 끝날 때까지 기다려 주세요.');must(prerequisite(t,key),'먼저 연결된 선행 기술을 완성해 주세요.');must(gameNow(s)+researchDuration(key)<=s.end,'남은 시간이 연구 시간보다 짧아요.');}
 const cost=recipe(country,key,activeItems(s),t);for(let i=0;i<18;i++)must(s.stock[g][i]-s.offers.filter((o:any)=>o.group===g&&o.give===i).reduce((n:number,o:any)=>n+o.qty,0)>=cost.goods[i],'재료가 부족하거나 무역 제안에 사용 중이에요.');
 const item=processedItem(country,tier),amount=tier===3?(t.processing4?2:1):(t.processing3?2:1);if(a==='craft')must(s.stock[g][item]+incomingAmount(s,g,item)+amount<=storageCapacity(t),'창고가 가득 찼어요. 무역하거나 창고를 확장해 주세요.');
 for(let i=0;i<18;i++)s.stock[g][i]-=cost.goods[i];
 if(a==='craft'){s.stock[g][item]+=amount;t.crafted=s.stock[g][processedItem(country)];t.craftReadyAt=gameNow(s)+(t.processing2?8000:12000);record(s,g,'craft',`${p.name} 학생이 ${goods[item]} ${amount}개를 제작했습니다.`,item);}
 else{t.research={key,startedAt:gameNow(s),endsAt:gameNow(s)+researchDuration(key)};record(s,g,'research',`${countries[country].name}가 ${researchName(country,key)} 연구를 시작했습니다.`,specialty[country]);}return;
 }
 if(a==='upgrade'&&s.mode==='competition')throw Error('경쟁모드에서는 테크트리로 시설과 배를 발전시켜요.');
 if(a==='upgrade'){
 must(!s.paused,'잠시 멈춘 상태에서는 업그레이드할 수 없어요.');must(s.phase>=4&&s.phase<=5,'2차 활동 중에 업그레이드해 주세요.');
 const g=teacher&&s.simulation?Number(b.group):p?.group;must(Number.isInteger(g)&&g>=0&&g<6,'우리나라를 선택해 주세요.');must(p||s.simulation,'학생이 직접 업그레이드해 주세요.');if(p&&b.group!==undefined)must(Number(b.group)===p.group,'우리나라만 업그레이드할 수 있어요.');
 const type=b.kind;must(type==='factory'||type==='ship','업그레이드 종류를 확인해 주세요.');const gr=s.growth[g];must(b.level===gr[type],'이미 업그레이드되었어요. 최신 상태를 확인해 주세요.');must(upgradeReady(gr,type),'아직 성장 조건을 채우지 못했어요.');if(type==='ship')must(!shipBusy(s,g),'배가 돌아온 뒤 업그레이드해 주세요.');
 gr[type]++;gr[type+'At']=gameNow(s);record(s,g,'upgrade',type==='factory'?`생산시설이 ${factoryName(s.assignment[g],gr.factory)} (Lv.${gr.factory})로 성장했습니다! 특산물 생산량이 ${productionAmount(s.assignment[g],specialty[s.assignment[g]],gr.factory)}개가 되었습니다.`:`${shipNames[gr.ship-1]}으로 업그레이드했습니다! 최대 ${capacity(s,g)}개를 실을 수 있습니다.`,specialty[s.assignment[g]]);return;
 }
 if(a==='lessonWorksheet'){
 must(p&&p.group>=0,'학생으로 입장해 주세요.');must(s.mode!=='competition'&&s.phase===6,'결과 탐구 시간에 작성해 주세요.');
 const worksheet:any={};for(const key of ['conditions','exchange','necessity'])worksheet[key]=String(b[key]||'').trim().slice(0,240);
 must(Object.values(worksheet).some(Boolean),'생각을 먼저 적어 주세요.');p.worksheet=worksheet;p.worksheetUpdatedAt=gameNow(s);p.reflection=[worksheet.conditions,worksheet.exchange,worksheet.necessity].filter(Boolean).join('\n');return;
 }
 if(a==='lessonNote'){
 must(p&&p.group>=0,'학생으로 입장해 주세요.');must(s.mode!=='competition'&&[7,1,2,5].includes(s.phase),'활동 시간에 기록해 주세요.');must(Number(b.phase)===s.phase,'단계가 바뀌었어요. 현재 활동을 확인해 주세요.');
 const data:any={text:String(b.text||'').trim().slice(0,240)};
 for(const key of ['expected','give','want'])if(b[key]!==undefined&&b[key]!==''){const item=Number(b[key]);must(Number.isInteger(item)&&activeItems(s).includes(item),'참여하는 물자를 선택해 주세요.');data[key]=item;}
 if(b.condition!==undefined&&b.condition!==''){const condition=Number(b.condition);must(Number.isInteger(condition)&&condition>=0&&condition<4,'생산 조건을 확인해 주세요.');data.condition=condition;}
 if(b.partner!==undefined&&b.partner!==''){const partner=Number(b.partner);must(activeGroups(s).includes(partner)&&partner!==p.group,'다른 나라를 선택해 주세요.');data.partner=partner;}
 must(data.give===undefined||data.want===undefined||data.give!==data.want,'보낼 물자와 필요한 물자를 구분해 주세요.');
 p.lessonNotes={...(p.lessonNotes||{}),[s.phase]:{...data,at:gameNow(s)}};return;
 }
 must(p,'학생으로 입장해 주세요.');must(!s.paused,'선생님이 잠시 멈췄어요.');const g=p.group;must(g>=0,'모둠 배정을 기다려 주세요.');const country=s.assignment[g];
 if(a==='buildLandmark'){if(b.group!==undefined)must(Number(b.group)===g,'우리나라의 랜드마크만 건설할 수 있어요.');if(s.landmarks?.includes(g))return;must(landmarkReady(s,g),`사용 가능한 물자 ${activeItems(s).length}종을 각각 ${s.target}개 모아 주세요.`);constructLandmark(s,g);return;}
 if(a==='answer'){must(productionPhase(s),'지금은 생산 시간이 아니에요.');must(b.cursor===p.cursor,'이미 처리한 문제예요.');const q=quizzes[question(p,s)];must(Number.isInteger(b.answer)&&b.answer>=0&&b.answer<q[1].length,'답 하나를 선택해 주세요.');const item=Number(b.item);must(Number.isInteger(item)&&productionItems(s,country).includes(item),s.lessonFlow&&s.phase===5?'무역 단계에서는 우리나라의 특산물만 생산해요.':'게임에 참여하는 품목을 선택해 주세요.');if(b.answer!==q[2]){p.lastAnswer={cursor:p.cursor,item,amount:0,correct:false,correctText:q[1][q[2]],explanation:q[3],at:gameNow(s)};p.cursor++;return;}const nominal=productionAmount(country,item,s.growth[g].factory,s.mode==='competition'),amount=s.mode==='competition'?Math.min(nominal,Math.max(0,storageCapacity(s.technology[g])-s.stock[g][item]-incomingAmount(s,g,item))):nominal;must(amount>0,'창고가 가득 찼어요. 물자를 사용하거나 수출해 주세요.');s.stock[g][item]+=amount;s.growth[g].produced+=amount;if(s.phase>=4)s.producedRound2[g][item]+=amount;p.lastProduction={cursor:p.cursor,item,amount,explanation:q[3],at:gameNow(s)};p.lastAnswer={...p.lastProduction,correct:true,correctText:q[1][q[2]]};p.cursor++;p.counts[s.phase===1?0:1]++;record(s,g,'production',`${p.name} 학생이 ${goods[item]} ${amount}개를 생산했습니다.`,item);checkWinner(s);return;}
 if(a==='reflection'){must(s.phase===6,'결과 발표 시간에 작성해 주세요.');p.reflection=String(b.text||'').slice(0,1000);return;}
 if(a==='recommend'){must(s.phase===5,'무역 시간이 아니에요.');const o=s.offers.find((x:any)=>x.id===b.id);must(o&&o.group!==g,'추천할 제안을 확인해 주세요.');if(!o.recs.includes(p.id))o.recs.push(p.id);return;}
 must(s.phase===5,'지금은 무역 시간이 아니에요.');must(activeGroups(s).includes(g),'참여 중인 우리 모둠에서 거래해 주세요.');
 const available=(group:number,item:number)=>s.stock[group][item]-s.offers.filter((o:any)=>o.group===group&&o.give===item).reduce((n:number,o:any)=>n+o.qty,0);
 if(a==='offer'){const transport=b.transport??'ship';must(transport==='ship'||transport==='air','운송 수단을 확인해 주세요.');if(transport==='air'){must(s.mode==='competition'&&s.growth[g].aircraft>0,'경쟁모드에서 무역 비행기를 먼저 구입하세요.');must(!aircraftBusy(s,g),'비행기가 돌아온 뒤 제안해 주세요.');}else must(s.growth[g].fleet>0,'먼저 무역선을 구입해 주세요.');const to=Number(b.to);must(Number.isInteger(to)&&to>=0&&to<6&&to!==g&&activeGroups(s).includes(to),'거래할 상대 나라를 선택해 주세요.');const give=Number(b.give),want=Number(b.want),qty=Number(b.qty),wantQty=Number(b.wantQty??b.qty);must([give,want].every(i=>Number.isInteger(i)&&tradeItems(s).includes(i))&&give!==want,'서로 다른 품목을 선택해 주세요.');must([qty,wantQty].every(n=>Number.isInteger(n)&&n>=1&&n<=maxShipLoad),'한 번에 1~10개를 제안할 수 있어요.');if(transport==='air')must(qty<=effectiveAircraftCapacity(s,g)&&wantQty<=effectiveAircraftCapacity(s,g),`비행기는 보내기·받기 각각 최대 ${effectiveAircraftCapacity(s,g)}개만 운반해요.`);must(s.offers.filter((o:any)=>o.group===g).length<3,'대기 제안은 세 건까지예요.');must(available(g,give)>=qty,'교환에 사용할 물자가 부족해요.');must(available(to,want)>=wantQty,'상대 나라의 교환 가능한 물자가 부족해요.');s.offers.push({id:crypto.randomUUID(),group:g,to,give,want,qty,wantQty,transport,recs:[],createdAt:gameNow(s),createdBy:p.name});return;}
 const o=s.offers.find((x:any)=>x.id===b.id);must(o,'이미 처리되거나 취소된 제안이에요.');o.wantQty??=o.qty;
 if(a==='cancel'){must(o.group===g,'우리나라 제안만 취소할 수 있어요.');s.offers=s.offers.filter((x:any)=>x.id!==o.id);return;}
 if(a==='reject'){must(o.to===g,'우리나라에 온 제안만 거절할 수 있어요.');s.offers=s.offers.filter((x:any)=>x.id!==o.id);record(s,o.group,'rejection',`${countries[s.assignment[g]].name}가 우리나라의 무역 제안을 거절했습니다.`,o.give);return;}
 if(a==='accept'){must([o.qty,o.wantQty].every((n:number)=>Number.isInteger(n)&&n>=1&&n<=maxShipLoad),'배에 실을 수 있는 최대 무역량은 10개예요.');must(o.to===g,'우리나라에 온 제안만 수락할 수 있어요.');must(o.group!==g,'다른 나라와 교환해 주세요.');const air=o.transport==='air';if(air){must(s.mode==='competition'&&s.growth[o.group].aircraft>0,'상대 나라의 비행기가 없어요.');must(o.qty<=effectiveAircraftCapacity(s,o.group)&&o.wantQty<=effectiveAircraftCapacity(s,o.group),'비행기의 적재량을 초과했어요.');must(!aircraftBusy(s,o.group),'상대 나라의 비행기가 운송 중이에요.');}else must(!fleetFull(s,o.group),'상대 나라의 사용 가능한 무역선이 없어요. 구입하거나 귀항을 기다려 주세요.');must(available(g,o.want)>=o.wantQty,'교환에 사용할 물자가 부족해요.');must(s.stock[o.group][o.give]>=o.qty,'상대 나라의 물자가 부족해요.');if(s.mode==='competition'){const arriving=(who:number,item:number)=>s.shipments.reduce((n:number,v:any)=>n+(v.group===who&&v.want===item?v.wantQty:0)+(v.to===who&&v.give===item?v.qty:0),0);must(s.stock[g][o.give]+arriving(g,o.give)+o.qty<=storageCapacity(s.technology[g]),'받는 나라 창고의 여유 공간이 부족해요.');must(s.stock[o.group][o.want]+arriving(o.group,o.want)+o.wantQty<=storageCapacity(s.technology[o.group]),'제안한 나라 창고의 여유 공간이 부족해요.');}
 const scoreA=score(s,o.group),scoreB=score(s,g);s.stock[o.group][o.give]-=o.qty;s.stock[g][o.want]-=o.wantQty;s.tradeGain[o.group]+=score(s,o.group)-scoreA;s.tradeGain[g]+=score(s,g)-scoreB;
 const shipLevel=s.growth[o.group].ship,trips=air?1:Math.ceil(Math.max(o.qty,o.wantQty)/capacity(s,o.group));const shipSlot=air?-1:Array.from({length:s.growth[o.group].fleet},(_,i)=>i).find(i=>!s.shipments.some((v:any)=>v.group===o.group&&v.transport!=='air'&&(v.shipSlot??0)===i))!;const airSlot=air?Array.from({length:s.growth[o.group].aircraft},(_,i)=>i).find(i=>!s.shipments.some((v:any)=>v.group===o.group&&v.transport==='air'&&(v.airSlot??0)===i)):-1;const v={...o,to:g,acceptedBy:p.name,shipSlot,airSlot,shipLevel,trips,capacity:air?effectiveAircraftCapacity(s,o.group):capacity(s,o.group),departedAt:gameNow(s),arrivesAt:gameNow(s)+tradeVoyageMs(s.assignment[o.group],s.assignment[g],shipLevel,trips,air,s.mode==='competition'&&!!s.technology[o.group]?.transport1,s.mode)};s.shipments.push(v);s.offers=s.offers.filter((x:any)=>x.id!==o.id);
 record(s,o.group,'shipping',`${air?'무역 비행기가':shipNames[shipLevel-1]+'이'} ${goods[o.give]} ${o.qty}개를 싣고 ${countries[s.assignment[g]].name}로 ${air?'이륙':'출항'}했습니다.`,o.give,g);record(s,g,'shipping',`${p.name} 학생이 교환을 수락했습니다. ${goods[o.give]} ${o.qty}개가 운송 중입니다.`,o.give);return;}
 throw new Error('알 수 없는 요청이에요.');
}
export function view(s:any,token:string,previewId?:string){normalize(s);const p=s.players.find((x:any)=>x.token===token),teacher=token===s.teacher;if(!teacher&&!p)throw new Error('입장 정보가 만료되었어요.');const out=structuredClone(s);out.tradeStatus=s.stock.map((_:number[],g:number)=>({pending:s.offers.filter((o:any)=>o.group===g||o.to===g).length}));out.availableStock=s.stock.map((row:number[],g:number)=>row.map((n:number,i:number)=>Math.max(0,n-s.offers.filter((o:any)=>o.group===g&&o.give===i).reduce((sum:number,o:any)=>sum+o.qty,0))));delete out.teacher;delete out.seen;out.personal=s.personalToken===token;delete out.personalToken;out.players.forEach((x:any)=>{delete x.token;delete x.seed;if(!teacher&&x.id!==p?.id){delete x.reflection;delete x.lessonNotes;delete x.worksheet;delete x.worksheetUpdatedAt;}});if(!teacher&&p)out.offers=out.offers.filter((o:any)=>o.group===p.group||o.to===p.group);out.me=p?.id||null;out.isTeacher=teacher;out.serverNow=gameNow(s);out.serverRealNow=Date.now();out.clockSpeed=s.phase===6&&s.celebrationRealAt!==undefined?1:(s.simulation?.speed||1);out.slot=activeSlot(s);out.growth.forEach((gr:any)=>{gr.factoryReady=s.mode!=='competition'&&upgradeReady(gr,'factory');gr.shipReady=s.mode!=='competition'&&upgradeReady(gr,'ship');});if(p&&[1,4,5].includes(s.phase)){const q=quizzes[question(p,s)];out.quiz={text:q[0],options:q[1],cursor:p.cursor};}if(teacher&&s.simulation){const student=s.players.find((x:any)=>x.bot&&x.id===previewId)||s.players.find((x:any)=>x.bot);if(student)out.studentPreview=view(s,student.token);}return out;}
export function populateSimulation(s:any,accelerated=true){const names=['민준','서연','도윤','하린','지호','수아','서준','지우','예준','하윤','시우','서아','주원','지민','준우','다은','도현','예린','건우','소율','우진','채원','현우','유나','태윤','나은','수현','은우','유준','서윤'];const humans=s.players.filter((p:any)=>!p.bot),groups=activeGroups(s);must(groups.reduce((n,g)=>n+Math.max(groupSizeTarget(s,g),humans.filter((p:any)=>p.group===g).length),0)<=maxStudents,`설정한 모둠 정원의 합계가 ${maxStudents}명을 넘어요. 정원을 조정해 주세요.`);s.players=[...humans];for(const p of humans)if(!groups.includes(p.group))p.group=groups.reduce((a,b)=>s.players.filter((p:any)=>p.group===a).length<=s.players.filter((p:any)=>p.group===b).length?a:b);for(const g of groups){const missing=Math.max(0,groupSizeTarget(s,g)-s.players.filter((p:any)=>p.group===g).length);for(let n=0;n<missing;n++){const i=s.players.filter((p:any)=>p.bot).length;s.players.push({id:crypto.randomUUID(),token:crypto.randomUUID(),name:`AI ${i+1} ${names[i%names.length]}`,group:g,seed:i,cursor:0,counts:[0,0],reflection:'',bot:true});}}if(s.mode!=='competition')s.mode=accelerated?'simulation':'lesson';s.lessonFlow=s.mode!=='competition';s.duration=300;s.roundSeconds=60;for(const g of activeGroups(s)){if(!s.players.some((p:any)=>p.group===g&&p.id===s.traders[g])){const p=s.players.find((p:any)=>p.group===g&&!p.bot)||s.players.find((p:any)=>p.group===g);if(p)s.traders[g]=p.id;}}s.simulation={last:0,phase:-1,waitUntil:0,events:[],autoUpgrade:true,demo:accelerated&&!humans.length,mixed:humans.length>0,speed:1,...(accelerated&&!humans.length?{clockReal:Date.now(),clockGame:gameNow(s),processedAt:gameNow(s)}:{})};}
export function simulateStep(s:any){
 normalize(s);if(s.mode==='competition'){competitionBots(s);return;}const sim=s.simulation;if(!sim||s.paused||s.phase===0)return;const now=gameNow(s);if(now-sim.last<1800)return;sim.last=now;tick(s);
 const log=(text:string)=>{sim.events.unshift({id:crypto.randomUUID(),text,at:now});sim.events=sim.events.slice(0,18);};
 if(sim.phase!==s.phase){sim.phase=s.phase;sim.waitUntil=now+6000;}
 const productionOpen=(productionPhase(s)&&now<s.end)||(!s.lessonFlow&&s.phase===5&&!sim.landmarkDemo);
 if(productionOpen){let n=0;for(const p of s.players.filter((p:any)=>p.bot)){
  if(![1,4,5].includes(s.phase))break;
  if(!p.nextProductionAt){p.nextProductionAt=now+1000+(p.seed%8)*750;continue;}if(now<p.nextProductionAt)continue;
  const g=p.group,ci=s.assignment[g],main=specialty[ci],row=s.stock[g],cycle=(p.cursor+p.seed)%5;
  const deficits=activeItems(s).sort((a,b)=>(row[a]+((a+p.seed)%6)*.05)-(row[b]+((b+p.seed)%6)*.05));
  // Different students alternate specialty, secondary and low-stock goods.
  let item=deficits[0];
  if(s.phase!==1){const second=activeItems(s).includes(secondary[ci])?secondary[ci]:main;if(cycle<2&&row[main]<s.target+50)item=main;else if(cycle===2&&row[second]<s.target+8)item=second;}
  if(s.lessonFlow&&s.phase===5)item=main;
  const q=quizzes[question(p,s)],answer=(p.cursor+p.seed)%(sim.profile==='classroom'?5:13)===(sim.profile==='classroom'?4:12)?(q[2]+1)%4:q[2];
  tick(s);if(!productionPhase(s))break;change(s,{action:'answer',cursor:p.cursor,item,answer},p.token);p.nextProductionAt=now+(sim.profile==='classroom'?20000+((p.seed+p.cursor*3)%16)*1000:12000+((p.seed+p.cursor*3)%7)*1000);n++;
 }if(n)log(`${n}명이 생산 조건과 부족한 물자를 보고 기후 문제를 풀었어요.`);}
 tick(s);if(sim.phase!==s.phase){sim.phase=s.phase;sim.waitUntil=now+6000;}
 if(!s.lessonFlow&&!s.personalToken&&[2,3].includes(s.phase)&&now>=sim.waitUntil){change(s,{action:'next'},s.teacher);sim.phase=s.phase;sim.waitUntil=now+6000;return;}
 if(s.phase===5&&!sim.landmarkDemo){
 const leader=(g:number)=>tradeLeader(s,g);
 const free=(g:number,i:number)=>s.stock[g][i]-s.offers.filter((o:any)=>o.group===g&&o.give===i).reduce((n:number,o:any)=>n+o.qty,0);
 // Different decision timing exposes different growth paths, without bonuses by country.
 for(const g of activeGroups(s)){const gr=s.growth[g],main=specialty[s.assignment[g]];if(leader(g)?.bot&&gr.fleet<3&&free(g,main)>=fleetCosts[gr.fleet]+s.target){change(s,{action:'buyShip',group:g,fleet:gr.fleet},leader(g).token);}
 if(leader(g)?.bot&&sim.autoUpgrade!==false&&Math.floor(now/2000)%(2+g%3)===0){for(const kind of (g%2?['ship','factory']:['factory','ship'])){if(upgradeReady(gr,kind)&&!(kind==='ship'&&shipBusy(s,g))){change(s,{action:'upgrade',kind,level:gr[kind],group:g},leader(g).token);log(`${countries[s.assignment[g]].name}의 가상 학생이 ${kind==='factory'?'생산시설':'무역선'}을 업그레이드했어요.`);}}}
 }
 if(s.phase!==5)return;
 for(const o of [...s.offers]){const to=o.to;if(!leader(to)?.bot||to===o.group||fleetFull(s,o.group))continue;if(sim.profile==='classroom'){const lead=leader(to);if(now-o.createdAt<2000+(lead.seed%7)*1000)continue;if((lead.seed+o.qty+(o.wantQty??o.qty)+Math.floor(o.createdAt/1000))%10===0){change(s,{action:'reject',id:o.id},lead.token);continue;}}const needed=s.target-s.stock[to][o.give];if(needed>0&&free(to,o.want)>=(o.wantQty??o.qty)+s.target){if(now<(sim.nextDepartureAt||0))continue;change(s,{action:'accept',id:o.id},leader(to).token);sim.nextDepartureAt=now+4500+(o.group%3)*900;break;}else if(needed<=0&&leader(o.group)?.bot){change(s,{action:'cancel',id:o.id},leader(o.group).token);}}

 for(let g=0;g<6;g++){if(!leader(g)?.bot||fleetFull(s,g)||s.offers.some((o:any)=>o.group===g))continue;const ci=specialty[s.assignment[g]];for(let k=1;k<6;k++){const item=(ci+k)%6;if(!activeItems(s).includes(item))continue;const peer=s.assignment.findIndex((country:number)=>specialty[country]===item);const incoming=s.shipments.filter((v:any)=>(v.group===g&&v.want===item)||(v.to===g&&v.give===item)).reduce((n:number,v:any)=>n+(v.group===g?v.wantQty:v.qty),0);const need=s.target-s.stock[g][item]-incoming;const peerNeed=s.target-s.stock[peer][ci];const qty=Math.min(capacity(s,g),need,peerNeed,free(g,ci)-s.target,free(peer,item)-s.target);if(activeGroups(s).includes(peer)&&qty>0){change(s,{action:'offer',to:peer,give:ci,want:item,qty},leader(g).token);break;}}}
 }
 if(s.phase===6){for(const p of s.players){if(p.bot&&!p.reflection){const ci=s.assignment[p.group];p.reflection=`${countries[ci].name}는 ${goods[specialty[ci]]} 생산에 유리한 조건을 활용했어요. 필요한 물자를 수입하고 생산시설과 배를 발전시켰어요. (가상 학생 예시)`;}}if(!sim.finished){sim.finished=true;log('성장 시뮬레이션 완료! 지도와 나라별 성장 기록을 비교해 보세요.');}}
}

export function personalGame(token:string){const s:any=initial(crypto.randomUUID());change(s,{action:'join',name:'나'},token);populateSimulation(s,false);s.lessonFlow=true;s.duration=300;s.roundSeconds=60;s.target=30;s.personalToken=token;s.simulation.autoUpgrade=false;change(s,{action:'start'},s.teacher);return s;}

// Explicit demonstration fixture: never used in a real or mixed student room.
export function landmarkDemo(s:any){
 if(!s.simulation||s.simulation.mixed||s.personalToken)throw Error('가상 학생 전용 체험이에요.');
 delete s.winners;delete s.landmarks;delete s.landmarkBuiltAt;delete s.endedAt;delete s.celebrationUntil;delete s.celebrationRealAt;
 s.phase=5;s.paused=false;s.end=gameNow(s)+30000;s.offers=[];s.shipments=[];s.simulation.landmarkDemo=true;s.simulation.finished=false;
 const g=0,to=1,country=s.assignment[g],ci=specialty[country],item=specialty[s.assignment[to]];s.growth[g].fleet=Math.max(1,s.growth[g].fleet);s.stock[g]=Array(6).fill(s.target);s.stock[g][item]=s.target-1;s.stock[g][ci]=s.target+1;
 s.stock[to][item]=Math.max(s.stock[to][item],s.target+1);s.stock[g][ci]--;s.stock[to][item]--;
 s.shipments.push({id:crypto.randomUUID(),group:g,to,give:ci,want:item,qty:1,wantQty:1,shipLevel:s.growth[g].ship,trips:1,departedAt:gameNow(s),arrivesAt:gameNow(s)+6000,createdBy:'연출 체험',acceptedBy:'가상 학생'});
 record(s,g,'shipping',`${countries[country].name}의 무역선이 마지막 물자를 싣고 출항했습니다. (랜드마크 연출용 물자 배치)`,ci,to);
}

export function competitionGame(token:string,personal=false){const s:any=initial(personal?crypto.randomUUID():token);s.mode='competition';s.lessonFlow=false;s.technology=Array.from({length:6},newTechnology);if(personal){change(s,{action:'join',name:'나',group:0,role:'trader'},token);s.personalToken=token;populateSimulation(s,false);change(s,{action:'start'},s.teacher);}return s;}
function completeResearch(s:any){if(s.mode!=='competition'||s.paused||s.phase!==5)return;for(const g of activeGroups(s)){const t=s.technology[g],r=t.research;if(!r||r.endsAt>Math.min(gameNow(s),s.end))continue;t[r.key]=true;t.builtAt[r.key]=r.endsAt;t.research=null;const ci=s.assignment[g];if(r.key==='processing1'){s.growth[g].factory=2;t.industry=true;}if(r.key==='processing4'){s.growth[g].factory=3;t.automation=true;t.metropolis=true;s.landmarks??=[];if(!s.landmarks.includes(g))s.landmarks.push(g);s.landmarkBuiltAt??={};s.landmarkBuiltAt[g]=gameNow(s);}if(r.key==='storage2')t.city=true;if(r.key==='transport2'){s.growth[g].ship=2;s.growth[g].shipAt=gameNow(s);t.logistics=true;}if(r.key==='aviation'){s.growth[g].aircraft=Math.max(1,s.growth[g].aircraft);record(s,g,'aircraft',`${countries[ci].name}가 첫 무역 비행기 1대를 확보했습니다.`,specialty[ci]);}record(s,g,'technology',`${countries[ci].name}가 ${researchName(ci,r.key)} 연구를 완료했습니다. ${researchEffect(ci,r.key)}`,specialty[ci]);s.activity[0].voiceKind=['transport1','transport2','network'].includes(r.key)?'ship':'factory';}}
function finishCompetition(s:any){if(s.phase===6)return;settle(s);for(const v of s.shipments){s.stock[v.group][v.give]+=v.qty;s.stock[v.to][v.want]+=v.wantQty;}s.shipments=[];s.phase=6;s.endedAt=gameNow(s);s.celebrationRealAt=Date.now();s.celebrationUntil=s.endedAt+10000;s.end=0;s.paused=false;s.offers=[];const groups=activeGroups(s),highest=Math.max(...groups.map(g=>competitionScore(s,g).total));s.winners=groups.filter(g=>competitionScore(s,g).total===highest);s.competitionFinished=true;}
function competitionBots(s:any){const sim=s.simulation;if(!sim||s.paused||s.phase!==5)return;const now=gameNow(s);if(now-sim.last<2500)return;sim.last=now;tick(s);if(s.phase!==5)return;
 const free=(g:number,i:number)=>s.stock[g][i]-s.offers.filter((o:any)=>o.group===g&&o.give===i).reduce((n:number,o:any)=>n+o.qty,0);
 const attempt=(action:string,args:any,p:any)=>{try{change(s,{action,...args},p.token);return true;}catch{return false;}};
 for(const p of s.players.filter((p:any)=>p.bot)){if(now<(p.nextProductionAt||0))continue;const q=quizzes[question(p,s)],g=p.group,ci=s.assignment[g],main=specialty[ci],t=s.technology[g];let item=main;
 if(p.seed%5>=3&&free(g,main)>=16){const next=techKeys.find(k=>!t[k]&&prerequisite(t,k)),need=next?recipe(ci,next,activeItems(s),t).goods:Array(18).fill(0);if(t.processing1){const craft=recipe(ci,'craft2',activeItems(s),t).goods;for(const i of activeItems(s))need[i]+=craft[i]*2;}const raw=activeItems(s).filter(i=>i!==main&&need[i]>free(g,i)+incomingAmount(s,g,i)).sort((a,b)=>(need[b]-free(g,b))/productionAmount(ci,b)-(need[a]-free(g,a))/productionAmount(ci,a));if(raw.length)item=raw[0];}
 attempt('answer',{cursor:p.cursor,item,answer:sim.profile==='classroom'&&(p.cursor+p.seed)%5===4?(q[2]+1)%4:q[2]},p);p.nextProductionAt=now+(sim.profile==='classroom'?20000+((p.seed+p.cursor*3)%16)*1000:12000+(p.seed%5)*1000);}
 for(const g of activeGroups(s)){const lead=tradeLeader(s,g);if(!lead?.bot)continue;const ci=s.assignment[g],main=specialty[ci],t=s.technology[g],order=ci===1?['transport1','processing1','storage1','processing2','transport2','aviation','processing3','storage2','network','processing4','storage3']:ci===4||ci===5?['processing1','transport1','processing2','storage1','aviation','processing3','storage2','processing4','transport2','network','storage3']:['processing1','transport1','processing2','storage1','aviation','processing3','storage2','processing4','transport2','network','storage3'];
 const key=order.find(k=>!t[k]&&prerequisite(t,k))||null,cost=key?recipe(ci,key,activeItems(s),t):{goods:Array(18).fill(0)};
 if(key&&!t.research&&cost.goods.every((n:number,i:number)=>free(g,i)>=n))attempt('technology',{key},lead);
 if(t.processing1&&now>=(t.craftReadyAt||0)){
  const tier=t.processing3&&free(g,processedItem(ci))>=6&&(free(g,processedItem(ci,3))<8||key&&cost.goods[processedItem(ci,3)]>free(g,processedItem(ci,3)))?3:2;
  const item=processedItem(ci,tier),craft=recipe(ci,'craft'+tier,activeItems(s),t),needsSample=free(g,item)<(cost.goods[item]||0);
  if(free(g,item)<12&&(needsSample||craft.goods.every((n:number,i:number)=>!n||free(g,i)>=n+Math.min(2,cost.goods[i]||0))))attempt('craft',{tier},lead);
 }
 if(s.growth[g].fleet<shipLimit(t)&&free(g,main)>=([5,10,20,25,30][s.growth[g].fleet])+6)attempt('buyShip',{fleet:s.growth[g].fleet},lead);
 for(const item of citySupplyItems(s,g)){const tier=item<12?2:3,producer=(item-6)%6;if((t.supplies?.[producer]||0)<tier&&free(g,item)>=(cost.goods[item]||0)+(tier===2?2:1))attempt('supplyCity',{item},lead);}
 if(s.offers.filter((o:any)=>o.group===g).length>=2)continue;const air=s.growth[g].aircraft&&!aircraftBusy(s,g)&&(sim.lastTransport?.[g]!=='air'||fleetFull(s,g));if(!air&&(!s.growth[g].fleet||fleetFull(s,g)))continue;
 const needs=[...cost.goods];for(const item of citySupplyItems(s,g)){const tier=item<12?2:3,producer=(item-6)%6;if((t.supplies?.[producer]||0)<tier&&(tier===2||t.processing3))needs[item]=Math.max(needs[item],tier===2?2:1);}for(const i of activeItems(s)){if(i!==main)needs[i]=Math.max(needs[i],4);}
 // Obtain the raw inputs for our own samples; asking to import our own product
 // stalls every producer before it can supply the other countries.
 if(t.processing1&&free(g,processedItem(ci))<12){const rawCost=recipe(ci,'craft2',activeItems(s),t).goods;rawCost.forEach((n:number,i:number)=>{needs[i]+=n*2;});}
 if(t.processing3&&free(g,processedItem(ci,3))<(cost.goods[processedItem(ci,3)]||0)){const rawCost=recipe(ci,'craft3',activeItems(s),t).goods;rawCost.forEach((n:number,i:number)=>{needs[i]+=n*2;});}
 const deficit=(i:number)=>needs[i]-free(g,i)-incomingAmount(s,g,i)-s.offers.filter((o:any)=>o.group===g&&o.want===i).reduce((n:number,o:any)=>n+o.wantQty,0);
 const wantedItems=tradeItems(s).filter(i=>i!==main&&i!==processedItem(ci)&&i!==processedItem(ci,3)&&deficit(i)>0).sort((a,b)=>deficit(b)-deficit(a));
 let proposed=false;
 for(const useAir of (air?[true,false]:[false])){if(!useAir&&(!s.growth[g].fleet||fleetFull(s,g)))continue;
 const limit=useAir?effectiveAircraftCapacity(s,g):Math.min(10,capacity(s,g));
 for(const wanted of wantedItems){
 const peers=activeGroups(s).filter(x=>x!==g&&free(x,wanted)>0).sort((a,b)=>free(b,wanted)-free(a,wanted));

 for(const peer of peers){for(const offered of [main,processedItem(ci),processedItem(ci,3)]){
 const availableGive=free(g,offered)-Math.max(cost.goods[offered]||0,offered===main?6:1),roomGive=storageCapacity(s.technology[peer])-s.stock[peer][offered]-incomingAmount(s,peer,offered);
 const wantQty=Math.min(limit,free(peer,wanted),Math.ceil(deficit(wanted)),Math.floor(Math.min(limit,availableGive,roomGive)*itemValue(offered)/itemValue(wanted))),qty=Math.ceil(wantQty*itemValue(wanted)/itemValue(offered));
 if(qty>0&&wantQty>0&&attempt('offer',{to:peer,give:offered,want:wanted,qty,wantQty,transport:useAir?'air':'ship'},lead)){proposed=true;break;}
 }if(proposed)break;}if(proposed)break;}if(proposed)break;}

 }
 for(const o of [...s.offers]){const lead=tradeLeader(s,o.to);if(!lead?.bot||now<(sim.nextDepartureAt||0))continue;if(sim.profile==='classroom'){if(now-o.createdAt<2000+(lead.seed%7)*1000)continue;if((lead.seed+o.qty+o.wantQty+Math.floor(o.createdAt/1000))%10===0){attempt('reject',{id:o.id},lead);continue;}}if(attempt('accept',{id:o.id},lead)){sim.lastTransport??={};sim.lastTransport[o.group]=o.transport||'ship';sim.nextDepartureAt=now+3500;break;}if(now-(o.createdAt||now)>60000)attempt('reject',{id:o.id},lead);}
}
