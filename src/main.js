import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 5;

const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
const material = new THREE.MeshPhongMaterial({
    color: 0xff69b4,
    shininess: 100,
    flatShading: true
});

const torus = new THREE.Mesh(torusGeometry, material);
scene.add(torus);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);
scene.add(new THREE.AmbientLight(0x666666));

let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    // Rotate torus
    torus.rotation.x = time * 0.5;
    torus.rotation.y = time * 0.3;

    // Modify vertices for wave effect
    const positions = torus.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);

        positions.setX(i, x + Math.sin(time + y) * 0.1);
        positions.setZ(i, z + Math.cos(time + x) * 0.1);
    }
    positions.needsUpdate = true;

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();