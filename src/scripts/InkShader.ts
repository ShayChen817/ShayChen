import { Renderer, Program, Triangle, Mesh, Texture, Vec2 } from 'ogl';

/** Ambient ink currents become a refractive shoreline during the opening scroll shot. */
export async function initInk(canvas: HTMLCanvasElement, hero: HTMLElement) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const poster = hero.querySelector<HTMLImageElement>('.hero-poster');
  if (!poster || reduced.matches || canvas.dataset.initialized) return;
  try { await poster.decode(); } catch { return; }
  let renderer: Renderer;
  try { renderer = new Renderer({ canvas, dpr:1, alpha:false, antialias:false, depth:false, powerPreference:'low-power' }); } catch { return; }
  const gl = renderer.gl;
  const texture = new Texture(gl, { image:poster, generateMipmaps:false, minFilter:gl.LINEAR, magFilter:gl.LINEAR });
  const geometry = new Triangle(gl);
  const uniforms = {
    photograph:{value:texture}, time:{value:0}, viewAspect:{value:1}, imageAspect:{value:poster.naturalWidth/poster.naturalHeight},
    pointer:{value:new Vec2(-2,-2)}, impulse:{value:new Vec2()}, tide:{value:0},
  };
  const program = new Program(gl, {
    vertex:'attribute vec2 uv; attribute vec2 position; varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position,0.,1.);}',
    fragment:`precision highp float;
      varying vec2 vUv; uniform sampler2D photograph; uniform float time,viewAspect,imageAspect,tide; uniform vec2 pointer,impulse;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){
        vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);
      }
      float fbm(vec2 p){
        float n=0.,a=.5;
        for(int i=0;i<4;i++){n+=a*noise(p);p=mat2(1.6,1.2,-1.2,1.6)*p;a*=.5;}
        return n;
      }
      void main(){
        vec2 cover=vec2(min(1.,viewAspect/imageAspect),min(1.,imageAspect/viewAspect));
        vec2 uv=(vUv-.5)*cover/1.025+.5;
        float t=time*.12;
        float advance=smoothstep(.02,.94,tide);
        float energy=sin(advance*3.14159265);
        vec2 flow=vec2(sin(uv.y*9.+t)*cos(uv.x*5.-t*.7),cos(uv.x*8.-t*.8)*sin(uv.y*6.+t*.5));
        flow+=.35*vec2(sin(uv.y*19.-t*.6+uv.x*7.),cos(uv.x*17.+t*.5-uv.y*5.));
        vec2 delta=(vUv-pointer)*vec2(viewAspect,1.);
        float wake=exp(-dot(delta,delta)*13.);
        // A diagonal shoreline with multiple frequencies, rather than a straight wipe.
        vec2 sea=vec2(vUv.x*viewAspect,vUv.y);
        float turbulence=fbm(sea*4.+vec2(-t*.6,t*.3));
        float shore=advance*1.65-.28 + .105*sin(sea.x*3.2+t)
          + .045*sin(sea.x*8.5-t*1.7) + (turbulence-.5)*.19;
        float depth=shore-vUv.y;
        float crest=exp(-abs(depth)*25.)*energy;
        float swell=sin(depth*25.-t*4.)*exp(-abs(depth)*5.)*energy;
        uv+=(flow*.0035+impulse*cover*wake*.012);
        uv=(uv-.5)/(1.+energy*.18)+.5;
        uv.y+=advance*.12+energy*(flow.y*.045+swell*.065);
        uv.x+=energy*flow.x*.035;
        vec3 ink=texture2D(photograph,clamp(uv,vec2(.001),vec2(.999))).rgb;
        // Cold mineral blue and silver foam stay within the original ink palette.
        float veins=fbm(sea*vec2(14.,28.)+vec2(t,-t*2.));
        float foam=crest*smoothstep(.26,.69,veins);
        float lace=exp(-abs(depth+.012+veins*.025)*95.)*energy;
        vec3 deep=vec3(.04706,.05098,.06275);
        float flooded=smoothstep(-.04,.12,depth);
        vec3 water=mix(ink*.48,deep,smoothstep(.05,.38,depth));
        water+=vec3(.12,.19,.23)*exp(-abs(depth-.055)*11.)*energy;
        vec3 color=mix(ink,water,flooded);
        color+=foam*vec3(.40,.44,.43)*1.05;
        color+=lace*vec3(.23,.29,.30)*.5;
        color+=vec3(.055,.08,.10)*max(0.,swell);
        color=mix(color,deep,smoothstep(.82,1.,tide));
        gl_FragColor=vec4(color,1.);
      }`,
    uniforms, depthTest:false, depthWrite:false,
  });
  const scene = new Mesh(gl,{geometry,program});
  canvas.dataset.initialized='true';
  let frame=0, visible=false, destroyed=false, last=0, elapsed=0, ticks=0;
  const previous=new Vec2(-2,-2), targetImpulse=new Vec2();
  function pointerMove(event:PointerEvent){
    const r=hero.getBoundingClientRect(),x=(event.clientX-r.left)/r.width,y=1-(event.clientY-r.top)/r.height;
    if(previous.x>=0) targetImpulse.set(Math.max(-.7,Math.min(.7,(x-previous.x)*14)),Math.max(-.7,Math.min(.7,(y-previous.y)*14)));
    previous.set(x,y);uniforms.pointer.value.set(x,y);
  }
  function pointerLeave(){previous.set(-2,-2);targetImpulse.set(0,0);}
  function resize(){
    const w=hero.clientWidth,h=hero.clientHeight;
    renderer.dpr=Math.min(devicePixelRatio||1,1.5,2560/w,1600/h,Math.sqrt(2400000/(w*h)));
    renderer.setSize(w,h);uniforms.viewAspect.value=w/h;
  }
  // A responsive picture can change its source when the viewport crosses 700px.
  function sourceChanged(){texture.image=poster!;texture.needsUpdate=true;uniforms.imageAspect.value=poster!.naturalWidth/poster!.naturalHeight;}
  function render(now:number){
    frame=0;
    if(!visible||document.hidden||reduced.matches||destroyed){canvas.dataset.running='false';return;}
    const tide=Number(hero.dataset.tideProgress || 0);
    const moving=Math.abs(tide-uniforms.tide.value)>.0001;
    if(now-last>=(moving?15:40)){
      elapsed+=Math.min((now-last)/1000,.06);last=now;
      uniforms.time.value=elapsed;
      uniforms.tide.value=tide;
      uniforms.impulse.value.lerp(targetImpulse,.09);targetImpulse.multiply(.94);
      renderer.render({scene});canvas.classList.add('ready');canvas.dataset.frames=String(++ticks);
    }
    frame=requestAnimationFrame(render);
  }
  function sync(){
    if(frame)cancelAnimationFrame(frame);frame=0;
    const active=visible&&!document.hidden&&!reduced.matches&&!destroyed;
    canvas.dataset.running=String(active);
    if(reduced.matches)canvas.classList.remove('ready');
    if(active){last=performance.now();frame=requestAnimationFrame(render);}
  }
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});
  const resizer=new ResizeObserver(resize);
  hero.addEventListener('pointermove',pointerMove,{passive:true});hero.addEventListener('pointerleave',pointerLeave);
  poster.addEventListener('load',sourceChanged);document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();destroyed=true;canvas.classList.remove('ready');sync();});
  resize();observer.observe(hero);resizer.observe(hero);
  window.addEventListener('pagehide',()=>{
    destroyed=true;sync();observer.disconnect();resizer.disconnect();
    hero.removeEventListener('pointermove',pointerMove);hero.removeEventListener('pointerleave',pointerLeave);
    poster.removeEventListener('load',sourceChanged);document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);
    gl.deleteTexture(texture.texture);gl.deleteProgram(program.program);geometry.remove();
  },{once:true});
}
