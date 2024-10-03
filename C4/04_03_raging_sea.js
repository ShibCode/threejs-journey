import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import fragmentShader from "./shaders/04_03_raging_sea/fragment.glsl";
import vertexShader from "./shaders/04_03_raging_sea/vertex.glsl";

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });
const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(3, 3, 512, 512);

debugObject.depthColor = "#186691";
debugObject.surfaceColor = "#9bd8ff";

// Material
const waterMaterial = new THREE.ShaderMaterial({
  fragmentShader,
  vertexShader,
  side: THREE.DoubleSide,
  uniforms: {
    uBigWavesElevation: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
    uBigWavesSpeed: { value: 0.75 },

    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallWavesIterations: { value: 2.0 },

    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: { value: 0.19 },
    uColorMultiplier: { value: 4.375 },
    uTime: { value: 0 },
  },
});

gui
  .add(waterMaterial.uniforms.uBigWavesElevation, "value", 0, 1, 0.001)
  .name("elevation");
gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "x", 0, 10, 0.001)
  .name("frequency x");
gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "y", 0, 10, 0.001)
  .name("frequency y");
gui
  .add(waterMaterial.uniforms.uBigWavesSpeed, "value", 0, 4, 0.001)
  .name("speed");
gui
  .add(waterMaterial.uniforms.uColorOffset, "value", 0, 1, 0.001)
  .name("color offset");
gui
  .add(waterMaterial.uniforms.uColorMultiplier, "value", 0, 10, 0.001)
  .name("color multiplier");
gui
  .add(waterMaterial.uniforms.uSmallWavesElevation, "value", 0, 1, 0.001)
  .name("small waves elevation");
gui
  .add(waterMaterial.uniforms.uSmallWavesFrequency, "value", 0, 10, 0.001)
  .name("small waves frquency");
gui
  .add(waterMaterial.uniforms.uSmallWavesSpeed, "value", 0, 1, 0.001)
  .name("small waves speed");
gui
  .add(waterMaterial.uniforms.uSmallWavesIterations, "value", 0, 10, 1)
  .name("small waves iterations");
gui.addColor(debugObject, "depthColor").onChange(() => {
  waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
});

gui.addColor(debugObject, "surfaceColor").onChange(() => {
  waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
});

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

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
camera.position.set(1, 1, 1);
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

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  waterMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
