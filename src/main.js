import * as THREE from 'three';
import { Vehicle } from './game/Vehicle';

let scene, camera, renderer, cube;

let vehicle = new Vehicle(0, 0, 50, 30);
// Example: Update vehicle physics (gas, brake, turn left/right)
let gas = false; // Apply gas (accelerate)
let brake = false; // Don't apply brake
let turnLeft = false; // Don't turn left
let turnRight = false; // Turn right

function init() {
    // Scene setup
    scene = new THREE.Scene();

    // Camera setup (top-down view)
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 0); // Position camera above the scene
    camera.lookAt(0, 0, 0); // Look at the center of the scene

    // Renderer setup
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Cube setup
    const geometry = new THREE.BoxGeometry(1, 1, 1); // Cube dimensions
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Cube color
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, -5, 0); // Position cube at the bottom
    scene.add(cube);

    // Function to handle keydown events (when keys are pressed)
    function onKeyDown(event) {
        console.log(event.key);

        if (event.key === 'w') { // If 'W' is pressed, apply gas
            gas = true;
        } else if (event.key === 's') { // If 'S' is pressed, apply brake
            brake = true;
        } else if (event.key === 'a') { // If 'A' is pressed, turn left
            turnLeft = true;
        } else if (event.key === 'd') { // If 'D' is pressed, turn right
            turnRight = true;
        }
    }

    // Function to handle keyup events (when keys are released)
    function onKeyUp(event) {
        console.log(event.key);


        if (event.key === 'w') { // If 'W' is released, stop applying gas
            gas = false;
        } else if (event.key === 's') { // If 'S' is released, stop applying brake
            brake = false;
        } else if (event.key === 'a') { // If 'A' is released, stop turning left
            turnLeft = false;
        } else if (event.key === 'd') { // If 'D' is released, stop turning right
            turnRight = false;
        }
    }

    // Add event listeners to detect when keys are pressed or released
    document.addEventListener('keydown', onKeyDown); // Listen for keydown (key pressed)
    document.addEventListener('keyup', onKeyUp);    // Listen for keyup (key released)


    // Animation loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    vehicle.update(gas, brake, turnLeft, turnRight);


    // console.log(vehicle.position);


    cube.position.set(vehicle.position.x, -5, vehicle.position.y);

    // Render the scene from the camera's perspective
    renderer.render(scene, camera);
}

// Initialize the scene
init();

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});