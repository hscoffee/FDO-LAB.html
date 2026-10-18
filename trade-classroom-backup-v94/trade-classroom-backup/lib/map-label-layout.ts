export type MapBox={x:number;y:number;width:number;height:number};
function overlap(a:MapBox,b:MapBox){return Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));}
/** Keep labels centred on their facility. Resolve collisions upwards, never sideways. */
export function placeMapLabels(labels:MapBox[],objects:MapBox[],width:number,height:number,top=0){
 const placed:MapBox[]=[],result:MapBox[]=[];const margin=6;
 for(const {label,index} of labels.map((label,index)=>({label,index})).sort((a,b)=>b.label.y-a.label.y)){
  const x=Math.max(margin,Math.min(width-margin-label.width,label.x)),minY=top+margin;
  let y=Math.max(minY,Math.min(height-margin-label.height,label.y));
  const obstacles=[...objects,...placed].map(box=>({x:box.x-4,y:box.y-4,width:box.width+8,height:box.height+8}));
  // Every move crosses an obstacle's upper edge, so this terminates deterministically.
  for(let n=0;n<=obstacles.length;n++){
   const hits=obstacles.filter(box=>overlap({x,y,width:label.width,height:label.height},box)>0);
   if(!hits.length)break;
   const next=Math.max(minY,Math.min(...hits.map(box=>box.y-label.height-2)));
   if(next>=y)break;y=next;
  }
  const box={...label,x,y};placed.push(box);result[index]=box;
 }
 return result;
}
