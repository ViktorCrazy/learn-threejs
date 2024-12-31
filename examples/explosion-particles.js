import * as THREE from 'three'

let scene, camera, renderer;
let particles, particleCount = 500;
let clock = new THREE.Clock();

init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add a light
    const light = new THREE.AmbientLight(0x404040);  // Ambient light
    scene.add(light);

    // Handle window resizing
    window.addEventListener('resize', onWindowResize);

    // Create the particle explosion
    createParticleExplosion();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function createParticleExplosion() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    // Randomize particle positions and velocities
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = Math.random() * 2 - 1;  // X position
        positions[i * 3 + 1] = Math.random() * 2 - 1;  // Y position
        positions[i * 3 + 2] = Math.random() * 2 - 1;  // Z position

        velocities[i * 3] = Math.random() * 0.1 - 0.05;  // X velocity
        velocities[i * 3 + 1] = Math.random() * 0.1 - 0.05;  // Y velocity
        velocities[i * 3 + 2] = Math.random() * 0.1 - 0.05;  // Z velocity
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.PointsMaterial({ color: 0xffaa00, size: 0.1 });
    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Function to animate particles
    function animateParticles() {
        const positions = particles.geometry.attributes.position.array;
        const velocities = particles.geometry.attributes.velocity.array;
        for (let i = 0; i < particleCount; i++) {
            // Update particle positions based on velocity
            positions[i * 3] += velocities[i * 3];
            positions[i * 3 + 1] += velocities[i * 3 + 1];
            positions[i * 3 + 2] += velocities[i * 3 + 2];
        }

        // Mark positions as needing update
        particles.geometry.attributes.position.needsUpdate = true;

        // Request next frame for continuous animation
        if (particles) requestAnimationFrame(animateParticles);
    }

    // Start particle animation
    animateParticles();
}

// Animation loop
function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
