import gsap from "gsap";
import * as THREE from "three";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";

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

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 0, 4);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const textureLoader = new THREE.TextureLoader();

const matcap = textureLoader.load("/textures/matcaps/8.png");

const fontLoader = new FontLoader();
const font = await fontLoader.loadAsync(
  "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
);

const material = new THREE.MeshBasicMaterial();
material.map = matcap;

const textGeometry = new TextGeometry("Hello ThreeJS", {
  font,
  size: 0.5,
  depth: 0.25,
  curveSegments: 12,
  bevelEnabled: true,
  bevelThickness: 0.01,
  bevelSize: 0.01,
  bevelSegments: 6,
});

const text = new THREE.Mesh(textGeometry, material);
textGeometry.center();
scene.add(text);

const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 64, 128);

const range = 40;

for (let i = 0; i < 600; i++) {
  const donut = new THREE.Mesh(donutGeometry, material);

  donut.position.x = (Math.random() - 0.5) * range;
  donut.position.y = (Math.random() - 0.5) * range;
  donut.position.z = (Math.random() - 0.5) * range;

  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;

  const scale = Math.random() * 1.5;
  donut.scale.set(scale, scale, scale);

  scene.add(donut);
}

const cameraPosition = { x: 0, y: 0, z: 4 };

window.addEventListener("mousemove", (e) => {
  const { clientX: rawX, clientY: rawY } = e;

  const x = (rawX / window.innerWidth - 0.5) * 2;
  const y = (rawY / window.innerHeight - 0.5) * 2;

  cameraPosition.x = x * 10;
  cameraPosition.y = -y * 6;
  cameraPosition.z = 4 - Math.max(Math.abs(x), Math.abs(y)) * 2;

  //   camera.position.z = 3 - Math.abs(y) * 1.5;
  //   camera.rotation.x = y * Math.PI * 0.5;
});

const tick = () => {
  camera.position.x += (cameraPosition.x - camera.position.x) * 0.05;
  camera.position.y += (cameraPosition.y - camera.position.y) * 0.05;
  camera.position.z += (cameraPosition.z - camera.position.z) * 0.05;

  camera.lookAt(0, 0, 0);

  //   controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();
