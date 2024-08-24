import GUI from "lil-gui";
import * as THREE from "three";
import {
  DRACOLoader,
  GLTFLoader,
  OrbitControls,
} from "three/examples/jsm/Addons.js";

const gui = new GUI();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const handleResize = () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

window.addEventListener("resize", handleResize);

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(20, sizes.width / sizes.height);
camera.position.set(0, 0, 4);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.4.1/"
);
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

let compoundModel = null;

loader.load("/Compound.glb", (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.rotation.y = Math.PI * 0.25;
  gui.add(gltf.scene.rotation, "x").min(0).max(Math.PI).step(0.00001);
  gui.add(gltf.scene.rotation, "y").min(0).max(Math.PI).step(0.00001);
  gui.add(gltf.scene.rotation, "z").min(0).max(Math.PI).step(0.00001);
  compoundModel = gltf.scene;
});

const light1 = new THREE.PointLight("white", 5);
const light2 = new THREE.PointLight("white", 5);
const light3 = new THREE.PointLight("white", 5);
const light4 = new THREE.PointLight("white", 5);
const light5 = new THREE.PointLight("white", 5);
const light6 = new THREE.PointLight("white", 5);
light1.position.set(0.5, 0, 0);
light2.position.set(-0.5, 0, 0);
light3.position.set(0, 0.5, 0);
light4.position.set(0, -0.5, 0);
light5.position.set(0, 0, 0.5);
light6.position.set(0, 0, -0.5);
scene.add(light1, light2, light3, light4, light5, light6);

const mousePos = { x: 0, y: 0 };
const handleMouseMove = (e) => {
  mousePos.x = (e.clientX / window.innerWidth - 0.5) * 2;
  mousePos.y = (e.clientY / window.innerHeight - 0.5) * 2;
};
document.addEventListener("mousemove", handleMouseMove);

const FRICTION = 0.1;

const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();
