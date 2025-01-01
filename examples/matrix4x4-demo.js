// main.js
import * as THREE from 'three';
import * as dat from 'dat.gui';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a cube geometry and a basic material
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Create a matrix4 instance
const matrix = new THREE.Matrix4();

// Transformation parameters for GUI controls
const params = {
    translateX: 2,
    translateY: 0,
    translateZ: 0,
    rotateZ: Math.PI / 4,
    scaleX: 1.5,
    scaleY: 1.5,
    scaleZ: 1.5
};

// Function to update the cube's transformation
function updateTransformations() {
    const translation = new THREE.Matrix4().makeTranslation(params.translateX, params.translateY, params.translateZ);
    const rotation = new THREE.Matrix4().makeRotationZ(params.rotateZ);
    const scaling = new THREE.Matrix4().makeScale(params.scaleX, params.scaleY, params.scaleZ);

    matrix.identity();
    matrix.multiply(translation).multiply(rotation).multiply(scaling);
    cube.applyMatrix4(matrix);
}

// Initialize GUI
const gui = new dat.GUI();
gui.add(params, 'translateX', -10, 10).onChange(updateTransformations);
gui.add(params, 'translateY', -10, 10).onChange(updateTransformations);
gui.add(params, 'translateZ', -10, 10).onChange(updateTransformations);
gui.add(params, 'rotateZ', 0, Math.PI * 2).onChange(updateTransformations);
gui.add(params, 'scaleX', 0.1, 5).onChange(updateTransformations);
gui.add(params, 'scaleY', 0.1, 5).onChange(updateTransformations);
gui.add(params, 'scaleZ', 0.1, 5).onChange(updateTransformations);

// Apply initial transformations
updateTransformations();

// Position the camera
camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube on its own axes for visual effect
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();
