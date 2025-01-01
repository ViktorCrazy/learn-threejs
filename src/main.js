import * as THREE from 'three';

let scene, camera, renderer, cube;

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

    // Animation loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);

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
