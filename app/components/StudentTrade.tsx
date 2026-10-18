'use client';
import {tradeItems,effectiveAircraftCapacity,activeGroups,activeItems} from '../../lib/content';
import {shipLimit} from '../../lib/technology';
import {useEffect,useRef,useState} from 'react';
import {ArrowLeft,ChevronLeft,ChevronRight,Ship} from 'lucide-react';
import {countries,goods,aircraftCapacity,effectiveShipCapacity,shipCapacity,specialty,fleetCosts} from '../../lib/content';
import {availableStock,proposalIssue,turnRemaining,offerPerspective,tradePageSize} from '../../lib/trade-guidance';
import GoodArt from './GoodArt';
import FleetPurchase from './FleetPurchase';
import AircraftPurchase from './AircraftPurchase';
import {routeVoyageMs,flightVoyageMs,tradeVoyageMs} from '../../lib/routes';
import TradeItemPicker from './TradeItemPicker';
import styles from './StudentTrade.module.css';

type Props={s:any;group:number;me:any;leader:any;nextLeader:any;now:number;busy:boolean;act:(action:string,args?:any,notice?:string)=>Promise<any>;onTransfer?:()=>void;onMap:()=>void};
export default function StudentTrade({s,group,me,leader,nextLeader,now,busy,act,onMap,onTransfer}:Props){
 const root=useRef<HTMLElement>(null),list=useRef<HTMLDivElement>(null),previousLeader=useRef(leader?.id);
 const [short,Short]=useState(false),[pickStep,PickStep]=useState<'item'|'quantity'>('item'),[transport,Transport]=useState('ship'),[resourceTier,ResourceTier]=useState(1);
 const airCap=effectiveAircraftCapacity(s,group),fleetMax=s.mode==='competition'?shipLimit(s.technology?.[group]):3,fleetCost=[5,10,20,25,30][s.growth[group].fleet||0];const allItems=tradeItems(s);const visibleItems=allItems.filter(i=>resourceTier===1?i<6:resourceTier===2?i>=6&&i<12:i>=12);const tierButtons=s.mode==='competition'?<div className={styles.transportChoice} aria-label="물자 단계">{[[1,'기본 자원'],[2,'가공품'],[3,'고급 가공품']].map(([v,n])=><button key={v} aria-pressed={resourceTier===v} onClick={()=>ResourceTier(Number(v))}>{n}</button>)}</div>:null;
 const [screen,Screen]=useState<'list'|'country'|'compose'|'detail'|'pick'|'fleet'>('list'),[destination,Destination]=useState(-1),[give,Give]=useState(specialty[s.assignment[group]]),[want,Want]=useState((specialty[s.assignment[group]]+1)%6),[qty,Qty]=useState(1),[wantQty,WantQty]=useState(1),[page,Page]=useState(0),[pageSize,PageSize]=useState(5),[countryPage,CountryPage]=useState(0),[selected,Selected]=useState(''),[picking,Picking]=useState<'send'|'receive'>('send');
 const free=(g:number)=>s.availableStock?.[g]||goods.map((_,i)=>availableStock(s.stock[g],s.offers,g,i));
 const partnerStock=destination>=0?free(destination):[0,0,0,0,0,0];
 const otherGroups=activeGroups(s).filter((g:number)=>g!==group),countryPages=Math.max(1,Math.ceil(otherGroups.length/pageSize));
 const stock=s.stock[group],mine=!!me&&me.group===group,enabled=s.phase===5&&!s.paused,offers=s.offers.filter((o:any)=>o.group===group||o.to===group),outgoing=offers.filter((o:any)=>o.group===group),pages=Math.max(1,Math.ceil(offers.length/pageSize)),current=offers.find((o:any)=>o.id===selected),available=free(group)[give],baseIssue=proposalIssue({stock,offers,group,give,want,qty,wantQty,to:destination,partnerStock});const issue=transport==='air'&&(qty>airCap||wantQty>airCap)?`비행기는 보내기·받기 각각 최대 ${airCap}개만 운반해요.`:baseIssue;
 const fleet=s.growth[group].fleet??1,activeShips=s.shipments.filter((v:any)=>v.group===group&&v.transport!=='air').length;
 const travelling=s.shipments.some((v:any)=>v.group===group||v.to===group);
 useEffect(()=>{const element=root.current;if(!element)return;const fit=()=>{const r=element.getBoundingClientRect();Short(r.height<340);const h=list.current?.getBoundingClientRect().height;if(h)PageSize(Math.max(1,Math.min(5,Math.floor(h/(screen==='country'?112:74)))));};const observer=new ResizeObserver(fit);observer.observe(element);if(list.current)observer.observe(list.current);fit();return()=>observer.disconnect();},[screen,s.mode]);
 useEffect(()=>Page(p=>Math.min(p,pages-1)),[pages]);
 useEffect(()=>CountryPage(p=>Math.min(p,countryPages-1)),[countryPages]);

 useEffect(()=>{if(screen==='detail'&&!current)Screen('list');},[screen,current?.id]);
 const back=()=>{if(screen==='pick'&&short&&pickStep==='quantity'){PickStep('item');return;}Screen(screen==='pick'?'compose':screen==='compose'?'country':'list');};
 const warehouse=(g:number)=><div className={styles.warehouse} aria-label="상대 나라 사용 가능 물자">{visibleItems.map(i=>[goods[i],i] as const).map(([name,i])=><span key={name} title={`${name}: 보유 ${s.stock[g][i]}개, 사용 가능 ${free(g)[i]}개`}><GoodArt item={i}/><small>{name}</small><b>{free(g)[i]}</b></span>)}</div>;
 const resource=(item:number,count:number,label:string)=><div className={styles.resource}><span>{label}</span><GoodArt item={item}/><strong>{goods[item]} <b>{count}개</b></strong></div>;
 const heading=(title:string,subtitle:string)=><header className={styles.header}><button onClick={back} aria-label="이전 화면"><ArrowLeft size={20}/></button><div><h2>{title}</h2><small>{subtitle}</small></div></header>;
 if(s.phase!==5)return <section className={styles.root} ref={root}><div className={styles.empty}><Ship size={44}/><h2>{s.phase===6?'무역이 종료되었어요':'무역 시간이 되면 열려요'}</h2><p>{s.personal?'상단의 다음 단계로 무역까지 이동할 수 있어요.':'생산과 비교 활동이 끝나면 거래를 시작해요.'}</p></div></section>;
 return <section className={styles.root} ref={root} data-screen={screen} data-short={short} aria-label="우리나라 무역항">
 {screen==='list'?<>
  <header className={styles.header}><div><h2>모두 함께 무역해요</h2><small>모든 모둠원이 제안·수락·거절할 수 있어요</small></div><button className={styles.primary} disabled={busy||!mine||!enabled||(!fleet&&!s.growth[group].aircraft)||!otherGroups.length||outgoing.length>=3} onClick={()=>{Transport(fleet?'ship':'air');Destination(-1);CountryPage(0);Give(free(group).findIndex((n:number,i:number)=>n>0&&allItems.includes(i))<0?specialty[s.assignment[group]]:free(group).findIndex((n:number,i:number)=>n>0&&allItems.includes(i)));Want(allItems.find(i=>i!==specialty[s.assignment[group]])??give);Qty(1);WantQty(1);Screen('country');}}>새 제안</button></header>
  <div className={styles.status}><span>{outgoing.length>=3?'대기 제안 3건 · 기존 제안을 확인하세요':mine?'제안을 눌러 보내고 받을 물자를 확인하세요':'생산 탭에서 물자를 더 만들거나 제안을 추천하세요'}</span>{travelling&&<button onClick={onMap}>무역 현황</button>}</div>
  {s.mode==='competition'?<button className={styles.transportSummary} onClick={()=>Screen('fleet')}>운송수단 관리 · 배 {fleet}/{fleetMax}척 · 비행기 {s.growth[group].aircraft||0}대</button>:<div className={styles.fleetBar}><span>무역선 {fleet}/{fleetMax}척 · 운송 {activeShips}척</span>{fleet<fleetMax&&<button disabled={busy||!enabled||free(group)[specialty[s.assignment[group]]]<fleetCost} onClick={()=>act('buyShip',{fleet,group},'무역선을 구입했어요!')}>{fleet+1}척째 구입 · {goods[specialty[s.assignment[group]]]} {fleetCost}개</button>}</div>}
  <div ref={list} className={styles.list} style={{gridTemplateRows:`repeat(${pageSize},minmax(0,1fr))`}}>
   {offers.slice(page*pageSize,(page+1)*pageSize).map((o:any)=>{const p=offerPerspective(o,group);return <button className={styles.offer} key={o.id} onClick={()=>{Selected(o.id);Screen('detail');}}><span className={styles.offerTitle}><strong>{countries[s.assignment[p.partner]].name}</strong><small>{p.outgoing?'보낸 제안':'받은 제안'}{s.mode==='competition'&&(o.transport==='air'?' · 비행기':' · 배')}{o.recs?.length?` · 추천 ${o.recs.length}`:''}</small></span><span className={styles.exchange}><span><small>보내기</small><GoodArt item={p.sendItem}/><b>{p.sendQty}</b></span><span><small>받기</small><GoodArt item={p.receiveItem}/><b>{p.receiveQty}</b></span></span></button>;})}
   {!offers.length&&<div className={styles.empty}><Ship size={40}/><h2>기다리는 제안이 없어요</h2><p>{mine?'다른 나라에 교환을 제안해 보세요.':'모둠원과 어떤 물자가 필요한지 이야기해 보세요.'}</p></div>}
  </div>
  <footer className={styles.pager}><button disabled={page===0} onClick={()=>Page(page-1)} aria-label="이전 제안"><ChevronLeft size={20}/></button><span>{page+1} / {pages} · 제안 {offers.length}건</span><button disabled={page>=pages-1} onClick={()=>Page(page+1)} aria-label="다음 제안"><ChevronRight size={20}/></button></footer>
 </>:screen==='country'?<>
  {heading('어느 나라와 무역할까요?','1 / 2 · 상대 나라 선택')}
  {tierButtons}<small className={styles.hint}>사용 가능 재고 · 대기 제안에 묶인 물자는 제외해요</small>
  <div ref={list} className={styles.countryList} style={{gridTemplateRows:`repeat(${pageSize},minmax(0,1fr))`}}>{otherGroups.slice(countryPage*pageSize,(countryPage+1)*pageSize).map((g:number)=>{const ci=s.assignment[g];return <button key={g} onClick={()=>{Destination(g);const next=free(g).findIndex((n:number,i:number)=>n>0&&i!==give&&allItems.includes(i));Want(next<0?(allItems.find(i=>i!==give)??give):next);WantQty(1);Screen('compose');}}><span className={styles.countryName}><span className="nation-flag" style={{backgroundPosition:`${ci%3*50}% ${Math.floor(ci/3)*100}%`}}/><strong>{countries[ci].name}</strong></span>{warehouse(g)}</button>;})}</div>
  <footer className={styles.pager}><button disabled={countryPage===0} onClick={()=>CountryPage(countryPage-1)} aria-label="이전 나라"><ChevronLeft size={20}/></button><span>{Math.min(countryPage,countryPages-1)+1} / {countryPages}</span><button disabled={countryPage>=countryPages-1} onClick={()=>CountryPage(countryPage+1)} aria-label="다음 나라"><ChevronRight size={20}/></button></footer>
 </>:screen==='compose'?<>
  {heading(countries[s.assignment[destination]].name+'에 제안','2 / 2 · 물자와 개수 선택')}
  {tierButtons}{warehouse(destination)}
  {s.mode==='competition'&&<div className={styles.transportChoice} role="group" aria-label="무역 운송 수단"><button aria-pressed={transport==='ship'} disabled={!fleet} onClick={()=>Transport('ship')}>배 · 최대 {effectiveShipCapacity(s,group)}개씩</button><button aria-pressed={transport==='air'} disabled={!s.growth[group].aircraft} onClick={()=>{Transport('air');Qty(Math.min(qty,airCap));WantQty(Math.min(wantQty,airCap));}}>비행기 · 최대 {airCap}개 · 빠른 운송</button></div>}
  <div className={styles.form}>
   <button className={styles.editCard} onClick={()=>{Picking('send');PickStep('item');Screen('pick');}}><span>우리나라가 보내요</span><GoodArt item={give}/><strong>{goods[give]} <b>{qty}개</b></strong><small>사용 가능 {available}개 · 눌러서 변경</small></button>
   <button className={styles.editCard} onClick={()=>{Picking('receive');PickStep('item');Screen('pick');}}><span>우리나라가 받아요</span><GoodArt item={want}/><strong>{goods[want]} <b>{wantQty}개</b></strong><small>상대 사용 가능 {partnerStock[want]}개 · 눌러서 변경</small></button>
  </div>
  <p className={styles.hint} role="status">{issue||'상대가 수락하면 '+(transport==='air'?`비행기가 이륙해요. 최대 ${airCap}개씩 운송해요.`:'배가 출항해요. 최대 '+effectiveShipCapacity(s,group)+'개씩 운송해요.')+' 예상 왕복 '+Math.ceil(tradeVoyageMs(s.assignment[group],s.assignment[destination],s.growth[group].ship,Math.ceil(Math.max(qty,wantQty)/effectiveShipCapacity(s,group)),transport==='air',s.mode==='competition'&&!!s.technology[group]?.transport1,s.mode)/1000)+'초.'}</p>
  <button className={styles.primary} disabled={busy||!enabled||!mine||!!issue} onClick={async()=>{const r=await act('offer',{to:destination,give,want,qty,wantQty,transport},'교환 제안을 보냈어요.');if(r)Screen('list');}}>제안 보내기</button>
 </>:screen==='pick'?<>
  {heading(short&&pickStep==='quantity'?'개수 선택':picking==='send'?'보낼 물자와 개수':'받을 물자와 개수','아이콘과 숫자를 눌러 선택하세요')}{(!short||pickStep==='item')&&tierButtons}
  <TradeItemPicker step={short?pickStep:'both'} maxQuantity={transport==='air'?airCap:10} items={visibleItems} sending={picking==='send'} item={picking==='send'?give:want} quantity={picking==='send'?qty:wantQty} available={picking==='send'?free(group):partnerStock} onItem={i=>{if(short)PickStep('quantity');if(picking==='send'){Give(i);Qty(q=>Math.max(1,Math.min(q,free(group)[i],transport==='air'?airCap:10)));}else {Want(i);WantQty(q=>Math.max(1,Math.min(q,partnerStock[i],transport==='air'?airCap:10)));}}} onQuantity={picking==='send'?Qty:WantQty}/>
  <button className={styles.primary} onClick={()=>short&&pickStep==='item'?PickStep('quantity'):Screen('compose')}>{short&&pickStep==='item'?'개수 선택으로':'선택 완료 · 제안 확인'}</button>
 </>:screen==='fleet'?<>{heading('운송수단 관리','배와 항공기 보유 상태')}<FleetPurchase s={s} group={group} busy={busy} act={act}/><AircraftPurchase s={s} group={group} busy={busy} act={act}/><button onClick={()=>Screen('list')}>제안 목록으로</button></>:current?(()=>{const p=offerPerspective(current,group),enough=free(group)[p.sendItem]>=p.sendQty,shipBusy=current.transport==='air'?s.shipments.filter((v:any)=>v.group===current.group&&v.transport==='air').length>=s.growth[current.group].aircraft:s.shipments.filter((v:any)=>v.group===current.group&&v.transport!=='air').length>=(s.growth[current.group].fleet??1),recommended=current.recs?.includes(me.id);return <>
  {heading(countries[s.assignment[p.partner]].name+'와 교환',(current.transport==='air'?'비행기 · ':'배 · ')+(p.outgoing?'상대 나라의 답을 기다리고 있어요':'우리나라 기준으로 교환 내용을 확인하세요'))}
  <div className={styles.detail}>{resource(p.sendItem,p.sendQty,'우리나라가 보내요')}{resource(p.receiveItem,p.receiveQty,'우리나라가 받아요')}</div>
  <p className={styles.hint}>{p.outgoing?'상대가 수락하기 전까지 제안을 취소할 수 있어요.':!enough?`사용 가능 ${goods[p.sendItem]} ${availableStock(stock,offers,group,p.sendItem)}개 · ${p.sendQty}개가 필요해요.`:shipBusy?'상대 나라의 '+(current.transport==='air'?'비행기가 운송 중이에요.':'빈 무역선이 없어요.')+' 귀환을 기다려 주세요.':mine?'수락하면 물자를 싣고 출항합니다.':'추천을 누르고 거래 담당 학생과 이야기하세요.'}</p>
  <div className={styles.actions}>{p.outgoing?<button disabled={busy||!mine||!enabled} onClick={async()=>{if(await act('cancel',{id:current.id},'제안을 취소했어요.'))Screen('list');}}>제안 취소</button>:<><button className={styles.primary} disabled={busy||!enabled||!mine||!enough||shipBusy} onClick={async()=>{if(await act('accept',{id:current.id},current.transport==='air'?'무역 비행기가 이륙합니다.':'무역선이 출항합니다.'))Screen('list');}}>수락</button><button disabled={busy||!enabled||!mine} onClick={async()=>{if(await act('reject',{id:current.id},'거절했어요.'))Screen('list');}}>거절</button><button disabled={busy||!enabled||recommended} onClick={()=>act('recommend',{id:current.id},'모둠에 추천했어요.')}>{recommended?'추천 완료':`추천 ${current.recs?.length||0}`}</button></>}</div>
 </>;})():null}
 </section>;
}
