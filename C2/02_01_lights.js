import * as THREE from "three";
import {
  OrbitControls,
  RectAreaLightHelper,
} from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

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

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 0, 4);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.material.side = THREE.DoubleSide;
plane.rotation.x = Math.PI * 0.5;
plane.position.y = -0.65;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

scene.add(sphere, cube, torus, plane);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9);
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9);
scene.add(hemisphereLight);

const pointLight = new THREE.PointLight(0xff9000, 1.5, 10, 2);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(cube.position);
scene.add(rectAreaLight);

const spotLight = new THREE.SpotLight(0x78ff00, 5, 10, Math.PI * 0.1, 0.5, 1);
spotLight.position.set(0, 2, 3);
spotLight.target.position.x = -1;
scene.add(spotLight, spotLight.target);

// Helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

scene.add(hemisphereLightHelper, directionalLightHelper, pointLightHelper);

const ambientLightFolder = gui.addFolder("Ambient Light");
ambientLightFolder.add(ambientLight, "intensity").min(0).max(3).step(0.01);

const directionalLightFolder = gui.addFolder("Directional Light");
directionalLightFolder
  .add(directionalLight.position, "x")
  .min(-10)
  .max(10)
  .step(0.001);
directionalLightFolder
  .add(directionalLight.position, "y")
  .min(-10)
  .max(10)
  .step(0.001);
directionalLightFolder
  .add(directionalLight.position, "z")
  .min(-10)
  .max(10)
  .step(0.001);
directionalLightFolder
  .add(directionalLight, "intensity")
  .min(0)
  .max(3)
  .step(0.001);

const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();
