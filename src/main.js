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

    // Create and Add Multiple Cubes
    const cubeMaterials = [
        { color: 0xff0000, friction: 0.1, restitution: 0.5 },
        { color: 0x00ff00, friction: 0.2, restitution: 0.4 },
        { color: 0x0000ff, friction: 0.3, restitution: 0.3 },
        { color: 0xffff00, friction: 0.5, restitution: 0.2 },
        { color: 0xff00ff, friction: 0.6, restitution: 0.1 },
        { color: 0x00ffff, friction: 0.0, restitution: 0.8 },
    ];

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
    window.addEventListener('keydown', (event) => {
        if (event.key === 'f') { // Press 'f' to apply force
            applyForceToAllCubes();
        }
    });

    animate();
}

function applyForceToAllCubes() {
    const force = new CANNON.Vec3(30, 0, 0); // Force vector (e.g., upward)
    const point = new CANNON.Vec3(0, 0, 0); // Point of application

    objects.forEach(({ body }) => {
        body.applyForce(force, point);
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
