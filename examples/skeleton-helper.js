// Import Three.js
import * as THREE from 'three';

// Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a light to illuminate the scene
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

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

// Add simple geometry to represent the bones
const boneGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2);
const boneMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const boneMesh1 = new THREE.Mesh(boneGeometry, boneMaterial);
boneMesh1.position.set(0, 1, 0);
scene.add(boneMesh1);

const boneMesh2 = new THREE.Mesh(boneGeometry, boneMaterial);
boneMesh2.position.set(0, 3, 0);
scene.add(boneMesh2);

// Position camera to view the scene
camera.position.set(3, 3, 5);
camera.lookAt(0, 1, 0);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the bones for animation
    bone2.rotation.z += 0.05; // Swinging motion for the second bone

    // Render the scene
    renderer.render(scene, camera);
}

animate();

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
