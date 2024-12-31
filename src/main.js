import * as THREE from 'three';
import * as CANNON from 'cannon';

// Set up the Three.js scene
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up Cannon.js world
let world = new CANNON.World();
world.gravity.set(0, 0, 0);  // Gravity

// Create the cube as the vehicle body (in Three.js)
let vehicleGeometry = new THREE.BoxGeometry(2, 1, 4);
let vehicleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
let vehicleMesh = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
scene.add(vehicleMesh);

// const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
// const cubeMesh = new THREE.Mesh(cubeGeometry, vehicleMaterial)
// cubeMesh.position.x = -3
// cubeMesh.position.y = 3
// cubeMesh.castShadow = true
// scene.add(cubeMesh)
const vehicleShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
const vehicleBody = new CANNON.Body({ mass: 1 })
vehicleBody.addShape(vehicleShape)
vehicleBody.position.x = vehicleMesh.position.x
vehicleBody.position.y = vehicleMesh.position.y
vehicleBody.position.z = vehicleMesh.position.z
world.addBody(vehicleBody)

// Create a ground (plane) in Three.js
let groundGeometry = new THREE.PlaneGeometry(500, 500);
let groundMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
let groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.position.y = -1;
scene.add(groundMesh);

// Create a ground (plane) in Cannon.js
let groundShape = new CANNON.Plane();
let groundBody = new CANNON.Body({
    mass: 0  // Static body
});
groundBody.addShape(groundShape);
groundBody.position.y = -1;
world.addBody(groundBody);

// Set up controls (WASD)
let controls = { forward: false, backward: false, left: false, right: false };
document.addEventListener('keydown', (event) => {
    if (event.key === 'w') controls.forward = true;
    if (event.key === 's') controls.backward = true;
    if (event.key === 'a') controls.left = true;
    if (event.key === 'd') controls.right = true;
});
document.addEventListener('keyup', (event) => {
    if (event.key === 'w') controls.forward = false;
    if (event.key === 's') controls.backward = false;
    if (event.key === 'a') controls.left = false;
    if (event.key === 'd') controls.right = false;
});

// Control vehicle
function updateVehicle() {
    if (controls.forward) {
        vehicleBody.applyForce(new CANNON.Vec3(0, 0, -1000), vehicleBody.position);  // Apply forward force
    }
    if (controls.backward) {
        vehicleBody.applyForce(new CANNON.Vec3(0, 0, 1000), vehicleBody.position);  // Apply backward force
    }
    if (controls.left) {
        vehicleBody.angularVelocity.set(0, 3, 0);  // Turn left
    }
    if (controls.right) {
        vehicleBody.angularVelocity.set(0, -3, 0);  // Turn right
    }
}

// Camera smooth follow logic
let cameraOffset = new THREE.Vector3(0, 5, 10); // Camera offset behind the vehicle
let cameraSmoothness = 0.1; // How fast the camera follows (0 = instant, 1 = very slow)
let targetPosition = new THREE.Vector3(); // Target position for the camera

// Create a canvas overlay for debug info
let canvas = document.createElement('canvas');
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

let ctx = canvas.getContext('2d');
ctx.font = '16px Arial';
ctx.fillStyle = 'white';

const clock = new THREE.Clock()
let delta

// Set up the animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update physics world
    delta = Math.min(clock.getDelta(), 0.1)
    world.step(delta)

    // Sync Three.js vehicle position and rotation with Cannon.js vehicle body
    vehicleMesh.position.set(vehicleBody.position.x, vehicleBody.position.y, vehicleBody.position.z);
    vehicleMesh.quaternion.set(vehicleBody.quaternion.x, vehicleBody.quaternion.y, vehicleBody.quaternion.z, vehicleBody.quaternion.w);

    // Update the vehicle based on controls
    updateVehicle();

    // Update target camera position based on vehicle position and offset
    targetPosition.set(vehicleBody.position.x, vehicleBody.position.y, vehicleBody.position.z).add(cameraOffset);

    // Smoothly interpolate camera position towards target position
    camera.position.lerp(targetPosition, cameraSmoothness);
    camera.lookAt(vehicleMesh.position);

    // Clear the canvas and render the positions of the objects
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render positions for debug
    ctx.fillText(`Vehicle Position: (${vehicleMesh.position.x.toFixed(2)}, ${vehicleMesh.position.y.toFixed(2)}, ${vehicleMesh.position.z.toFixed(2)})`, 10, 30);
    ctx.fillText(`Ground Position: (${groundMesh.position.x.toFixed(2)}, ${groundMesh.position.y.toFixed(2)}, ${groundMesh.position.z.toFixed(2)})`, 10, 50);

    // Render the scene
    renderer.render(scene, camera);
}

// Start the animation loop
animate();
