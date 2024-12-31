import * as THREE from 'three';
import * as CANNON from 'cannon'; // Ensure you're using the appropriate Cannon.js library
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let scene, camera, renderer, world;
let objects = [];

function init() {
    // Initialize Three.js Scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    // Initialize Cannon.js Physics World
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0); // Set gravity

    // Create Ground Material
    const groundMaterial = new CANNON.Material("groundMaterial");

    // Contact Materials
    const ground_ground_cm = new CANNON.ContactMaterial(groundMaterial, groundMaterial, {
        friction: 0.4,
        restitution: 0.3,
    });
    world.addContactMaterial(ground_ground_cm);

    // Create Ground
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    const groundMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshStandardMaterial({ color: 0x888888 })
    );
    groundMesh.rotation.x = -Math.PI / 2;
    scene.add(groundMesh);

    // Random range generator function
    function getRandomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Function to generate a random cube material
    function generateRandomCubeMaterial(colorRange, frictionRange, restitutionRange) {
        const color = Math.floor(Math.random() * (colorRange.max - colorRange.min + 1) + colorRange.min);
        const friction = getRandomInRange(frictionRange.min, frictionRange.max);
        const restitution = getRandomInRange(restitutionRange.min, restitutionRange.max);

        return { color, friction, restitution };
    }

    // Define configurable ranges
    const colorRange = { min: 0x000000, max: 0xffffff };  // Ranges for the color (Hex)
    const frictionRange = { min: 0.0, max: 1.0 };         // Ranges for friction
    const restitutionRange = { min: 0.0, max: 1.0 };      // Ranges for restitution

    // Generate random cube materials
    const cubeMaterials = Array.from({ length: 100 }, () => generateRandomCubeMaterial(colorRange, frictionRange, restitutionRange));

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

    cubeMaterials.forEach((materialProps, index) => {
        // Create Cannon.js Material
        const boxMaterial = new CANNON.Material();
        const contactMaterial = new CANNON.ContactMaterial(groundMaterial, boxMaterial, {
            friction: materialProps.friction,
            restitution: materialProps.restitution,
        });
        world.addContactMaterial(contactMaterial);

        // Create Cannon.js Body
        const boxBody = new CANNON.Body({ mass: 1, material: boxMaterial });
        boxBody.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
        boxBody.position.set(-5 + index * 2, 5, 0);
        world.addBody(boxBody);

        // Create Three.js Mesh
        const boxMesh = new THREE.Mesh(
            boxGeometry,
            new THREE.MeshStandardMaterial({ color: materialProps.color })
        );
        scene.add(boxMesh);

        objects.push({ body: boxBody, mesh: boxMesh });
    });


    // Add event listener for keyboard input
    const keyForceMap = {
        'a': new CANNON.Vec3(-500, 0, 0), // Force along the negative x-axis
        'd': new CANNON.Vec3(500, 0, 0),  // Force along the positive x-axis
        'w': new CANNON.Vec3(0, 500, 0)   // Force upward
    };

    // Add event listener for keyboard input
    window.addEventListener('keydown', (event) => {
        if (event.key === 's') {
            moveCubesToPoint(new CANNON.Vec3(0, 0, 0)); // Move cubes to the origin when 's' is pressed
        } else {
            const force = keyForceMap[event.key];
            if (force) {
                objects.forEach(({ body }) => {
                    body.applyForce(force, body.position); // Apply force at center
                });
            }
        }


    });

    animate();
}

// Function to move all cubes towards a target point
function moveCubesToPoint(targetPoint) {
    objects.forEach(({ body }) => {
        const direction = targetPoint.vsub(body.position); // Calculate the direction vector towards the target
        const forceMagnitude = 500; // Adjust this value for how strongly the cubes are pulled
        const force = direction.unit().scale(forceMagnitude); // Apply force in that direction

        body.applyForce(force, body.position); // Apply the force to each cube
    });
}

function animate() {
    requestAnimationFrame(animate);

    const timeStep = 1 / 60;
    world.step(timeStep);

    // Sync Three.js objects with Cannon.js bodies
    objects.forEach(({ body, mesh }) => {
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
    });

    renderer.render(scene, camera);
}

init();
