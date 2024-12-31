import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 20);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Materials
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x228b22,
    roughness: 0.8,
    metalness: 0.3,
});

const slipperyMaterial = new THREE.MeshStandardMaterial({
    color: 0x87ceeb,
    roughness: 0.0,
    metalness: 0.5,
});

const boxMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6347,
    roughness: 0.4,
    metalness: 0.5,
});

// Ground Plane
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.rotation.x = -Math.PI / 2;
scene.add(groundMesh);

// Boxes
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);

// Slippery Box
const slipperyBox = new THREE.Mesh(boxGeometry, slipperyMaterial);
slipperyBox.position.set(0, 1, 5);
scene.add(slipperyBox);

// Box with ground-like material
const groundBox = new THREE.Mesh(boxGeometry, boxMaterial);
groundBox.position.set(8, 1, 5);
scene.add(groundBox);

// Add gravity-like animation
const gravity = new THREE.Vector3(0, -9.8, 0);
let slipperyVelocity = new THREE.Vector3(-1, 0, 0); // initial velocity along x-axis
let groundBoxVelocity = new THREE.Vector3(-0.5, 0, 0);

function animate() {
    requestAnimationFrame(animate);

    // Apply pseudo-gravity
    if (slipperyBox.position.y > 0.5) {
        slipperyVelocity.addScaledVector(gravity, 0.01); // reduce Y
    }
    if (groundBox.position.y > 0.5) {
        groundBoxVelocity.addScaledVector(gravity, 0.01); // reduce Y
    }

    // Update positions
    slipperyBox.position.addScaledVector(slipperyVelocity, 0.1);
    groundBox.position.addScaledVector(groundBoxVelocity, 0.1);

    // Stop boxes on the ground
    if (slipperyBox.position.y <= 0.5) slipperyVelocity.y = 0;
    if (groundBox.position.y <= 0.5) groundBoxVelocity.y = 0;

    renderer.render(scene, camera);
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

animate();
