import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/Addons.js";

// GUI
const gui = new GUI();

// CANVAS
const canvas = document.querySelector("canvas.webgl");

// SIZE
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// SCENE
const scene = new THREE.Scene();

// ENVIRONMENT
const rgbeLoader = new RGBELoader();
rgbeLoader.load("/textures/environmentMap/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

// TEXTURES
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;

// DEBUG UI

// OBJECTS

// MESH BASIC MATERIAL
// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture;
// material.color = new THREE.Color(0xff0000);
// material.wireframe = true;
// material.transparent = true;
// material.opacity = 0.2;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide;

// MESH NORMAL MATERIAL
// const material = new THREE.MeshNormalMaterial();
// material.side = THREE.DoubleSide;

// MESH MATCHCAP MATERIAL
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// MESH DEPTH MATERIAL
// const material = new THREE.MeshDepthMaterial();

// MESH LAMBERT MATERIAL
// const material = new THREE.MeshLambertMaterial();

// MESH PHONG MATERIAL
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff);

// MESH TOON MATERIAL
// const material = new THREE.MeshToonMaterial();
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false
// material.gradientMap = gradientTexture;

// MESH STANDARD MATERIAL
// const material = new THREE.MeshStandardMaterial();
// material.metalness = 1;
// material.roughness = 1;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.1;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

// gui.add(material, "metalness").min(0).max(1).step(0.0001);
// gui.add(material, "roughness").min(0).max(1).step(0.0001);

// MESH PHYSICAL MATERIAL
const material = new THREE.MeshPhysicalMaterial();
material.metalness = 0;
material.roughness = 0;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.1;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

// material.clearcoat = 1;
// material.clearcoatRoughness = 0;

// material.sheen = 1;
// material.sheenRoughness = 0.25;

// material.sheenColor.set(1, 1, 1);

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
// gui.add(material, "clearcoat").min(0).max(1).step(0.0001);
// gui.add(material, "clearcoatRoughness").min(0).max(1).step(0.0001);
// gui.add(material, "sheen").min(0).max(1).step(0.0001);
// gui.add(material, "sheenRoughness").min(0).max(1).step(0.0001);
// gui.addColor(material, "sheenColor");

// material.iridescence = 1;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [100, 800];

// gui.add(material, "iridescence").min(0).max(1).step(0.0001);
// gui.add(material, "iridescenceIOR").min(0).max(2.333).step(0.0001);
// gui.add(material.iridescenceThicknessRange, "0").min(0).max(1000).step(0.0001);
// gui.add(material.iridescenceThicknessRange, "1").min(0).max(1000).step(0.0001);

material.transmission = 1;
material.ior = 1.5;
material.thickness = 0.5;

gui.add(material, "transmission").min(0).max(1).step(0.0001);
gui.add(material, "ior").min(0).max(10).step(0.0001);
gui.add(material, "thickness").min(0).max(1).step(0.0001);

material.side = THREE.DoubleSide;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

// CAMERA
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 0, 3);

// LIGHTS
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.set(2, 3, 4);
// scene.add(pointLight);

// ADD TO SCENE
scene.add(camera);

// RENDERER
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

// ORBIT CONTROL
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;

// CLOCK
const clock = new THREE.Clock();

// TICK
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.x = -0.15 * elapsedTime;
  plane.rotation.x = -0.15 * elapsedTime;
  torus.rotation.x = -0.15 * elapsedTime;

  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  orbitControls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};

tick();
