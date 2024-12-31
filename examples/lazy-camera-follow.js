import * as THREE from 'three'

// Basic setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cube creation (moving cube)
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Create a static floor
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = Math.PI / 2; // Rotate floor to be horizontal
scene.add(floor);

// Create some static cubes
const staticCubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const staticCube1 = new THREE.Mesh(geometry, staticCubeMaterial);
staticCube1.position.set(2, 0.5, -3);
scene.add(staticCube1);

const staticCube2 = new THREE.Mesh(geometry, staticCubeMaterial);
staticCube2.position.set(-2, 0.5, -3);
scene.add(staticCube2);

// Create a static sphere
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 0.5, 2);
scene.add(sphere);

// Set initial camera position
camera.position.z = 5;

// Variables to control the cube's movement
const speed = 0.1;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

// Variables for lazy camera
const cameraLerpSpeed = 0.01;

// Event listeners for controlling the cube with WASD keys
document.addEventListener('keydown', (event) => {
    if (event.key === 'w') moveForward = true;
    if (event.key === 's') moveBackward = true;
    if (event.key === 'a') moveLeft = true;
    if (event.key === 'd') moveRight = true;
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'w') moveForward = false;
    if (event.key === 's') moveBackward = false;
    if (event.key === 'a') moveLeft = false;
    if (event.key === 'd') moveRight = false;
});

// Function to update cube movement and lazy camera following
function update() {
    // Move the cube
    if (moveForward) cube.position.z -= speed;
    if (moveBackward) cube.position.z += speed;
    if (moveLeft) cube.position.x -= speed;
    if (moveRight) cube.position.x += speed;

    // Lazy camera follow (lerping)
    const targetPosition = new THREE.Vector3(cube.position.x, cube.position.y + 2, cube.position.z + 5);
    camera.position.lerp(targetPosition, cameraLerpSpeed);
    camera.lookAt(cube.position);

    // Render the scene
    renderer.render(scene, camera);
    requestAnimationFrame(update);
}

// Call the update function to start the loop
update();

// Handle resizing the window
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
