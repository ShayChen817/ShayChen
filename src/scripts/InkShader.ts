import { Renderer, Program, Triangle, Mesh, Texture, Vec2 } from 'ogl';

/** Preserve the generated ink photograph; animate a small, non-accumulating UV flow. */
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
    pointer:{value:new Vec2(-2,-2)}, impulse:{value:new Vec2()},
  };
  const program = new Program(gl, {
    vertex:'attribute vec2 uv; attribute vec2 position; varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position,0.,1.);}',
    fragment:`precision highp float;
      varying vec2 vUv; uniform sampler2D photograph; uniform float time,viewAspect,imageAspect; uniform vec2 pointer,impulse;
      // Smooth analytic currents deform the original detail by just a few pixels.
      void main(){
        vec2 cover=vec2(min(1.,viewAspect/imageAspect),min(1.,imageAspect/viewAspect));
        vec2 uv=(vUv-.5)*cover/1.025+.5;
        float t=time*.12;
        vec2 flow=vec2(sin(uv.y*9.+t)*cos(uv.x*5.-t*.7),cos(uv.x*8.-t*.8)*sin(uv.y*6.+t*.5));
        flow+=.35*vec2(sin(uv.y*19.-t*.6+uv.x*7.),cos(uv.x*17.+t*.5-uv.y*5.));
        vec2 delta=(vUv-pointer)*vec2(viewAspect,1.);
        float wake=exp(-dot(delta,delta)*13.);
        uv+=flow*.0035+impulse*cover*wake*.012;
        gl_FragColor=texture2D(photograph,clamp(uv,vec2(.001),vec2(.999)));
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
    renderer.dpr=Math.min(devicePixelRatio||1,2,3072/w,2160/h,Math.sqrt(4800000/(w*h)));
    renderer.setSize(w,h);uniforms.viewAspect.value=w/h;
  }
  // A responsive picture can change its source when the viewport crosses 700px.
  function sourceChanged(){texture.image=poster!;texture.needsUpdate=true;uniforms.imageAspect.value=poster!.naturalWidth/poster!.naturalHeight;}
  function render(now:number){
    frame=0;
    if(!visible||document.hidden||reduced.matches||destroyed){canvas.dataset.running='false';return;}
    if(now-last>=40){
      elapsed+=Math.min((now-last)/1000,.06);last=now;
      uniforms.time.value=elapsed;
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
