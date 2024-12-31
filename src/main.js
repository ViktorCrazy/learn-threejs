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
const geometry = new THREE.BoxGeometry();

// Create a material with a default color
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// Create the mesh
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

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

    // Check for intersections with the cube
    const intersects = raycaster.intersectObject(cube);

    // If there's an intersection, change the cube's color
    if (intersects.length > 0) {
        if (INTERSECTED !== cube) {
            if (INTERSECTED) INTERSECTED.material.color.set(0x00ff00); // Reset previous object color
            INTERSECTED = cube;
            INTERSECTED.material.color.set(0xff0000); // Change to red
        }
    } else {
        if (INTERSECTED) INTERSECTED.material.color.set(0x00ff00); // Reset color when not hovering
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
