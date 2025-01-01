// main.js

import * as THREE from 'three';

let scene, camera, renderer;
let particles, particleMaterial;
let particleCount = 5000;
let particleSystem;

function init() {
    // Create scene and camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Set up renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create the particles
    createParticles();

    // Set camera position
    camera.position.z = 50;

    // Start the animation loop
    animate();
}

function createParticles() {
    // Create particle material (no texture, just a solid color)
    particleMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,  // White color for the particles
        size: 1.0,        // Size of each particle
        opacity: 0.8,     // Opacity for semi-transparency
        transparent: true,
        blending: THREE.AdditiveBlending  // Additive blending for glowing effect
    });

    // Create particles' geometry
    let particlesGeometry = new THREE.BufferGeometry();
    let positions = [];
    let velocities = [];

    for (let i = 0; i < particleCount; i++) {
        // Set random positions for the particles in a small area around the origin
        positions.push(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
        velocities.push(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
    }

    // Add the positions and velocities as attributes
    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));

    // Create particle system using Points
    particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particleSystem);
}

function animate() {
    requestAnimationFrame(animate);

    let positions = particleSystem.geometry.attributes.position.array;
    let velocities = particleSystem.geometry.attributes.velocity.array;

    // Update particles' position to simulate explosion
    for (let i = 0; i < particleCount; i++) {
        let index = i * 3;

        // Apply velocity to position
        positions[index] += velocities[index];
        positions[index + 1] += velocities[index + 1];
        positions[index + 2] += velocities[index + 2];

        // Apply random forces to simulate explosion effect
        velocities[index] += (Math.random() - 0.5) * 0.05;
        velocities[index + 1] += (Math.random() - 0.5) * 0.05;
        velocities[index + 2] += (Math.random() - 0.5) * 0.05;
    }

    // Update the geometry to reflect the new positions
    particleSystem.geometry.attributes.position.needsUpdate = true;

    // Render the scene
    renderer.render(scene, camera);
}

// Initialize the scene
init();
