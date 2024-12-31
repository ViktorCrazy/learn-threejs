import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 5;

// Create geometry (simple rectangular body)
const geometry = new THREE.BoxGeometry(1, 2, 1, 2, 4, 2);

// Create skeleton
const bones = [];

// Root bone
const rootBone = new THREE.Bone();
rootBone.position.y = -1;

// Spine bones
const spineBones = [];
const segments = 4;
let prevBone = rootBone;

for (let i = 0; i < segments; i++) {
    const bone = new THREE.Bone();
    bone.position.y = 0.5;
    prevBone.add(bone);
    spineBones.push(bone);
    prevBone = bone;
    bones.push(bone);
}

bones.unshift(rootBone);

// Create skeleton and add to geometry
const skeleton = new THREE.Skeleton(bones);

// Create skinning
const position = geometry.attributes.position;
const skinIndices = [];
const skinWeights = [];

for (let i = 0; i < position.count; i++) {
    const y = geometry.attributes.position.getY(i);
    const skinIndex = Math.floor((y + 1) / 2 * segments);
    const skinWeight = (y + 1) / 2 * segments % 1;

    skinIndices.push(
        skinIndex,
        Math.min(skinIndex + 1, segments),
        0,
        0
    );

    skinWeights.push(
        1 - skinWeight,
        skinWeight,
        0,
        0
    );
}

geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));

// Create material and mesh
const material = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    skinning: true,
    wireframe: true
});

const mesh = new THREE.SkinnedMesh(geometry, material);
mesh.add(rootBone);
mesh.bind(skeleton);

// Add lights
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);
scene.add(new THREE.AmbientLight(0x666666));

scene.add(mesh);

// Animation
let time = 0;
function animate() {
    requestAnimationFrame(animate);

    time += 0.01;

    // Animate bones
    spineBones.forEach((bone, index) => {
        const offset = index * 0.5;
        bone.rotation.x = Math.sin(time + offset) * 0.3;
    });

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();