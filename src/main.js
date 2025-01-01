import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
import * as dat from 'dat.gui';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 10, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Objects
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 1, 0);
box.castShadow = true;
scene.add(box);

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

// Point Light
const pointLight = new THREE.PointLight(0xffffff, 1, 50, 2);
pointLight.position.set(5, 5, 5);
pointLight.castShadow = true;
scene.add(pointLight);

const sphereGeometry = new THREE.SphereGeometry(0.2);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const pointLightHelper = new THREE.Mesh(sphereGeometry, sphereMaterial);
pointLightHelper.position.copy(pointLight.position);
scene.add(pointLightHelper);

// Spot Light
const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(-5, 10, -5);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.2;
spotLight.castShadow = true;
scene.add(spotLight);

// Hemisphere Light
const hemisphereLight = new THREE.HemisphereLight(0x4040ff, 0xff8040, 0.6);
scene.add(hemisphereLight);

// Rect Area Light
const rectLight = new THREE.RectAreaLight(0xffffff, 5, 4, 2);
rectLight.position.set(-7, 3, 0);
rectLight.lookAt(0, 1, 0);
scene.add(rectLight);

// Helper for Rect Area Light
const rectLightHelper = new RectAreaLightHelper(rectLight);
rectLight.add(rectLightHelper);

// LightProbe
const lightProbe = new THREE.LightProbe();
scene.add(lightProbe);

// dat.GUI
const gui = new dat.GUI();

// Box controls
const boxFolder = gui.addFolder('Box');
boxFolder.add(box.position, 'x', -10, 10).name('Position X');
boxFolder.add(box.position, 'y', 0, 10).name('Position Y');
boxFolder.add(box.position, 'z', -10, 10).name('Position Z');
boxFolder.addColor(boxMaterial, 'color').name('Color');
boxFolder.open();

// Ambient Light controls
const ambientLightFolder = gui.addFolder('Ambient Light');
ambientLightFolder.add(ambientLight, 'intensity', 0, 1).name('Intensity');
ambientLightFolder.open();

// Directional Light controls
const directionalLightFolder = gui.addFolder('Directional Light');
directionalLightFolder.add(directionalLight.position, 'x', -20, 20).name('Position X');
directionalLightFolder.add(directionalLight.position, 'y', -20, 20).name('Position Y');
directionalLightFolder.add(directionalLight.position, 'z', -20, 20).name('Position Z');
directionalLightFolder.add(directionalLight, 'intensity', 0, 2).name('Intensity');
directionalLightFolder.open();

// Point Light controls
const pointLightFolder = gui.addFolder('Point Light');
pointLightFolder.add(pointLight.position, 'x', -20, 20).name('Position X');
pointLightFolder.add(pointLight.position, 'y', -20, 20).name('Position Y');
pointLightFolder.add(pointLight.position, 'z', -20, 20).name('Position Z');
pointLightFolder.add(pointLight, 'intensity', 0, 2).name('Intensity');
pointLightFolder.open();

// Spot Light controls
const spotLightFolder = gui.addFolder('Spot Light');
spotLightFolder.add(spotLight.position, 'x', -20, 20).name('Position X');
spotLightFolder.add(spotLight.position, 'y', -20, 20).name('Position Y');
spotLightFolder.add(spotLight.position, 'z', -20, 20).name('Position Z');
spotLightFolder.add(spotLight, 'intensity', 0, 2).name('Intensity');
spotLightFolder.add(spotLight, 'angle', 0, Math.PI / 2).name('Angle');
spotLightFolder.add(spotLight, 'penumbra', 0, 1).name('Penumbra');
spotLightFolder.open();

// Hemisphere Light controls
const hemisphereLightFolder = gui.addFolder('Hemisphere Light');
hemisphereLightFolder.add(hemisphereLight, 'intensity', 0, 1).name('Intensity');
// hemisphereLightFolder.addColor(hemisphereLight, 'skyColor').name('Sky Color');
hemisphereLightFolder.addColor(hemisphereLight, 'groundColor').name('Ground Color');
hemisphereLightFolder.open();

// Rect Area Light controls
const rectLightFolder = gui.addFolder('Rect Area Light');
rectLightFolder.add(rectLight.position, 'x', -20, 20).name('Position X');
rectLightFolder.add(rectLight.position, 'y', -20, 20).name('Position Y');
rectLightFolder.add(rectLight.position, 'z', -20, 20).name('Position Z');
rectLightFolder.add(rectLight, 'intensity', 0, 10).name('Intensity');
rectLightFolder.open();

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
