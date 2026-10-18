// Safe land-side display footprints, in percent of the terrain image.
// These bound the entire sprite, independently of its SVG's native aspect ratio.
const sites=[
 {x:20,y:30,w:5.2,h:6.2},
 {x:54,y:22,w:4.6,h:5.4},
 {x:54,y:52,w:4.8,h:6.4},
 {x:26,y:55.5,w:3.4,h:4.8},
 {x:87,y:66,w:4.8,h:5.2},
 {x:81,y:16,w:4.6,h:5.4}
];
export function facilityFootprint(country:number,level:number){
 const site=sites[Math.max(0,Math.min(5,country))],factor=[.72,.86,1][Math.max(0,Math.min(2,level-1))];
 return {x:site.x,y:site.y,width:site.w*factor,height:site.h*factor};
}
