// One geometry model for research nodes and their measured connections.
export const researchPositions:Record<string,[number,number]>={transport1:[0,50],transport2:[36,24],aviation:[36,77],network:[76,50],processing1:[0,50],processing2:[25,50],processing3:[50,50],processing4:[75,50],storage1:[0,50],storage2:[37.5,50],storage3:[75,50]};
export function fitResearchMap(width:number,height:number){
 const nodeHeight=Math.max(18,Math.min(88,Math.floor(height*.195)));
 const iconSize=nodeHeight>=60?Math.max(24,Math.min(42,nodeHeight-34)):0;
 return {nodeHeight,iconSize,compact:width<=1100,tiny:nodeHeight<34};
}
export function researchEdgePath(a:{left:number;right:number;top:number;bottom:number},b:{left:number;right:number;top:number;bottom:number},bounds:{left:number;top:number;width:number;height:number},cross=false){
 const x=(a.right-bounds.left)/bounds.width*1000,y=((a.top+a.bottom)/2-bounds.top)/bounds.height*600,tx=(b.left-bounds.left)/bounds.width*1000,ty=((b.top+b.bottom)/2-bounds.top)/bounds.height*600;
 // Cross-lane connections leave the source through a short channel, not through other nodes.
 const channel=cross?Math.min(994,Math.max(x,tx)+8):(x+tx)/2;
 return `M ${x} ${y} H ${channel} V ${ty} H ${tx}`;
}
