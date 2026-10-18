export const maxGroupSize=6;
export const maxStudents=36;
export const goods=['식량','목재','철강','의류','커피','자동차','가공 식품','가구','볶은 커피','완성 의복','기계 부품','운송 차량','포장 식품','고급 가구','포장 커피','고급 의복','산업 기계','전문 차량'];
export const specialty=[0,1,4,3,2,5];
export const biome=[0,1,4,3,2,5];
export const fleetCosts=[5,10,20];
export const icons=['🌾','🪵','⚙️','👕','☕','🚗'];
export const countries=[
{name:'솔베르',climate:'온대 기후',color:'#e5a52b',facts:['중위도의 온대 기후와 넓은 평야','비옥한 토양·농업용수·섬유 작물','농업·의류 가공 시설 중심, 중공업 자본 부족','농업 기술 발달'],reason:'따뜻한 기후, 넓은 평야와 농업 기술 덕분에 식량을 효율적으로 생산해요.'},
{name:'노르덴',climate:'냉대 기후',color:'#289b83',facts:['북반구 고위도에서 겨울이 길고 침엽수림이 넓음','산림·낙농 자원 풍부, 일부 광물은 부족','목재 가공·낙농 시설에 투자','산림 관리와 목재 가공 기술 발달'],reason:'넓은 산림과 목재 가공 기술 덕분에 목재를 효율적으로 생산해요.'},
{name:'카라쿰',climate:'열대 기후',color:'#c7774c',facts:['적도에 가까운 아프리카의 따뜻한 지역으로 비가 충분함','커피 재배에 알맞은 기온·강수량과 농경지','커피 농장과 가공·보관 시설에 집중 투자','커피 재배·가공 기술 발달'],reason:'열대 지역의 따뜻한 기후와 농경지, 커피 재배·가공 기술을 활용해 커피를 효율적으로 생산해요.'},
{name:'벨루체',climate:'고산 기후',color:'#a16bca',facts:['적도에 가까운 높은 산지의 서늘한 고산 기후','고산 목축에서 얻는 양털 등 섬유 자원','직물·의류 가공 시설에 집중 투자','방직·봉제 기술과 전문 인력 발달'],reason:'고산 지역의 목축에서 얻은 양털과 의류 가공 시설·기술을 활용해 의류를 효율적으로 생산해요.'},
{name:'히노세',climate:'건조 기후',color:'#de6274',facts:['호주 중앙의 비가 적은 건조한 내륙 지역','철광석 등 광물 자원 풍부','광산·제철 시설과 물·운송 시설에 집중 투자','광물 채굴과 제철 기술 발달'],reason:'건조한 기후 자체가 철강 생산에 유리한 것은 아니에요. 풍부한 광물 자원과 광산·제철 시설·기술을 활용해 철강을 효율적으로 생산해요.'},
{name:'아이젠하임',climate:'한대 기후',color:'#548bd6',facts:['북극에 가까운 한대 지역으로 농작물 재배가 어려움','이 가상 국가는 농림 자원과 광물 자원이 부족함','자동차 연구·교육·자동화 조립 시설에 투자','자동차 설계·조립 기술과 전문 인력 풍부'],reason:'이 가상 국가는 자원이 부족하지만 자본과 기술에 투자하여 자동차를 효율적으로 생산해요. 추운 기후 때문에 자동차 산업이 발달한 것은 아니에요.'}
];
export const phases=['입장 대기','물자 생산','생산 결과 비교','전략 회의','2차 생산','나라 간 무역','결과 탐구 · 발표','나라의 생산 조건 탐색'];
// 일반 기후 복습용 초안. 특정 교과서의 문항을 복제하지 않음.
const quizDrafts=[
['일 년 내내 기온이 높은 기후는?',['열대 기후','한대 기후','냉대 기후'],0,'열대는 적도 주변에 주로 나타나요.'],
['비가 매우 적게 내리는 기후는?',['온대 기후','건조 기후','열대 우림 기후'],1,'건조하다는 말의 뜻을 생각해 보세요.'],
['일 년 내내 춥고 나무가 자라기 어려운 기후는?',['열대 기후','온대 기후','한대 기후'],2,'극지방 가까이에 나타나요.'],
['사계절의 변화가 나타나고 비교적 온화한 기후는?',['온대 기후','한대 기후','건조 기후'],0,'우리나라가 속하는 기후를 떠올려 보세요.'],
['추운 겨울이 길고 침엽수림이 넓게 나타나는 기후는?',['열대 기후','냉대 기후','건조 기후'],1,'한대보다 여름이 따뜻해 숲이 자랄 수 있어요.'],
['높은 산지에서 주변 저지대보다 서늘한 까닭은?',['바다와 가까워서','비가 전혀 안 와서','고도가 높아서'],2,'높이 올라갈수록 기온은 대체로 낮아져요.'],
['열대 우림 지역에서 지붕의 경사를 급하게 만들면 좋은 점은?',['빗물이 잘 흘러내린다','눈이 더 많이 쌓인다','모래가 집 안에 들어온다'],0,'비가 많이 오는 지역이에요.'],
['건조한 사막에서 물을 구할 수 있어 사람들이 모여 사는 곳은?',['빙하','오아시스','침엽수림'],1,'사막 속 샘이 있는 곳이에요.'],
['더운 사막에서 긴 옷으로 몸을 가리는 이유로 알맞은 것은?',['눈을 피하려고','추운 겨울만 있어서','강한 햇빛과 모래바람을 막으려고'],2,'긴 옷이 몸을 보호하기도 해요.'],
['한 지역의 오랜 기간에 걸친 평균적인 대기 상태는?',['기후','오늘의 날씨','일기 예보'],0,'짧은 하루가 아니라 오랜 기간을 살펴봐요.'],
['“오늘 오후에는 비가 온다”는 무엇에 대한 설명인가요?',['기후','날씨','지형'],1,'짧은 시간의 대기 상태를 말해요.'],
['기후를 살펴볼 때 중요한 두 요소는?',['인구와 넓이','언어와 문화','기온과 강수량'],2,'얼마나 덥고, 비나 눈이 얼마나 오는지 살펴봐요.'],
['적도 주변에서 흔히 나타나는 기후는?',['열대 기후','한대 기후','냉대 기후'],0,'일 년 내내 태양 에너지를 많이 받아요.'],
['극지방에 가까울수록 기온은 대체로 어떻게 되나요?',['높아진다','낮아진다','언제나 같다'],1,'태양 에너지를 받는 차이를 떠올려 보세요.'],
['열대 우림의 특징으로 알맞은 것은?',['나무가 전혀 없다','얼음으로 덮여 있다','덥고 습하여 울창한 숲이 나타난다'],2,'기온과 강수량이 모두 높은 편이에요.'],
['추운 지역에서 두꺼운 옷을 입는 주된 이유는?',['몸의 열을 지키려고','비를 모으려고','햇빛을 더 받으려고'],0,'체온을 유지하는 데 도움을 줘요.'],
['비가 적은 지역에서 농사를 지을 때 특히 중요한 것은?',['스키장','물을 확보하는 시설','눈을 치우는 장비'],1,'식물이 자라는 데 필요한 것을 떠올려 보세요.'],
['온대 기후 지역의 생활에 대한 설명으로 알맞은 것은?',['일 년 내내 같은 옷만 입는다','모든 지역에 사막이 있다','계절에 따라 옷차림이 달라질 수 있다'],2,'기온의 계절 변화를 생각해 보세요.'],
['열대 우림 지역에서 집의 바닥을 지면보다 높이면?',['습기와 해충을 피하는 데 도움이 된다','기온이 영하로 내려간다','비가 내리지 않는다'],0,'덥고 습한 환경에서 생활하는 방법이에요.'],
['기후와 사람들의 생활에 대한 설명으로 알맞은 것은?',['생활과 아무 관련이 없다','옷·음식·집의 모습에 영향을 준다','모든 나라의 생활이 같아진다'],1,'환경에 적응하는 모습을 떠올려 보세요.'],
['건조 기후 지역의 집에 작은 창문을 내는 까닭으로 알맞은 것은?',['비를 많이 모으려고','눈을 들이려고','강한 햇빛과 모래바람을 줄이려고'],2,'바깥의 뜨거운 환경을 생각해 보세요.'],
['냉대 기후 지역의 넓은 숲에서 얻기 쉬운 자원은?',['목재','바닷물','열대 과일'],0,'숲에는 나무가 많아요.'],
['같은 나라 안에서도 기후가 다를 수 있을까요?',['절대로 다르지 않다','위치와 높이에 따라 다를 수 있다','국기가 같으면 같다'],1,'큰 나라의 남쪽과 북쪽을 떠올려 보세요.'],
['강수량이란 무엇인가요?',['바람이 부는 시간','햇빛의 양','비·눈 등이 내린 양'],2,'하늘에서 내리는 물의 양을 뜻해요.']
] as const;
const fourthChoices=["온대 기후", "냉대 기후", "건조 기후", "냉대 기후", "열대 우림 기후", "주변보다 적도에 가까워서", "집 안으로 빗물을 모으려고", "빙원", "옷으로 모래를 만들려고", "그날의 바람", "기후대", "강의 길이와 바다의 깊이", "건조 기후", "언제나 영상으로 유지된다", "일 년 내내 눈으로 덮여 있다", "햇빛을 더 강하게 만들려고", "모래를 더 많이 쌓는 시설", "계절에 따른 기온 변화가 전혀 없다", "비가 내리는 양이 줄어든다", "모든 지역에서 같은 농작물을 기르게 한다", "찬 공기가 들어오는 양을 늘리려고", "원유", "산이 있으면 모든 곳의 기후가 같다", "땅의 높이"];
export const quizzes=quizDrafts.map((q,i)=>{const options:string[]=[...q[1],fourthChoices[i]];const shift=i%4;return [q[0],[...options.slice(shift),...options.slice(0,shift)],(q[2]-shift+4)%4,q[3]] as const;});

// Every resource remains producible; specialization keeps its 4/2/1 advantage.
export const secondary=[3,0,1,2,0,2];
export const secondaryReasons=[
 '따뜻한 기후에서 얻는 섬유 작물과 의류 가공 시설을 활용해요.',
 '서늘한 기후에 맞는 작물 재배와 낙농 기술을 활용해요.',
 '열대 지역의 산림 자원과 목재 가공 시설을 활용해요.',
 '산지의 광물 자원과 금속 가공 시설로 철강도 생산해요.',
 '관개 시설로 농업용수를 확보하여 식량도 생산해요.',
 '자동차 산업에 투자한 자본과 금속 가공 시설을 철강 생산에도 활용해요.'
];
export function productionAmount(countryIndex:number,itemIndex:number,level=1,competition=false){return specialty[countryIndex]===itemIndex?4+(competition?2:1)*Math.max(0,Math.min(2,level-1)):secondary[countryIndex]===itemIndex?2:1;}
export function productionReason(countryIndex:number,itemIndex:number){
 const country=countries[countryIndex];
 if(itemIndex===4&&countryIndex!==2)return countryIndex===3?"열대 지역의 서리가 없는 고산 경작지에서 커피를 소량 재배할 수 있어요.":"야외에서 커피를 재배하기 어려운 환경이에요. 게임에서는 온실 등 환경 조절 시설로 1개만 생산할 수 있도록 설정했어요. 커피가 특산물인 나라와 무역하면 더 효율적으로 확보할 수 있어요.";
 return specialty[countryIndex]===itemIndex?country.reason:secondary[countryIndex]===itemIndex?secondaryReasons[countryIndex]:`${country.name}의 자연환경·자원·자본·기술은 다른 특산물 산업에 더 유리해요. ${goods[itemIndex]}도 만들 수 있지만 기본 생산량은 1개예요.`;
}
export const factoryRequirements=[{production:0,types:0},{production:24,types:1},{production:60,types:2}];
export const shipRequirements=[0,8,20];
export const maxShipLoad=10;
export const shipCapacity=[4,7,10];
export const voyageMs=[40000,35200,30400];
export const shipNames=['소형 연안 화물선','크레인 장착 화물선','대형 컨테이너선'];

export function activeGroups(s:any):number[]{if(s.groups)return s.groups;if(s.phase===0&&s.lobbyGroups)return s.lobbyGroups;if(s.phase>0){const groups=Array.from(new Set<number>((s.players||[]).map((p:any)=>p.group).filter((g:number)=>g>=0))).sort((a,b)=>a-b);if(groups.length)return groups;}return [0,1,2,3,4,5];}
// Return a canonical copy: bot priority sorting must never reorder shared UI slots.
export function activeItems(s:any):number[]{const items=s.items?[...s.items]:Array.from(new Set(activeGroups(s).map(g=>specialty[(s.assignment||[0,1,2,3,4,5])[g]])));return items.sort((a,b)=>a-b);}
export function tradeItems(s:any):number[]{return s.mode==='competition'?[...activeItems(s),...activeGroups(s).map(g=>6+s.assignment[g]),...activeGroups(s).map(g=>12+s.assignment[g])]:activeItems(s);}
export function effectiveAircraftCapacity(s:any,g:number){return s.mode==='competition'&&s.technology?.[g]?.network?(s.assignment[g]===3?4:3):2;}
export function landmarkCollection(s:any,g:number){const items=activeItems(s),total=items.length*s.target;const amount=items.reduce((sum,i)=>sum+Math.min(s.target,Math.max(0,(s.stock[g]?.[i]||0)-(s.offers||[]).filter((o:any)=>o.group===g&&o.give===i).reduce((n:number,o:any)=>n+o.qty,0))),0);return {amount,total,percent:Math.floor(amount/total*100)};}

export function productionPhase(s:any){return (s.lessonFlow?[1,5]:[1,4,5]).includes(s.phase);}

export const goalOptions=[20,25,30];
export function productionItems(s:any,country:number){return (s.mode!=='competition'&&s.lessonFlow&&s.phase===5)?[specialty[country]]:activeItems(s);}

export function effectiveShipCapacity(s:any,g:number){return Math.min(maxShipLoad,s.mode==='competition'?(s.technology?.[g]?.transport2?(s.assignment[g]===1?10:8):4):(shipCapacity[(s.growth[g]?.ship||1)-1]||4));}

// Competition-only air freight: a single plane and a strict small-load limit.
export const aircraftCapacity=2,aircraftCost=10;

export function departureAnnouncement(from:number,to:number){const name=countries[to].name,last=name.charCodeAt(name.length-1),final=(last-0xAC00)%28,particle=final===0||final===8?'로':'으로';return countries[from].name+'의 무역선이 '+name+particle+' 출항합니다.';}

// Lesson facility names are indexed by country, then the existing three levels.
export const factoryNames=[
 ['곡물 농장','대규모 곡물 농장','곡물 생산단지'],
 ['제재소','목재 가공소','목재 산업단지'],
 ['커피 농장','대규모 커피 농장','커피 생산단지'],
 ['직조 공방','의류 공장','섬유 산업단지'],
 ['제철소','종합 제철소','철강 산업단지'],
 ['자동차 조립공장','자동차 생산공장','자동차 산업단지'],
];
export function factoryName(country:number,level:number){return factoryNames[country][Math.max(0,Math.min(2,level-1))];}
export const simulationSpeeds=[1,2,4,8,16,32];
export function nextSimulationSpeed(speed:number){return simulationSpeeds[(simulationSpeeds.indexOf(speed)+1)%simulationSpeeds.length];}

// Class roster targets are per group; empty seats never start AI automatically.
export function groupSizeTarget(s:any,g:number){return Math.max(1,Math.min(maxGroupSize,Number(s.groupSizes?.[g])||4));}

export function adjacentSimulationSpeed(speed:number,direction:number){const i=Math.max(0,simulationSpeeds.indexOf(speed));return simulationSpeeds[Math.max(0,Math.min(simulationSpeeds.length-1,i+Math.sign(direction)))];}

export function lessonScore(s:any,g:number){return activeItems(s).reduce((sum:number,i:number)=>sum+Math.min(s.target,Math.max(0,s.stock?.[g]?.[i]||0)),0);}
export function victoryPresentation(s:any){
 const winners=(s.winners||[]) as number[],names=winners.map(g=>countries[s.assignment[g]].name),joint=names.length>1,landmark=s.victoryReason==='landmark'||(!s.victoryReason&&s.mode!=='competition'&&winners.some(g=>s.landmarks?.includes(g)));
 const nations=names.join(' · '),title=nations+' 국가 '+(joint?'공동 승리':'승리'),message=landmark?nations+' 국가가 랜드마크를 달성했습니다!':nations+' 국가가 '+(joint?'공동 승리했습니다!':'승리했습니다!');
 return {title,message,reason:landmark?'landmark':'score',names,winners,joint,voiceKey:joint?'victory-joint':'victory-'+(landmark?'landmark':'score')+'-'+s.assignment[winners[0]]};
}
