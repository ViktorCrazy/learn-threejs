import './style.css';
import * as THREE from 'three';
import * as lil from 'lil-gui';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Position the camera
camera.position.z = 5;

// Keyframe tracks for rotation and color
const rotationKF = new THREE.VectorKeyframeTrack(
    '.rotation[y]',
    [0, 1, 2], // Times
    [0, Math.PI, Math.PI * 2] // Values (radians)
);

const colorKF = new THREE.ColorKeyframeTrack(
    '.material.color',
    [0, 1, 2], // Times
    [0, 1, 0, 1, 0, 1, 0, 0, 1] // RGB values interleaved
);

// Create an animation clip
const clip = new THREE.AnimationClip('CubeAnimation', 2, [rotationKF, colorKF]);

// Set up the animation mixer and action
const mixer = new THREE.AnimationMixer(cube);
const action = mixer.clipAction(clip);
action.play();

// Animation loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);

    // Update the mixer with the elapsed time
    const delta = clock.getDelta();
    mixer.update(delta);

    renderer.render(scene, camera);
}
animate();

// Optional: Add GUI controls to restart the animation
const gui = new lil.GUI();
gui.add({ restart: () => action.reset().play() }, 'restart');