import paths from './sea-paths.json';
import geography from './map-geography.json';
export const geographicAnchors=geography.labels;
export const countryPositions=geographicAnchors;
// Longitude wraps at the left/right edges, as on a cylindrical projection of Earth.
export function seaRoute(from:number,to:number,returning=false,_legacyCanalOpen=false,_legacySuezOpen=false){const start=returning?to:from,end=returning?from:to,key=`${Math.min(start,end)}-${Math.max(start,end)}`;const base=(paths as Record<string,number[][]>)[key]||[];const points=start<end?base:[...base].reverse();return navigationProfile(points);}
type NavigationRoute={points:number[][];navigation:number[][];elapsed:number[];duration:number};

const navigationCache=new Map<string,NavigationRoute>();
function navigationProfile(points:number[][]):NavigationRoute{const key=JSON.stringify(points),cached=navigationCache.get(key);if(cached)return cached;const navigation:number[][]=points.length?[points[0]]:[],elapsed=[0];let duration=0;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],steps=Math.max(1,Math.ceil(Math.hypot((b[0]-a[0])*1.5,b[1]-a[1])/.2));for(let k=1;k<=steps;k++){const q=[a[0]+(b[0]-a[0])*k/steps,a[1]+(b[1]-a[1])*k/steps],p=navigation[navigation.length-1];duration+=Math.hypot((q[0]-p[0])*1.5,q[1]-p[1]);navigation.push(q);elapsed.push(duration);}}const route={points,navigation,elapsed,duration};navigationCache.set(key,route);return route;}
export function routePoint(r:ReturnType<typeof seaRoute>,t:number){const pts=r.navigation;if(!pts.length)return{x:0,y:0,rawX:0};const time=Math.max(0,Math.min(1,t))*r.duration;let low=0,high=pts.length-1;while(low+1<high){const mid=(low+high)>>1;if(r.elapsed[mid]<=time)low=mid;else high=mid;}const span=r.elapsed[high]-r.elapsed[low],u=span?(time-r.elapsed[low])/span:0,rawX=pts[low][0]+(pts[high][0]-pts[low][0])*u;return{x:((rawX%100)+100)%100,rawX,y:pts[low][1]+(pts[high][1]-pts[low][1])*u};}
// Three clipped copies avoid drawing a false straight line through land at the seam.
export function routeSvgPath(r:ReturnType<typeof seaRoute>){return [-100,0,100].map(offset=>'M'+r.points.map(p=>`${p[0]+offset} ${p[1]}`).join(' L')).join(' ');}
export function voyageState(v:any,clock:number){const progress=Math.max(0,Math.min(1,(clock-v.departedAt)/(v.arrivesAt-v.departedAt))),trips=v.trips||1,cycle=progress>=1?1:(progress*trips)%1,returning=cycle>=.5,leg=returning?(cycle-.5)*2:cycle*2,trip=Math.min(trips-1,Math.floor(progress*trips));return{progress,returning,leg,trip,trips};}

// Seconds until the current outward/homeward leg finishes, including multi-load trips.
export function voyageLegRemaining(v:any,clock:number){const state=voyageState(v,clock),legMs=(v.arrivesAt-v.departedAt)/(2*(v.trips||1));return Math.max(0,Math.ceil((1-state.leg)*legMs/1000));}

// Short classroom journeys still reflect distance, upgrades and multiple loads.
export function routeVoyageMs(from:number,to:number,level:number,trips=1,simulation=false){
 const distance=seaRoute(from,to).duration;
 const speedFactor=[1,.85,.7][Math.max(0,Math.min(2,level-1))];
 const tripFactor=1+.2*(Math.max(1,trips)-1);
 return Math.round(Math.min(30000,Math.max(10000,Math.min(22000,distance/60*12000))*speedFactor*tripFactor)*(simulation?.5:1));
}
// Lesson voyages use the entire sea route, with no short-route or long-route cap.
export function lessonVoyageMs(from:number,to:number,level:number,trips=1){
 const distance=seaRoute(from,to).duration,speedFactor=[1,.85,.7][Math.max(0,Math.min(2,level-1))];
 // Increase speed by 30%: elapsed time is divided by 1.3 (not reduced by 30%).
 const previousDuration=Math.round((30000+distance*600*speedFactor)/2);
 return Math.round(previousDuration/1.3)*Math.max(1,trips);
}
export function tradeVoyageMs(from:number,to:number,level:number,trips=1,air=false,transportResearch=false,mode='competition'){return mode!=='competition'?lessonVoyageMs(from,to,level,trips):air?flightVoyageMs(from,to):Math.max(6000,Math.round(routeVoyageMs(from,to,level,trips,false)*(transportResearch?.75:1)));}

// Land-side aprons; shared by parked aircraft and both flight endpoints.
export const airportPositions=[[24,31],[59,25],[55,57],[28,58],[90,68],[86,16]];
export function flightRoute(from:number,to:number,returning=false){
 const start=airportPositions[returning?to:from],end=airportPositions[returning?from:to];
 // Aircraft use a visible, direct airport-to-airport segment on this board.
 const points=[start,end];
 return navigationProfile(points);
}
export function flightVoyageMs(from:number,to:number){return Math.min(7000,Math.max(3000,Math.round(flightRoute(from,to).duration/60*6000)));}
