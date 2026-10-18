// Use the document root so React portals remain inside native fullscreen.
export async function enterFullscreen(){
 const root=document.documentElement as HTMLElement & {webkitRequestFullscreen?:()=>Promise<void>|void};
 try{if(!document.fullscreenElement){if(root.requestFullscreen)await root.requestFullscreen();else if(root.webkitRequestFullscreen)await root.webkitRequestFullscreen();else return false;}return true;}catch{return false;}
}
export async function leaveFullscreen(){
 const doc=document as Document & {webkitExitFullscreen?:()=>Promise<void>|void;webkitFullscreenElement?:Element};
 try{if(document.fullscreenElement)await document.exitFullscreen();else if(doc.webkitFullscreenElement)await doc.webkitExitFullscreen?.();}catch{/* The CSS expanded view still closes if native fullscreen is unavailable. */}
}
