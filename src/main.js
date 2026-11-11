import * as THREE from 'three';
import './style.css';

const loading = document.querySelector('#loading');
const altitudeLabel = document.querySelector('#altitude');
const speedLabel = document.querySelector('#speed');
const startScreen = document.querySelector('#start-screen');
const controls = { up:false, down:false, left:false, right:false };
let started = false;
let verticalVelocity = 0;
let heading = 0;
let horizontalSpeed = 0;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8bd1e9);
scene.fog = new THREE.Fog(0xaddde8, 65, 260);

const camera = new THREE.PerspectiveCamera(58, innerWidth/innerHeight, 0.1, 500);
camera.position.set(0, 5, 13);

const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
document.querySelector('#game').prepend(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xe6f8ff, 0x55734b, 2.0));
const sun = new THREE.DirectionalLight(0xffedcf, 2.5);
sun.position.set(-35,55,25); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024); scene.add(sun);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(700,700), new THREE.MeshStandardMaterial({color:0x6fae79,roughness:1}));
ground.rotation.x=-Math.PI/2; ground.position.y=-9; ground.receiveShadow=true; scene.add(ground);

function makeHill(x,z,sx,sy,sz,color){
 const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,24,18),new THREE.MeshStandardMaterial({color,roughness:1}));
 mesh.position.set(x,-8+sy*.2,z); mesh.scale.set(sx,sy,sz); mesh.receiveShadow=true; scene.add(mesh);
}
for(let i=0;i<22;i++){const a=i/22*Math.PI*2;const r=85+(i%4)*13;makeHill(Math.cos(a)*r,-70+Math.sin(a)*r,24+(i%3)*9,12+(i%4)*4,30, i%2?0x6eaa78:0x82b77c);}
function cloud(x,y,z,s=1){
 const group=new THREE.Group();
 for(let i=0;i<5;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(1,16,12),new THREE.MeshStandardMaterial({color:0xffffff,roughness:1}));m.position.set((i-2)*1.05,Math.sin(i*1.7)*.35,0);m.scale.set(1.15,.65+(i%2)*.18,.75);group.add(m);}
 group.position.set(x,y,z);group.scale.setScalar(s);scene.add(group);return group;
}
const clouds=[];for(let i=0;i<18;i++)clouds.push(cloud((Math.random()-.5)*170,12+Math.random()*35,-35-Math.random()*150,.8+Math.random()*1.4));

const balloon=new THREE.Group();scene.add(balloon);
const envelopeMat=new THREE.MeshStandardMaterial({color:0xe85d42,roughness:.72});
const envelope=new THREE.Mesh(new THREE.SphereGeometry(1,32,24),envelopeMat);
envelope.scale.set(1.15,1.48,1.15);envelope.position.y=2.5;envelope.castShadow=true;balloon.add(envelope);
// Decorative vertical gores
for(let i=0;i<10;i++){
 const a=i/10*Math.PI*2;
 const stripe=new THREE.Mesh(new THREE.SphereGeometry(1.006,12,24, a, .12),new THREE.MeshStandardMaterial({color:i%2?0xffd17b:0xf7eee0,roughness:.8}));
 stripe.scale.copy(envelope.scale);stripe.position.copy(envelope.position);balloon.add(stripe);
}
const neck=new THREE.Mesh(new THREE.CylinderGeometry(.43,.55,.35,24),new THREE.MeshStandardMaterial({color:0x6d3e2b}));neck.position.y=1.05;balloon.add(neck);
const basket=new THREE.Mesh(new THREE.BoxGeometry(.82,.68,.82),new THREE.MeshStandardMaterial({color:0x9b6338,roughness:1}));basket.position.y=-.55;basket.castShadow=true;balloon.add(basket);
const ropeMat=new THREE.MeshStandardMaterial({color:0x493a2c});
for(const x of [-.32,.32])for(const z of [-.32,.32]){
 const rope=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,1.15,6),ropeMat);rope.position.set(x,.25,z);balloon.add(rope);
}
const burner=new THREE.PointLight(0xffa13a,2,5);burner.position.y=.45;balloon.add(burner);
balloon.position.set(0,5,0);

const ring=new THREE.Mesh(new THREE.TorusGeometry(2.2,.018,8,64),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.24}));
ring.rotation.x=Math.PI/2;ring.position.y=-8.8;scene.add(ring);

const clock=new THREE.Clock();
function bindButton(button){
 const key=button.dataset.control;
 const on=()=>{controls[key]=true;button.classList.add('active');};
 const off=()=>{controls[key]=false;button.classList.remove('active');};
 button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);on();});
 button.addEventListener('pointerup',off);button.addEventListener('pointercancel',off);button.addEventListener('lostpointercapture',off);
}
document.querySelectorAll('[data-control]').forEach(bindButton);
addEventListener('keydown',e=>{const map={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};if(map[e.key])controls[map[e.key]]=true;});
addEventListener('keyup',e=>{const map={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};if(map[e.key])controls[map[e.key]]=false;});
document.querySelector('#start-button').addEventListener('click',()=>{started=true;startScreen.classList.add('hidden');});

function animate(){
 requestAnimationFrame(animate);
 const dt=Math.min(clock.getDelta(),.04);
 const t=clock.elapsedTime;
 if(started){
  if(controls.up)verticalVelocity=Math.min(verticalVelocity+dt*2.1,4.5);
  else if(controls.down)verticalVelocity=Math.max(verticalVelocity-dt*2.5,-3.2);
  else verticalVelocity*=Math.pow(.35,dt);
  balloon.position.y=THREE.MathUtils.clamp(balloon.position.y+verticalVelocity*dt,1,48);
  if(controls.left)heading+=dt*.75;
  if(controls.right)heading-=dt*.75;
  balloon.rotation.z=THREE.MathUtils.damp(balloon.rotation.z,controls.left?-.12:controls.right?.12:0,3,dt);
  balloon.rotation.y=THREE.MathUtils.damp(balloon.rotation.y,heading,3,dt);
  horizontalSpeed=THREE.MathUtils.damp(horizontalSpeed,(controls.left||controls.right?18:7),1.2,dt);
  balloon.position.x+=Math.sin(heading)*horizontalSpeed*dt*.12;
  balloon.position.z-=Math.cos(heading)*horizontalSpeed*dt*.12;
  camera.position.x=THREE.MathUtils.damp(camera.position.x,balloon.position.x+Math.sin(heading)*1.2,2,dt);
  camera.position.y=THREE.MathUtils.damp(camera.position.y,balloon.position.y+4.5,2,dt);
  camera.position.z=THREE.MathUtils.damp(camera.position.z,balloon.position.z+12,2,dt);
  camera.lookAt(balloon.position.x,balloon.position.y+1,balloon.position.z-4);
  altitudeLabel.textContent=Math.round(120+(balloon.position.y-5)*38)+' m';
  speedLabel.textContent=Math.round(Math.abs(verticalVelocity)*5+horizontalSpeed)+' km/h';
 }else{
  balloon.position.y=5+Math.sin(t*.7)*.18;
  balloon.rotation.z=Math.sin(t*.35)*.025;
  camera.lookAt(0,5,0);
 }
 clouds.forEach((c,i)=>{c.position.x+=dt*(.25+(i%3)*.08);if(c.position.x>110)c.position.x=-110;});
 burner.intensity=1.6+Math.sin(t*12)*.35;
 renderer.render(scene,camera);
}
animate();
setTimeout(()=>loading.classList.add('done'),650);

addEventListener('resize',()=>{
 camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
 renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
});
