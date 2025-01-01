// main.js

import * as THREE from 'three';

let scene, camera, renderer;
let particles, particleMaterial;
let particleCount = 500;
let particleSystem;
let time = 0; // To track time for gradual weakening

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
    camera.position.z = 100;

    // Start the animation loop
    animate();
}

function createParticles() {
    // Create particle material with blood-like color
    particleMaterial = new THREE.PointsMaterial({
        color: 0x8B0000,  // Dark red color for the particles (blood-like)
        size: 2.0,        // Increased size of particles to make them more noticeable
        opacity: 0.8,     // Semi-transparent
        transparent: true,
        blending: THREE.AdditiveBlending  // Additive blending for glowing effect
    });

    // Create particles' geometry
    let particlesGeometry = new THREE.BufferGeometry();
    let positions = [];
    let velocities = [];
    let opacities = [];

    for (let i = 0; i < particleCount; i++) {
        // Set random positions for the particles in a small area around the origin
        positions.push(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);

        // Set explosive random velocities in all directions
        velocities.push((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2);

        // Random opacity for each particle to simulate blood splatter behavior
        opacities.push(Math.random() * 0.5 + 0.5);  // Random opacity between 0.5 and 1
    }

    // Add the positions, velocities, and opacities as attributes
    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));
    particlesGeometry.setAttribute('opacity', new THREE.Float32BufferAttribute(opacities, 1));

    // Create particle system using Points
    particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particleSystem);
}

function animate() {
    requestAnimationFrame(animate);

    let positions = particleSystem.geometry.attributes.position.array;
    let velocities = particleSystem.geometry.attributes.velocity.array;
    let opacities = particleSystem.geometry.attributes.opacity.array;

    // Update particles' position to simulate blood splatter
    for (let i = 0; i < particleCount; i++) {
        let index = i * 3;

        // Apply velocity to position
        positions[index] += velocities[index];
        positions[index + 1] += velocities[index + 1];
        positions[index + 2] += velocities[index + 2];

        // Apply gravity for slight downward pull
        velocities[index + 1] -= 0.01; // Slight gravity effect

        // Gradually decrease velocity to simulate slowing down
        velocities[index] *= 0.98; // Slower effect in the x-direction
        velocities[index + 1] *= 0.98; // Slower effect in the y-direction
        velocities[index + 2] *= 0.98; // Slower effect in the z-direction
    }

    // Gradually fade out particles over time (to simulate disappearing blood)
    // time += 0.01;
    // if (time > 10) { // After 10 seconds, stop the particles
    //     for (let i = 0; i < particleCount; i++) {
    //         opacities[i] = Math.max(0, opacities[i] - 0.01); // Gradually decrease opacity
    //     }
    // }

    // Update the geometry to reflect the new positions and opacities
    particleSystem.geometry.attributes.position.needsUpdate = true;
    particleSystem.geometry.attributes.opacity.needsUpdate = true;

    // Render the scene
    renderer.render(scene, camera);
}

// Initialize the scene
init();
