import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("/bakedShadow.jpg");
bakedShadow.colorSpace = THREE.SRGBColorSpace;
const simpleShadow = textureLoader.load("/simpleShadow.jpg");

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
gui.add(ambientLight, "intensity").min(0).max(3).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, -1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.camera.left = 1;
directionalLight.shadow.camera.top = 1;
directionalLight.shadow.camera.right = -1;
directionalLight.shadow.camera.bottom = -1;

gui.add(directionalLight, "intensity").min(0).max(3).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
scene.add(directionalLight);

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
directionalLightCameraHelper.visible = false;

scene.add(directionalLightCameraHelper);

const spotlight = new THREE.SpotLight(0xffffff, 2.7, 10, Math.PI * 0.4);

spotlight.castShadow = true;
spotlight.shadow.mapSize.width = 1024;
spotlight.shadow.mapSize.height = 1024;
spotlight.shadow.camera.fov = spotlight.angle * (180 / Math.PI);
spotlight.shadow.camera.near = 1;
spotlight.shadow.camera.far = 6;

spotlight.position.set(0, 2, 2);
scene.add(spotlight);
scene.add(spotlight.target);

const spotlightCameraHelper = new THREE.CameraHelper(spotlight.shadow.camera);
// scene.add(spotlightCameraHelper);

const pointLight = new THREE.PointLight(0xffffff, 2.7);

pointLight.castShadow = true;

pointLight.position.set(-1, 1, 0);

pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 4;

scene.add(pointLight);

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
// scene.add(pointLightCameraHelper);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.receiveShadow = true;
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    alphaMap: simpleShadow,
    transparent: true,
  })
);

sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01;

scene.add(sphere, plane, sphereShadow);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1, 1, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  const t = 1.5;

  sphere.position.x = Math.cos(elapsedTime) * t;
  sphere.position.z = Math.sin(elapsedTime) * t;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  //   console.log(sphere.position.y);
  sphereShadow.material.opacity = (1 - sphere.position.y) * 0.4;

  // console.log()

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
