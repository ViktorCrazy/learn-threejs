import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Adds smooth dampened movement
controls.dampingFactor = 0.05; // Adjust the damping factor
controls.screenSpacePanning = false; // Prevents the camera from panning in screen space
controls.minDistance = 5; // Set minimum zoom distance
controls.maxDistance = 50; // Set maximum zoom distance
controls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation to avoid flipping

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// 1. Texture Mapping
const textureLoader = new THREE.TextureLoader();
const grassTexture = textureLoader.load('green-grass-512x512.jpg');
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(10, 10);

const planeGeometry1 = new THREE.PlaneGeometry(20, 20);
const planeMaterial1 = new THREE.MeshStandardMaterial({ map: grassTexture });
const grassPlane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
grassPlane1.rotation.x = -Math.PI / 2;
grassPlane1.position.x = -25;
scene.add(grassPlane1);

// 2. Procedural Grass Shader
const grassMaterial2 = new THREE.ShaderMaterial({
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    varying vec2 vUv;
    void main() {
      float noise = fract(sin(dot(vUv * 10.0, vec2(12.9898, 78.233))) * 43758.5453);
      vec3 grassColor = mix(vec3(0.1, 0.8, 0.1), vec3(0.2, 1.0, 0.2), noise);
      gl_FragColor = vec4(grassColor, 1.0);
    }
  `
});
const grassPlane2 = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), grassMaterial2);
grassPlane2.rotation.x = -Math.PI / 2;
scene.add(grassPlane2);

// 3. Instanced Grass Blades
const bladeGeometry = new THREE.PlaneGeometry(0.1, 0.5);
const bladeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
const instancedBlades = new THREE.InstancedMesh(bladeGeometry, bladeMaterial, 5000);

const dummy = new THREE.Object3D();
for (let i = 0; i < 5000; i++) {
    dummy.position.set(Math.random() * 20 - 10, 0, Math.random() * 20 - 10);
    dummy.rotation.y = Math.random() * Math.PI * 2;
    dummy.scale.setScalar(Math.random() * 0.5 + 0.5);
    dummy.updateMatrix();
    instancedBlades.setMatrixAt(i, dummy.matrix);
}
instancedBlades.position.x = 25;
scene.add(instancedBlades);

// 4. Particle System
const particleGeometry = new THREE.BufferGeometry();
const positions = [];
for (let i = 0; i < 10000; i++) {
    positions.push(
        Math.random() * 20 - 10,
        0,
        Math.random() * 20 - 10
    );
}
particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    map: textureLoader.load('path_to_grass_sprite.png'),
    transparent: true
});
const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
particleSystem.position.x = -25;
particleSystem.position.z = 25;
scene.add(particleSystem);

// 5. Dynamic Grass Simulation
const grassMaterial5 = new THREE.ShaderMaterial({
    vertexShader: `
    varying vec2 vUv;
    uniform float time;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.x += sin(pos.y * 10.0 + time) * 0.1;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
    fragmentShader: `
    varying vec2 vUv;
    void main() {
      gl_FragColor = vec4(0.1, 0.8, 0.1, 1.0);
    }
  `,
    uniforms: {
        time: { value: 0 }
    }
});
const instancedGrassDynamic = new THREE.InstancedMesh(bladeGeometry, grassMaterial5, 5000);

for (let i = 0; i < 5000; i++) {
    dummy.position.set(Math.random() * 20 - 10, 0, Math.random() * 20 - 10);
    dummy.rotation.y = Math.random() * Math.PI * 2;
    dummy.scale.setScalar(Math.random() * 0.5 + 0.5);
    dummy.updateMatrix();
    instancedGrassDynamic.setMatrixAt(i, dummy.matrix);
}
instancedGrassDynamic.position.x = 25;
instancedGrassDynamic.position.z = 25;
scene.add(instancedGrassDynamic);

// Animation loop
function animate() {
    grassMaterial5.uniforms.time.value += 0.02;
    controls.update(); // Update the controls
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
