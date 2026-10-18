// A low, resonant maritime horn with a soft pressure attack.
let context:AudioContext|null=null,last=0,enabled=true;const active=new Set<GainNode>();
export function setEffectsEnabled(value:boolean){enabled=value;if(!value){horn?.pause();for(const gain of active){gain.gain.cancelScheduledValues(context?.currentTime||0);gain.gain.value=0;}}}
export function unlockSound(){if(typeof window==='undefined')return;const AC=window.AudioContext||(window as any).webkitAudioContext;if(AC){context??=new AC();void context?.resume();}}
let horn:HTMLAudioElement|null=null;
export function steamWhistle(){if(!enabled||typeof window==='undefined'||Date.now()-last<3500)return;last=Date.now();horn??=new Audio('/audio/maritime-horn.mp3');horn.volume=.595;horn.currentTime=0;void horn.play().catch(()=>{});}

export function clickSound(){unlockSound();if(!enabled||!context||context.state!=='running')return;const osc=context.createOscillator(),gain=context.createGain(),t=context.currentTime;osc.type='sine';osc.frequency.setValueAtTime(640,t);osc.frequency.exponentialRampToValueAtTime(360,t+.045);active.add(gain);gain.gain.setValueAtTime(.09,t);gain.gain.exponentialRampToValueAtTime(.001,t+.065);osc.connect(gain);gain.connect(context.destination);osc.start(t);osc.stop(t+.07);osc.onended=()=>{osc.disconnect();gain.disconnect();active.delete(gain);};}

// Original victory fanfare: layered brass, a timpani roll and a cymbal bloom.
// The first impact leads; the sustained chord is softer beneath the winner narration.
export async function landmarkFanfare(){
 unlockSound();if(!enabled||!context||context.state!=='running')return;
 const ctx=context,t=ctx.currentTime,master=ctx.createGain(),limiter=ctx.createDynamicsCompressor();
 master.gain.value=.65;active.add(master);limiter.threshold.value=-12;limiter.knee.value=15;limiter.ratio.value=5;limiter.attack.value=.004;limiter.release.value=.2;master.connect(limiter);limiter.connect(ctx.destination);
 const score:[number,number,number[]][]=[[0,.24,[196,293.66,392]],[.28,.24,[220,329.63,440]],[.56,.24,[246.94,369.99,493.88]],[.88,2.25,[130.81,196,261.63,329.63,392,523.25]]];
 for(const [offset,duration,notes] of score)for(const hz of notes){
  const osc=ctx.createOscillator(),body=ctx.createOscillator(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();osc.type='sawtooth';osc.frequency.value=hz;osc.detune.value=-4;body.type='triangle';body.frequency.value=hz;body.detune.value=4;filter.type='lowpass';filter.frequency.setValueAtTime(2300,t+offset);filter.frequency.exponentialRampToValueAtTime(700,t+offset+duration);gain.gain.setValueAtTime(0,t+offset);gain.gain.linearRampToValueAtTime(offset<.8?.06:.035,t+offset+.025);gain.gain.exponentialRampToValueAtTime(.0001,t+offset+duration);osc.connect(filter);body.connect(filter);filter.connect(gain);gain.connect(master);osc.start(t+offset);body.start(t+offset);osc.stop(t+offset+duration+.02);body.stop(t+offset+duration+.02);osc.onended=()=>{osc.disconnect();body.disconnect();filter.disconnect();gain.disconnect();};
 }
 for(const offset of [0,.14,.28,.42,.56,.7,.88]){const drum=ctx.createOscillator(),gain=ctx.createGain();drum.frequency.setValueAtTime(125,t+offset);drum.frequency.exponentialRampToValueAtTime(48,t+offset+.32);gain.gain.setValueAtTime(.24,t+offset);gain.gain.exponentialRampToValueAtTime(.0001,t+offset+.4);drum.connect(gain);gain.connect(master);drum.start(t+offset);drum.stop(t+offset+.42);drum.onended=()=>{drum.disconnect();gain.disconnect();};}
 const noise=ctx.createBufferSource(),buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*2.3),ctx.sampleRate),data=buffer.getChannelData(0),filter=ctx.createBiquadFilter(),wash=ctx.createGain();for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;noise.buffer=buffer;filter.type='highpass';filter.frequency.value=5000;wash.gain.setValueAtTime(.1,t+.88);wash.gain.exponentialRampToValueAtTime(.0001,t+3.18);noise.connect(filter);filter.connect(wash);wash.connect(master);noise.start(t+.88);noise.stop(t+3.2);noise.onended=()=>{noise.disconnect();filter.disconnect();wash.disconnect();};
 await new Promise<void>(resolve=>setTimeout(resolve,3350));master.disconnect();limiter.disconnect();active.delete(master);
}

// A short original takeoff cue: rising engine whine, turbine rumble and air rush.
let lastTakeoff=0;
export function aircraftTakeoff(){
 unlockSound();if(!enabled||!context||context.state!=='running'||Date.now()-lastTakeoff<1800)return;lastTakeoff=Date.now();
 const ctx=context,t=ctx.currentTime,duration=2.1,gain=ctx.createGain(),filter=ctx.createBiquadFilter(),noise=ctx.createBufferSource(),buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
 noise.buffer=buffer;filter.type='lowpass';filter.frequency.setValueAtTime(220,t);filter.frequency.exponentialRampToValueAtTime(1600,t+1.25);filter.frequency.exponentialRampToValueAtTime(400,t+duration);gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.16,t+.4);gain.gain.linearRampToValueAtTime(.23,t+1.2);gain.gain.exponentialRampToValueAtTime(.001,t+duration);active.add(gain);noise.connect(filter);filter.connect(gain);gain.connect(ctx.destination);noise.start(t);noise.stop(t+duration);noise.onended=()=>{noise.disconnect();filter.disconnect();gain.disconnect();active.delete(gain);};
 for(const hz of [85,170]){const osc=ctx.createOscillator(),engine=ctx.createGain();osc.type='sine';osc.frequency.setValueAtTime(hz,t);osc.frequency.exponentialRampToValueAtTime(hz*2.3,t+1.3);engine.gain.setValueAtTime(0,t);engine.gain.linearRampToValueAtTime(.035,t+.35);engine.gain.exponentialRampToValueAtTime(.001,t+duration);active.add(engine);osc.connect(engine);engine.connect(ctx.destination);osc.start(t);osc.stop(t+duration);osc.onended=()=>{osc.disconnect();engine.disconnect();active.delete(engine);};}
}
