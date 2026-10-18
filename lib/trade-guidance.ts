type Offer={group:number;give:number;qty:number};
export function offerPerspective(o:Offer&{to:number;want:number;wantQty?:number},group:number){
 const outgoing=o.group===group;
 return {outgoing,partner:outgoing?o.to:o.group,sendItem:outgoing?o.give:o.want,sendQty:outgoing?o.qty:o.wantQty??o.qty,receiveItem:outgoing?o.want:o.give,receiveQty:outgoing?o.wantQty??o.qty:o.qty};
}
export function tradePageSize(height:number){return Math.max(1,Math.min(5,Math.floor((height-202)/74)));}
export function availableStock(stock:number[],offers:Offer[],group:number,item:number){
 return Math.max(0,(stock[item]||0)-offers.filter(o=>o.group===group&&o.give===item).reduce((sum,o)=>sum+o.qty,0));
}
export function proposalIssue({stock,offers,group,give,want,qty,wantQty,to,partnerStock}:{stock:number[];offers:Offer[];group:number;give:number;want:number;qty:number;wantQty:number;to:number;partnerStock?:number[]}){
 if(to<0||to===group)return '거래할 다른 나라를 선택하세요.';
 if(give===want)return '보낼 물자와 받을 물자를 다르게 선택하세요.';
 if(![qty,wantQty].every(n=>Number.isInteger(n)&&n>=1&&n<=10))return '보내고 받을 개수는 1~10개로 선택하세요.';
 if(offers.filter(o=>o.group===group).length>=3)return '대기 제안은 세 건까지예요. 기존 제안을 확인하세요.';
 if(availableStock(stock,offers,group,give)<qty)return '보낼 물자가 부족해요. 대기 제안에 사용 중인 물자도 확인하세요.';
 if(partnerStock&&(partnerStock[want]||0)<wantQty)return '상대 나라의 받을 물자가 부족해요. 사용 가능한 수량을 확인하세요.';
 return '';
}
export function turnRemaining(s:{phase:number;lessonFlow?:boolean;roundSeconds:number;end:number;paused?:boolean;left?:number},now:number){
 if(s.phase!==5)return 0;
 const round=s.roundSeconds*1000,total=s.lessonFlow?480000:round*4;
 const left=s.paused?s.left||0:s.end-now;
 if(left<=0)return 0;
 const elapsed=Math.max(0,total-left);
 return Math.max(1,Math.ceil((round-elapsed%round)/1000));
}
