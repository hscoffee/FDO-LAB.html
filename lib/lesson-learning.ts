export const firstProductionNotice='1차 생산에서는 모든 물자를 생산할 수 있습니다. 각 나라의 자연환경과 자원 조건에 따라 특산물을 더 많이 생산할 수 있습니다.';
export const activityInstructions:Record<number,string>={0:'모둠을 정하고 함께 입장해 봅시다.',7:'각 나라의 특성을 살펴보고 생산 조건을 탐색해 봅시다.',1:'각 나라별로 기후 문제를 풀고 물자를 생산해 봅시다.',2:'나라별 창고를 비교하고 부족한 물자를 찾아봅시다.',3:'잘 생산하는 특산물을 찾아봅시다.',4:'우리나라의 특산물을 더 생산해 봅시다.',5:'특산물을 생산하고 필요한 물자를 무역해 봅시다.',6:'생산과 무역 경험을 근거로 발표해 봅시다.'};
export const activityInstruction=(phase:number)=>activityInstructions[phase]||activityInstructions[0];
export function isPureSimulation(s:any){return !!s.simulation&&!s.simulation.mixed&&!s.personal&&!s.personalToken&&(s.mode==='simulation'||!!s.simulation.demo)&&s.players.every((p:any)=>p.bot);}
export const specialtyNotice='다른 물자의 생산에 필요한 자원이 고갈되었습니다. 이제 각 나라의 특산물만 생산할 수 있습니다.';
export const learningGoal='무역이 필요한 까닭 알아보기';
export const inquiryQuestion='무역이 필요한 까닭은 무엇일까?';
export const worksheetQuestions=[
 {key:'conditions',concept:'생산 조건',question:'나라마다 잘 생산하는 물자가 다른 까닭은?',hint:'자연환경 · 자원 · 자본 · 기술'},
 {key:'exchange',concept:'수출·수입',question:'무엇을 주고받아 서로 어떤 도움을 얻었나요?',hint:'보낸 물자 · 받은 물자 · 우리나라와 상대 나라의 변화'},
 {key:'necessity',concept:'무역의 필요성',question:inquiryQuestion,hint:'앞의 두 가지 경험을 근거로 설명해요.'}
] as const;
export function worksheetOf(p:any){return {conditions:p?.worksheet?.conditions||'',exchange:p?.worksheet?.exchange||'',necessity:p?.worksheet?(p.worksheet.necessity||''):(p?.reflection||'')} as Record<string,string>;}
export function worksheetCount(p:any){return worksheetQuestions.filter(q=>worksheetOf(p)[q.key].trim()).length;}
export function departureVoiceKey(country:number){return 'depart-'+country;}

export function presentationMembers(s:any,g:number){return s.players.filter((p:any)=>p.group===g&&(!p.bot||(s.simulation&&!s.simulation.mixed)));}
