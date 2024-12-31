import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up a basic ground plane
const groundGeometry = new THREE.PlaneGeometry(500, 500);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x220000, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = - Math.PI / 2; // Make it flat
scene.add(ground);

// Camera position
camera.position.z = 5;

// Add ambient light
const light = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(light);

// Load grass texture
const grassTexture = new THREE.TextureLoader().load('grass_texture.png');
grassTexture.magFilter = THREE.NearestFilter;

// Geometry + Textures (Billboards)
function addBillboardGrass() {
    const grassGeometry = new THREE.PlaneGeometry(0.1, 0.3);
    const grassMaterial = new THREE.MeshBasicMaterial({
        map: grassTexture,
        transparent: true
    });
    for (let i = 0; i < 100; i++) {
        const grass = new THREE.Mesh(grassGeometry, grassMaterial);
        grass.position.set(Math.random() * 20 - 10, 0, Math.random() * 20 - 10);
        grass.rotation.x = -Math.PI / 2; // Make them upright
        scene.add(grass);
    }
}

// Instancing (Using InstancedMesh)
function addInstancedGrass() {
    const bladeGeometry = new THREE.PlaneGeometry(0.1, 0.3);
    const bladeMaterial = new THREE.MeshBasicMaterial({
        map: grassTexture,
        transparent: true
    });
    const numBlades = 1000;
    const instancedGrass = new THREE.InstancedMesh(bladeGeometry, bladeMaterial, numBlades);
    for (let i = 0; i < numBlades; i++) {
        const matrix = new THREE.Matrix4();
        matrix.setPosition(Math.random() * 20 - 10, 0, Math.random() * 20 - 10);
        matrix.scale(new THREE.Vector3(1, Math.random() * 2 + 1, 1));
        matrix.makeRotationY(Math.random() * Math.PI);
        instancedGrass.setMatrixAt(i, matrix);
    }
    scene.add(instancedGrass);
}

// Particle System (Points)
function addParticleGrass() {
    const particleCount = 500;
    const particles = new THREE.BufferGeometry();

    // Create a Float32Array to hold positions for each particle
    const positions = new Float32Array(particleCount * 3); // 3 components per vertex (x, y, z)

    // Populate the position array with random values for the particles
    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * 20 - 10;
        const y = 0; // You can modify this for vertical positioning if needed
        const z = Math.random() * 20 - 10;
        positions.set([x, y, z], i * 3); // Each particle has 3 values (x, y, z)
    }

    // Set the 'position' attribute in the geometry
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create the material for the particles (with transparency and texture)
    const particleMaterial = new THREE.PointsMaterial({
        map: grassTexture,
        size: 0.1,
        transparent: true
    });

    // Create the Points object (particle system)
    const particleSystem = new THREE.Points(particles, particleMaterial);

    // Add the particle system to the scene
    scene.add(particleSystem);
}


// LOD (Level of Detail) Grass
function addLODGrass() {
    const lod = new THREE.LOD();
    const farGeometry = new THREE.PlaneGeometry(0.1, 0.3);
    const nearGeometry = new THREE.PlaneGeometry(0.1, 0.5);
    const material = new THREE.MeshBasicMaterial({
        map: grassTexture,
        transparent: true
    });
    lod.addLevel(new THREE.Mesh(farGeometry, material), 50); // Far detail
    lod.addLevel(new THREE.Mesh(nearGeometry, material), 10); // Near detail
    lod.position.set(5, 0, 5);
    scene.add(lod);
}

// Add grass with all methods
addBillboardGrass();
addInstancedGrass();
addParticleGrass();
addLODGrass();

// Set up OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movement
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false; // Disable panning (optional)
controls.maxPolarAngle = Math.PI / 2; // Restrict vertical movement (optional)

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update the controls each frame
    renderer.render(scene, camera);
}
animate();

// Resize handling
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
