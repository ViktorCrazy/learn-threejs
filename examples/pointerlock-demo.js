import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue background

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ground plane
const planeGeometry = new THREE.PlaneGeometry(200, 200);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // Grass green
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotate plane to be horizontal
scene.add(plane);

// Add some cubes as obstacles
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 }); // Tomato red
for (let i = 0; i < 10; i++) {
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(
        Math.random() * 50 - 25, // Random position in x (-25 to 25)
        1, // Elevate slightly above the ground
        Math.random() * 50 - 25 // Random position in z (-25 to 25)
    );
    scene.add(cube);
}

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// PointerLockControls setup
const controls = new PointerLockControls(camera, document.body);

document.addEventListener('click', () => {
    controls.lock();
});

// Lock event handlers
controls.addEventListener('lock', () => {
    console.log('Pointer is locked');
});

controls.addEventListener('unlock', () => {
    console.log('Pointer is unlocked');
});

// Movement logic
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const moveSpeed = 5;
const keys = {};

document.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

function animate() {
    requestAnimationFrame(animate);

    if (controls.isLocked) {
        // Compute direction
        direction.z = Number(keys['KeyW']) - Number(keys['KeyS']);
        direction.x = Number(keys['KeyD']) - Number(keys['KeyA']);
        direction.normalize();

        // Update velocity
        velocity.z -= velocity.z * 0.1; // Damping
        velocity.x -= velocity.x * 0.1; // Damping

        velocity.z += direction.z * moveSpeed * 0.1;
        velocity.x += direction.x * moveSpeed * 0.1;

        // Apply velocity
        controls.moveRight(-velocity.x);
        controls.moveForward(-velocity.z);
    }

    renderer.render(scene, camera);
}

animate();
