import './style.css';
import * as THREE from 'three';

// Initialize the scene, camera, and renderer
function initScene() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector('#app').appendChild(renderer.domElement);

  return { scene, camera, renderer };
}

// Load texture and create a material
function createMaterial(texturePath) {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(texturePath);
  return new THREE.MeshBasicMaterial({ map: texture });
}

// Create a plane mesh
function createPlane(material) {
  const geometry = new THREE.PlaneGeometry(5, 5);
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

// Initialize raycaster and mouse vector
function initRaycaster() {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  return { raycaster, mouse };
}

// Handle the mouse click event to create spheres
function onClick(event, raycaster, camera, mesh, scene, spheres) {
  // Normalize mouse coordinates
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update raycaster
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections with objects in the scene
  const intersects = raycaster.intersectObject(mesh);

  if (intersects.length > 0) {
    const intersection = intersects[0].point;
    console.log("Clicked at:", intersection);

    // Create and position a new sphere at the intersection
    const sphere = createSphere(intersection);
    scene.add(sphere);
    spheres.push(sphere);
  }
}

// Create a new sphere mesh
function createSphere(position) {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.copy(position);
  sphere.velocity = new THREE.Vector3(0, 0, 0); // Initial velocity
  return sphere;
}

// Apply gravity and update spheres' positions
function updateSpheres(spheres, gravity, groundLevel) {
  spheres.forEach((sphere) => {
    // Apply gravity
    sphere.velocity.y += gravity;

    // Update position
    sphere.position.add(sphere.velocity);

    // Check for ground collision
    if (sphere.position.y < groundLevel + 0.5) {
      sphere.position.y = groundLevel + 0.5;  // Prevent going below ground
      sphere.velocity.y = 0;  // Stop downward velocity
    }
  });
}

// Animation loop
function animate(renderer, scene, camera, spheres, gravity, groundLevel) {
  function loop() {
    requestAnimationFrame(loop);

    updateSpheres(spheres, gravity, groundLevel);

    renderer.render(scene, camera);
  }
  loop();
}

// Main function to initialize and start everything
function main() {
  const { scene, camera, renderer } = initScene();
  const textureMaterial = createMaterial('/procedural_texture.png');  // Replace with actual texture path
  const plane = createPlane(textureMaterial);
  scene.add(plane);

  const { raycaster, mouse } = initRaycaster();

  // List to hold spheres
  const spheres = [];

  // Handle click events
  window.addEventListener('click', (event) => onClick(event, raycaster, camera, plane, scene, spheres));

  // Gravity and ground level
  const gravity = -0.01;
  const groundLevel = -2;

  // Set camera position and start animation
  camera.position.z = 5;
  animate(renderer, scene, camera, spheres, gravity, groundLevel);
}

main();
