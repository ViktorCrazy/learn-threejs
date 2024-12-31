import './style.css'
import * as THREE from 'three';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create a WebGL renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.querySelector('#app').appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/procedural_texture.png'); // Replace with your PNG file path

const material = new THREE.MeshBasicMaterial({ map: texture });

const geometry = new THREE.PlaneGeometry(5, 5);
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);


// Step 3: Create a raycaster and a mouse vector for the click event
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Step 4: Set up the click event listener
window.addEventListener('click', (event) => {
  // Normalize mouse coordinates to the range [-1, 1]
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Step 5: Update the raycaster to use the mouse position
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections with objects in the scene
  const intersects = raycaster.intersectObject(mesh);

  if (intersects.length > 0) {
    // For now, just print the intersection point
    const intersection = intersects[0].point;
    console.log("Clicked at:", intersection);

    // Step 6: Add a new object (e.g., a sphere) where the user clicked
    const newGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const newMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const newObject = new THREE.Mesh(newGeometry, newMaterial);

    // Set the position of the new object to the intersection point
    newObject.position.copy(intersection);

    // Add the new object to the scene
    scene.add(newObject);
  }
});


// Position the camera
camera.position.z = 5;

// Create an animation loop
function animate() {
  requestAnimationFrame(animate);

  // mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();
