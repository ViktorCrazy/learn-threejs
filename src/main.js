import * as THREE from 'three';
import * as CANNON from 'cannon';


// Set up the scene, camera, and renderer using THREE.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up the world for physics simulation using Cannon.js
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Set gravity in the Y direction

// Create materials
const groundMaterial = new CANNON.Material("ground");
const cubeMaterial = new CANNON.Material("cube");

// Create a ContactMaterial for ground-to-ground friction and cube-to-ground friction
const groundGroundContactMaterial = new CANNON.ContactMaterial(groundMaterial, groundMaterial, {
    friction: 0.5, // Friction for the ground
    restitution: 0.3 // Bounciness
});
const cubeGroundContactMaterial = new CANNON.ContactMaterial(cubeMaterial, groundMaterial, {
    friction: 0.4, // Friction for the cube
    restitution: 0.3
});

// Add ContactMaterials to the world
world.addContactMaterial(groundGroundContactMaterial);
world.addContactMaterial(cubeGroundContactMaterial);

// Create the slope (ground) using a box shape
const groundShape = new CANNON.Plane();
const groundBody = new CANNON.Body({
    mass: 0, // Static body
    position: new CANNON.Vec3(0, -5, 0)
});
groundBody.addShape(groundShape);
groundBody.material = groundMaterial;
world.addBody(groundBody);

// Rotate the ground to create a slope
groundBody.quaternion.setFromEuler(-Math.PI / 6, 0, 0); // 30-degree slope

// Create the cube (dynamic body) that will slide down the slope
const cubeShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
const cubeBody = new CANNON.Body({
    mass: 5, // Cube has mass
    position: new CANNON.Vec3(0, 5, 0)
});
cubeBody.addShape(cubeShape);
cubeBody.material = cubeMaterial;
world.addBody(cubeBody);

// Create a visual representation of the cube using THREE.js
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
const cubeMaterialThree = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterialThree);
scene.add(cubeMesh);

// Create a visual representation of the slope
const slopeGeometry = new THREE.PlaneGeometry(50, 50);
const slopeMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide });
const slopeMesh = new THREE.Mesh(slopeGeometry, slopeMaterial);
scene.add(slopeMesh);
slopeMesh.rotation.x = Math.PI / 6; // Match the slope rotation

// Set camera position
camera.position.z = 10;

// Update loop to simulate physics and render the scene
function animate() {
    requestAnimationFrame(animate);

    // Step the physics world
    world.step(1 / 60);

    // Update the position of the cube in THREE.js based on the physics body
    cubeMesh.position.copy(cubeBody.position);
    cubeMesh.quaternion.copy(cubeBody.quaternion);

    // Render the scene
    renderer.render(scene, camera);
}

// Start the animation loop
animate();
