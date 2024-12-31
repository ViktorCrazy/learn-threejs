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

    // Create Materials
    const groundMaterial = new CANNON.Material("groundMaterial");
    const slipperyMaterial = new CANNON.Material("slipperyMaterial");

    // Contact Materials
    const ground_ground_cm = new CANNON.ContactMaterial(groundMaterial, groundMaterial, {
        friction: 0.4,
        restitution: 0.3,
    });
    world.addContactMaterial(ground_ground_cm);

    const slippery_ground_cm = new CANNON.ContactMaterial(groundMaterial, slipperyMaterial, {
        friction: 0.0,
        restitution: 0.5,
    });
    world.addContactMaterial(slippery_ground_cm);

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

    // Create Box with Slippery Material
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const slipperyMaterialBody = new CANNON.Body({ mass: 1, material: slipperyMaterial });
    slipperyMaterialBody.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
    slipperyMaterialBody.position.set(-2, 5, 0);
    world.addBody(slipperyMaterialBody);

    const slipperyBoxMesh = new THREE.Mesh(
        boxGeometry,
        new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    scene.add(slipperyBoxMesh);
    objects.push({ body: slipperyMaterialBody, mesh: slipperyBoxMesh });

    // Create Box with Ground Material
    const groundMaterialBody = new CANNON.Body({ mass: 1, material: groundMaterial });
    groundMaterialBody.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
    groundMaterialBody.position.set(2, 5, 0);
    world.addBody(groundMaterialBody);

    const groundBoxMesh = new THREE.Mesh(
        boxGeometry,
        new THREE.MeshStandardMaterial({ color: 0x0000ff })
    );
    scene.add(groundBoxMesh);
    objects.push({ body: groundMaterialBody, mesh: groundBoxMesh });

    animate();
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
