import * as THREE from 'three';
import * as CANNON from 'cannon';

// Set up the Three.js scene
let scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const light1 = new THREE.SpotLight(0xffffff, 100);
light1.position.set(2.5, 5, 5);
light1.angle = Math.PI / 4;
light1.penumbra = 0.5;
light1.castShadow = true;
light1.shadow.mapSize.width = 1024;
light1.shadow.mapSize.height = 1024;
light1.shadow.camera.near = 0.5;
light1.shadow.camera.far = 20;
scene.add(light1);

const light2 = new THREE.SpotLight(0xffffff, 100);
light2.position.set(-2.5, 5, 5);
light2.angle = Math.PI / 4;
light2.penumbra = 0.5;
light2.castShadow = true;
light2.shadow.mapSize.width = 1024;
light2.shadow.mapSize.height = 1024;
light2.shadow.camera.near = 0.5;
light2.shadow.camera.far = 20;
scene.add(light2);

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up Cannon.js world
let world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

const lowFrictionMaterial = new CANNON.Material('lowFrictionMaterial');
lowFrictionMaterial.friction = 0.01;  // Set the friction to a low value, like 0.01

// Create the cube as the vehicle body (in Three.js)
let vehicleGeometry = new THREE.BoxGeometry(1, 1, 1);
let vehicleMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Initially blue
let vehicleMesh = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
vehicleMesh.position.x = 0;
vehicleMesh.position.y = 1;
vehicleMesh.castShadow = true;
scene.add(vehicleMesh);

// Create a shape and body for the cube in Cannon.js
const vehicleShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
const vehicleBody = new CANNON.Body({ mass: 10, material: lowFrictionMaterial });
vehicleBody.addShape(vehicleShape);
vehicleBody.position.x = vehicleMesh.position.x;
vehicleBody.position.y = vehicleMesh.position.y;
vehicleBody.position.z = vehicleMesh.position.z;

vehicleBody.angularDamping = 0.9999;

world.addBody(vehicleBody);

// Create ground plane in Three.js
const planeGeometry = new THREE.PlaneGeometry(25, 25);
const planeMesh = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial());
planeMesh.rotateX(-Math.PI / 2);
planeMesh.receiveShadow = true;
scene.add(planeMesh);

// Create ground body in Cannon.js
const planeShape = new CANNON.Plane();
const planeBody = new CANNON.Body({ mass: 0 });
planeBody.addShape(planeShape);
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(planeBody);

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

const clock = new THREE.Clock();
let delta;

// Flag to track if the vehicle is touching the ground
let isTouchingGround = false;

// PostStep event to detect contact with the ground
world.addEventListener('postStep', function () {
    let isContact = false;

    // Check if any contacts exist between the vehicle and the ground
    world.contacts.forEach(function (contact) {
        if (contact.bi === vehicleBody && contact.bj === planeBody || contact.bi === planeBody && contact.bj === vehicleBody) {
            // console.log('Contact detected!');

            isContact = true;
        }
    });

    // Change color based on contact
    if (isContact) {
        if (!isTouchingGround) {
            // Vehicle starts touching the ground, change color to green
            vehicleMesh.material.color.set(0x00ff00);  // Green
            isTouchingGround = true;
        }
    } else {
        if (isTouchingGround) {
            // Vehicle stops touching the ground, change color back to blue
            vehicleMesh.material.color.set(0x0000ff);  // Blue
            isTouchingGround = false;
        }
    }
});

// Set up the animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update physics world
    delta = Math.min(clock.getDelta(), 0.1);
    world.step(delta);

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

    // Render the scene
    renderer.render(scene, camera);
}

// Start the animation loop
animate();

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}
