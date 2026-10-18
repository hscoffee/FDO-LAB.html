// Competition-only economic research. Basic stock IDs 0..5 remain unchanged.
export const craftedNames=['가공 식품','가구','볶은 커피','완성 의복','기계 부품','운송 차량'];
export const advancedNames=['포장 식품','고급 가구','포장 커피','고급 의복','산업 기계','전문 차량'];
export const industryNames=['종합 식품단지','종합 가구단지','종합 커피단지','종합 의류단지','종합 기계단지','종합 자동차단지'];
export const techKeys=['transport1','transport2','aviation','network','processing1','processing2','processing3','processing4','storage1','storage2','storage3'] as const;
export const techNames:Record<string,string>={};
export const techPoints:Record<string,number>={transport1:2,transport2:3,aviation:5,network:6,processing1:2,processing2:3,processing3:5,processing4:6,storage1:2,storage2:3,storage3:5};
const names=[
 ['곡물 운송선','대량 곡물 운송','식품 항공 운송','농식품 운송망','곡물 제분','식품 가공','포장 식품 생산','종합 식품단지','곡물 저장고','대형 곡물창고','식품 물류센터'],
 ['목재 운반선','대형 화물선 건조','가구 항공 운송','국제 해운망','규격 목재 가공','가구 제작','고급 가구 생산','종합 가구단지','목재 야적장','건조 보관창고','목재 물류기지'],
 ['커피 수출선','수출 항로 확장','커피 항공 운송','국제 커피 운송망','커피 원두 가공','원두 볶기','포장 커피 생산','종합 커피단지','원두 보관창고','방습 보관시설','커피 수출 물류센터'],
 ['의류 화물선','의류 대량 운송','의류 항공 운송','국제 의류 운송망','원단 가공','완성 의류 제작','고급 의류 생산','종합 의류단지','원단 보관소','의류 보관창고','의류 배송센터'],
 ['철강 운반선','중량 화물 운송','기계 부품 항공 운송','산업 운송망','철강 가공','기계 부품 제작','산업 기계 생산','종합 기계단지','철강 야적장','부품 보관창고','산업 자재 물류기지'],
 ['자동차 운搬船','차량 대량 운송','화물 항공기 개발','국제 복합 운송망','자동차 부품 가공','운송 차량 제작','전문 차량 생산','종합 자동차단지','부품 보관소','차량 보관시설','자동차 물류기지']
];
names[5][0]='자동차 운반선';
export const researchLanes=[{label:'운송 기술',keys:['transport1','transport2','aviation','network']},{label:'가공 기술',keys:['processing1','processing2','processing3','processing4']},{label:'자원 저장 기술',keys:['storage1','storage2','storage3']}];
export const researchPrerequisites:Record<string,string[]>={transport1:[],transport2:['transport1'],aviation:['transport1','processing2'],network:['transport2','storage2'],processing1:[],processing2:['processing1'],processing3:['processing2'],processing4:['processing3','storage2'],storage1:[],storage2:['storage1'],storage3:['storage2','processing2']};
export function researchName(ci:number,key:string){return names[ci]?.[techKeys.indexOf(key as any)]||key;}
export function newTechnology(){return {version:2,crafted:0,industry:false,automation:false,logistics:false,city:false,metropolis:false,builtAt:{} as Record<string,number>,research:null as any,craftReadyAt:0};}
export function developmentScore(t:any){return Math.min(40,techKeys.reduce((n,k)=>n+(t?.[k]?techPoints[k]:0),0));}
export function prerequisite(t:any,key:string){return (researchPrerequisites[key]||[]).every(k=>t?.[k]);}
export const processedItem=(ci:number,tier=2)=> (tier===3?12:6)+ci;
export const itemTier=(i:number)=>i<6?1:i<12?2:3;
export const itemValue=(i:number)=>[0,1,3,7][itemTier(i)];
export function storageCapacity(t:any){const warehouse=t?.storage3?400:t?.storage2?250:t?.storage1?150:100;const factory=t?.processing4?150:t?.processing1?50:0;return warehouse+factory;}
export function shipLimit(t:any){return t?.network?5:3;}
export function airLimit(t:any){return t?.network?2:1;}
export function competitionAirCapacity(t:any,ci:number){return t?.network?(ci===3?4:3):2;}
export function researchDuration(key:string){return ['network','processing4','storage3'].includes(key)?60000:['aviation','processing3','storage2'].includes(key)?45000:30000;}
export function researchEffect(ci:number,key:string){const main=['식량','목재','커피','의류','철강','자동차'][ci];const batch=ci===3?4:3;return ({transport1:'왕복 운송 시간 25% 단축',transport2:`선박 적재량 4개 → ${ci===1?10:8}개`,aviation:'첫 항공기 1대 지급 · 적재량 2개',network:`선박 보유 한도 3척 → 5척 · 항공기 1대 → 2대 · 적재량 2개 → ${batch}개`,processing1:`${main} 생산 4개 → 6개 · ${craftedNames[ci]} 제작 가능 · 자원별 저장 +50개`,processing2:`기본 가공에 드는 ${main} 4개 → 3개 · 보조 원료 2개 → 1개 · 제작 시간 12초 → 8초`,processing3:`${advancedNames[ci]} 제작 가능 · 기본 가공품 제작량 1개 → 2개`,processing4:'특산물 생산 6개 → 8개 · 고급 가공품 제작량 1개 → 2개 · 자원별 저장 +100개',storage1:'자원별 저장 +50개 · 생산시설 확장분과 합산',storage2:'자원별 저장 +100개 · 생산시설 확장분과 합산',storage3:'자원별 저장 +150개 · 생산시설 확장분과 합산'} as Record<string,string>)[key]||'';}
const mains=[0,1,4,3,2,5];
// Imported lower-tier products have no cyclic prerequisite and can be made from raw goods.
export const importProducer=[4,4,4,4,5,4];
export function recipe(ci:number,key:string,items:number[]=[0,1,2,3,4,5],t:any={}){
 const goods=Array(18).fill(0),main=mains[ci];
 const other=(preferred:number)=>items.includes(preferred)?preferred:(items.find(i=>i!==main)??main);
 const add=(i:number,n:number)=>{goods[i]+=n;};
 const raw=(i:number,n:number)=>add(other(i),n);
 // Absent countries cannot supply their products in a reduced-size match.
 // Use only active raw materials in that case, rather than an unobtainable item.
 const product=(producer:number,tier:number,n:number)=>items.includes(mains[producer])?add(processedItem(producer,tier),n):raw(2,n*3);
 if(key==='craft'||key==='craft2'){add(main,t.processing2?3:4);raw([1,3,1,1,1,2][ci],t.processing2?1:2);}
 else if(key==='craft3'){add(processedItem(ci),2);raw([3,2,3,2,5,2][ci],2);}
 else if(key==='transport1'){raw(1,3);raw(2,1);}
 else if(key==='transport2'){raw(1,4);raw(2,2);product(4,2,1);}
 else if(key==='aviation'){raw(2,4);product(4,2,1);product(5,2,1);}
 else if(key==='network'){raw(2,6);raw(1,3);product(5,2,2);product(4,3,1);}
 else if(key==='storage1'){raw(1,3);raw(2,1);}
 else if(key==='storage2'){raw(1,3);raw(2,2);product(5,2,1);}
 else if(key==='storage3'){raw(1,6);raw(2,3);product(5,2,2);product(4,3,1);}
 else if(key.startsWith('processing')){
  const stage=Number(key.slice(-1));add(main,[0,5,8,10,12][stage]);
  raw([1,3,1,1,5,2][ci],stage);
  if(stage>=2)add(processedItem(ci,stage===4?3:2),2);
  if(stage>=3)product(importProducer[ci],2,1);
 }
 return {goods,crafted:0};
}
export function researchCostReason(ci:number,key:string){
 if(key==='aviation')return '철강·기계 부품은 항공 설비에, 운송 차량은 공항의 화물 이동에 사용해요.';
 if(key.startsWith('transport'))return '목재·철강으로 선박을 만들고, 상위 운송 연구에는 기계 부품이 필요해요.';
 if(key==='network')return '운송 차량과 산업 기계로 항구·공항을 연결하는 물류망을 만들어요.';
 if(key.startsWith('storage'))return '목재·철강으로 창고를 확장하고, 상위 단계에는 화물 운송 차량과 산업 기계가 필요해요.';
 return ['곡물과 포장용 목재를 사용하고, 기계 부품으로 식품 가공 설비를 발전시켜요.','목재와 의류 재료로 가구를 만들고, 수입 기계 부품으로 가공 설비를 발전시켜요.','커피와 포장용 목재를 사용하고, 기계 부품으로 커피 가공 설비를 발전시켜요.','의류 재료와 목재로 작업장을 만들고, 기계 부품으로 의류 가공 설비를 발전시켜요.','철강과 자동차를 산업 자재·운반에 사용하고, 수입 운송 차량으로 생산단지의 물류를 확장해요.','자동차와 철강을 사용하고, 기계 부품으로 자동차 생산 설비를 발전시켜요.'][ci];
}

export function competitionScore(s:any,g:number){const t=s.technology?.[g]||{},value=(s.stock[g]||[]).reduce((n:number,qty:number,i:number)=>n+qty*itemValue(i),0);const inventory=Math.min(10,Math.floor(value/5)),producers=Math.max(1,(s.groups?.length||new Set((s.players||[]).map((p:any)=>p.group).filter((g:number)=>g>=0)).size||6)-1),city=Math.min(10,Math.floor(Object.values(t.supplies||{}).reduce((n:number,v:any)=>n+Math.max(0,Number(v)-1),0)/(producers*2)*10)),resources=inventory+city,research=developmentScore(t),trade=Math.min(40,Math.floor((s.competitionTrade?.[g]?.value||0)/3));return {resources,research,trade,total:resources+research+trade,value,inventory,city};}
export function creditTrade(s:any,g:number,item:number,qty:number){s.competitionTrade??=Array.from({length:6},()=>({value:0,exported:{}}));const ledger=s.competitionTrade[g];const previous=ledger.exported[item]||0,credited=Math.min(qty,Math.max(0,10-previous));ledger.exported[item]=previous+credited;const full=item>=12?Math.min(credited,Math.max(0,5-previous)):credited;ledger.value=Math.round((ledger.value+(full+(credited-full)*.2)*itemValue(item))*10)/10;}

export function researchSummary(ci:number,key:string){return ({transport1:'운송 시간 −25%',transport2:`적재 4 → ${ci===1?10:8}개`,aviation:'첫 항공기 1대',network:'선박 5척 · 항공기 2대',processing1:'생산 6개 · 저장 +50',processing2:'재료 4 → 3개',processing3:'가공품 1 → 2개',processing4:'생산 8개 · 저장 +100',storage1:'저장 +50개',storage2:'저장 +100개',storage3:'저장 +150개'} as Record<string,string>)[key]||'';}

// Each foreign industry serves a distinct city need, with equal rewards.
export const cityUses=['식량·식사 공급','주거·공공시설 가구','카페·휴식 공간','시민 의복','공공시설 기계 유지','도시 화물 운송'];
export function citySupplyItems(s:any,g:number):number[]{const own=s.assignment[g],groups=s.groups||[0,1,2,3,4,5];return groups.filter((x:number)=>x!==g).flatMap((x:number)=>[processedItem(s.assignment[x],2),processedItem(s.assignment[x],3)]);}
