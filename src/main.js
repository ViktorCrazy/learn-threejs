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
world.gravity.set(0, -9.82, 0);  // Gravity

// Create the cube as the vehicle body (in Three.js)
let vehicleGeometry = new THREE.BoxGeometry(2, 1, 4);
let vehicleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
let vehicleMesh = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
scene.add(vehicleMesh);

// Create the cube as the vehicle body (in Cannon.js)
let vehicleShape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 2));
let vehicleBody = new CANNON.Body({
    mass: 150,
    position: new CANNON.Vec3(0, 5, 0),
    angularDamping: 0.8
});
vehicleBody.addShape(vehicleShape);
world.addBody(vehicleBody);

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

// Set up the animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update physics world
    world.step(1 / 60);

    // Sync Three.js vehicle position and rotation with Cannon.js vehicle body
    vehicleMesh.position.copy(vehicleBody.position);
    vehicleMesh.quaternion.copy(vehicleBody.quaternion);

    // Update the vehicle based on controls
    updateVehicle();

    // Update target camera position based on vehicle position and offset
    targetPosition.copy(vehicleBody.position).add(cameraOffset);

    // Smoothly interpolate camera position towards target position
    camera.position.lerp(targetPosition, cameraSmoothness);
    camera.lookAt(vehicleMesh.position);

    // Render the scene
    renderer.render(scene, camera);
}

// Start the animation loop
animate();
