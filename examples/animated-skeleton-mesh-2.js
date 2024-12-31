import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CapsuleGeometry } from 'three/examples/jsm/geometries/CapsuleGeometry';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 8; // Moved camera back to see larger object

// Create capsule geometry
const geometry = new CapsuleGeometry(0.8, 3, 4, 8); // Increased radius and length

// Create skeleton
const bones = [];

// Root bone
const rootBone = new THREE.Bone();
rootBone.position.y = -2; // Adjusted for longer capsule

// Spine bones
const spineBones = [];
const segments = 4;
let prevBone = rootBone;

for (let i = 0; i < segments; i++) {
    const bone = new THREE.Bone();
    bone.position.y = 1; // Increased bone length
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
    const skinIndex = Math.floor((y + 2) / 4 * segments);
    const skinWeight = (y + 2) / 4 * segments % 1;

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

// Create materials
const pinkMaterial = new THREE.MeshPhongMaterial({
    color: 0xff69b4,
    skinning: true,
    wireframe: false
});

// Create main mesh
const mesh = new THREE.SkinnedMesh(geometry, pinkMaterial);
mesh.add(rootBone);
mesh.bind(skeleton);

// Create balls
const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32); // Increased ball size
const ball1 = new THREE.Mesh(ballGeometry, pinkMaterial.clone());
const ball2 = new THREE.Mesh(ballGeometry, pinkMaterial.clone());

ball1.position.set(-0.8, -2.2, 0); // Adjusted positions for larger capsule
ball2.position.set(0.8, -2.2, 0);

// Add balls to root bone so they move with the mesh
rootBone.add(ball1);
rootBone.add(ball2);

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