import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x20232a);

// Camera setup
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 2, 5);

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Animation mixers
const mixers = [];

// FBX loader
const fbxLoader = new FBXLoader();

// Function to add a new FBX instance
function addFBXInstance() {
    fbxLoader.load(
        '/rp_sophia_animated_003_idling.fbx', // Replace with your FBX file path
        (fbx) => {
            fbx.scale.set(0.01, 0.01, 0.01); // Adjust the scale if necessary
            fbx.position.set(
                Math.random() * 4 - 2, // Random x position
                0,
                Math.random() * 4 - 2 // Random z position
            );
            scene.add(fbx);

            // Create animation mixer
            const mixer = new THREE.AnimationMixer(fbx);
            if (fbx.animations.length > 0) {
                const action = mixer.clipAction(fbx.animations[0]);
                action.play();
            }
            mixers.push(mixer);
        },
        (xhr) => {
            console.log(`FBX Model: ${(xhr.loaded / xhr.total) * 100}% loaded`);
        },
        (error) => {
            console.error('Error loading FBX model:', error);
        }
    );
}

// Add an initial FBX instance
addFBXInstance();

// Handle click to add more FBX instances
window.addEventListener('click', addFBXInstance);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    mixers.forEach((mixer) => mixer.update(delta));

    controls.update();
    renderer.render(scene, camera);
}
animate();
