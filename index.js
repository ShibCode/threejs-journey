import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import GUI from "lil-gui";

// window.addEventListener("dblclick", () => {
//   const fullscreenElement =
//     document.fullscreenElement || document.webkitFullscreenElement;

//   if (!fullscreenElement) {
//     if (canvas.requestFullscreen) canvas.requestFullscreen();
//     else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
//   } else {
//     if (document.exitFullscreen) document.exitFullscreen();
//     else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
//   }
// });

const gui = new GUI({
  width: 300,
  title: "Nice",
});

gui.hide();

window.addEventListener("keydown", (e) => {
  if (e.key === "h") {
    gui.show(gui._hidden);
  }
});

const debugObject = {
  materialColor: "#11e864",
};
const cubeTweaks = gui.addFolder("Awesome Cube");

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

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);

const mesh = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({
    color: debugObject.materialColor,
    wireframe: true,
  })
);
scene.add(mesh);

cubeTweaks.add(mesh.position, "y").min(-3).max(3).step(0.01);
cubeTweaks.add(mesh, "visible");
cubeTweaks.add(mesh.material, "wireframe");
cubeTweaks.addColor(debugObject, "materialColor").onChange(() => {
  mesh.material.color.set(debugObject.materialColor);
});

debugObject.spin = () => {
  gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2 });
};

cubeTweaks.add(debugObject, "spin");

debugObject.subdivision = 2;

cubeTweaks
  .add(debugObject, "subdivision")
  .min(1)
  .max(200)
  .step(1)
  .onChange(() => {
    mesh.geometry.dispose();

    const newGeometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      debugObject.subdivision,
      debugObject.subdivision,
      debugObject.subdivision
    );
    mesh.geometry = newGeometry;
  });

const aspectRatio = sizes.width / sizes.height;

const camera = new THREE.PerspectiveCamera(75, aspectRatio);
scene.add(camera);
camera.position.set(0, 0, 3);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const cursor = { x: 0, y: 0 };

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);
});

const tick = () => {
  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
