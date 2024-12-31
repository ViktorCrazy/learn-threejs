import * as THREE from 'three'

// Initialize the scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a cube geometry
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.x = -2; // Position the cube
scene.add(cube);

// Create a sphere geometry
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 2; // Position the sphere
scene.add(sphere);

// Create a cone geometry
const coneGeometry = new THREE.ConeGeometry(0.5, 1, 32);
const coneMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.y = -2; // Position the cone
scene.add(cone);

// Initialize the raycaster and mouse vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let INTERSECTED = null;

// Update the mouse position on mouse move
function onMouseMove(event) {
    // Convert mouse coordinates to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with the objects
    const intersects = raycaster.intersectObjects([cube, sphere, cone]);

    // If there's an intersection, change the color of the intersected object
    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (INTERSECTED !== object) {
            if (INTERSECTED) INTERSECTED.material.color.set(INTERSECTED.originalColor); // Reset previous object color
            INTERSECTED = object;
            INTERSECTED.originalColor = INTERSECTED.material.color.getHex(); // Store the original color
            INTERSECTED.material.color.set(0xff0000); // Change to red
        }
    } else {
        if (INTERSECTED) INTERSECTED.material.color.set(INTERSECTED.originalColor); // Reset color when not hovering
        INTERSECTED = null;
    }
}

// Add the mouse move event listener
window.addEventListener('mousemove', onMouseMove, false);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Render the scene from the camera's perspective
    renderer.render(scene, camera);
}

// Start the animation loop
animate();
