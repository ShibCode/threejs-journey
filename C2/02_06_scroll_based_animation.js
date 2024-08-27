import * as THREE from "three";
import GUI from "lil-gui";
import gsap from "gsap";

/**
 * Debug
 */
const gui = new GUI();

const parameters = {
  materialColor: "#ffeded",
};

gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
  particlesMaterial.color.set(parameters.materialColor);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Texture
 */
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("/gradients/3.jpg");
gradientTexture.magFilter = THREE.NearestFilter;

/**
 * Objects
 */
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});

const objectsDistance = 4;

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);

const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);

const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);

const sectionMeshes = [mesh1, mesh2, mesh3];

sectionMeshes.forEach((mesh, i) => {
  mesh.position.x = i % 2 === 1 ? -2 : 2;
  mesh.position.y = -objectsDistance * i;
});

scene.add(mesh1, mesh2, mesh3);

/**
 * Particles
 */

const count = 500;
const vertices = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  vertices[i * 3 + 0] = (Math.random() - 0.5) * 10;
  vertices[i * 3 + 1] =
    objectsDistance * 0.5 -
    Math.random() * objectsDistance * sectionMeshes.length;
  vertices[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(vertices, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.03,
  sizeAttenuation: true,
  color: parameters.materialColor,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("white", 3);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

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
const cameraGroup = new THREE.Group();

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);
scene.add(cameraGroup);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let prevTime = 0;

const mouse = { x: 0, y: 0 };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX / sizes.width - 0.5;
  mouse.y = e.clientY / sizes.height - 0.5;
});

let currentSection = 0;

window.addEventListener("scroll", () => {
  const newSection = Math.round(window.scrollY / sizes.height);

  if (newSection !== currentSection) {
    currentSection = newSection;

    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
      z: "+=1.5 ",
    });
  }
});

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - prevTime;
  prevTime = elapsedTime;

  camera.position.y = -(window.scrollY / sizes.height) * objectsDistance;

  sectionMeshes.forEach((mesh) => {
    mesh.rotation.x += 0.1 * deltaTime;
    mesh.rotation.y += 0.12 * deltaTime;
  });

  const parallaxX = mouse.x * 0.5;
  const parallaxY = mouse.y * 0.5;

  const distX = parallaxX - cameraGroup.position.x;
  const distY = parallaxY - cameraGroup.position.y;

  cameraGroup.position.x += distX * deltaTime * 5;
  cameraGroup.position.y += distY * deltaTime * 5;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
