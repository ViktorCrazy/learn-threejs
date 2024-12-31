// Import Three.js
import * as THREE from 'three';

// Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// AxesHelper: Shows XYZ axes (Red: X, Green: Y, Blue: Z)
const axesHelper = new THREE.AxesHelper(5); // Length of axes
scene.add(axesHelper);

// GridHelper: Creates a grid on the ground plane
const gridHelper = new THREE.GridHelper(10, 10); // Size and divisions
scene.add(gridHelper);

// Create a BoxGeometry and a BoxHelper
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(cube);

// BoxHelper: Shows the bounding box of the cube
const boxHelper = new THREE.BoxHelper(cube, 0xffff00); // Yellow bounding box
scene.add(boxHelper);

// Add a DirectionalLight and its helper
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// CameraHelper: Visualizes the camera's frustum
const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);

// ArrowHelper: Indicates a direction in space
const direction = new THREE.Vector3(1, 1, 0).normalize(); // Direction vector
const origin = new THREE.Vector3(0, 0, 0); // Starting point of the arrow
const length = 3; // Length of the arrow
const color = 0xff0000; // Red color
const arrowHelper = new THREE.ArrowHelper(direction, origin, length, color);
scene.add(arrowHelper);

// SkeletonHelper: Visualizes the skeleton of a skinned mesh
const skeletonBones = [];
const bone1 = new THREE.Bone();
bone1.position.set(0, 0, 0);
const bone2 = new THREE.Bone();
bone2.position.set(0, 2, 0);
bone1.add(bone2);
skeletonBones.push(bone1, bone2);

const skeletonHelper = new THREE.SkeletonHelper(bone1);
scene.add(skeletonHelper);

// Position camera to view the scene
camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube for demonstration
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Update the boxHelper to reflect the cube's new position
    boxHelper.update();

    renderer.render(scene, camera);
}

animate();

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
