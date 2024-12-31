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

// Update the mouse position on click
function onMouseClick(event) {
    // Convert mouse coordinates to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with the cube
    const intersects = raycaster.intersectObject(cube);

    // If there's an intersection, change the cube's color
    if (intersects.length > 0) {
        cube.material.color.set(0xff0000); // Change to red
    }
}

// Add the click event listener
window.addEventListener('click', onMouseClick, false);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Render the scene from the camera's perspective
    renderer.render(scene, camera);
}

// Start the animation loop
animate();
