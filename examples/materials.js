import * as THREE from 'three';

let scene, camera, renderer;
let sphere, cube, plane;

init();
animate();

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lights
    const light1 = new THREE.AmbientLight(0x404040, 1); // Ambient light
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(5, 5, 5);
    scene.add(light2);

    // Materials setup
    createMaterials();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function createMaterials() {
    // Create a mesh for each material

    // MeshBasicMaterial (no lighting, flat color)
    const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), basicMaterial);
    sphere.position.set(-3, 2, 0);
    scene.add(sphere);

    // MeshLambertMaterial (matte, reacts to light)
    const lambertMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), lambertMaterial);
    cube.position.set(0, 2, 0);
    scene.add(cube);

    // MeshPhongMaterial (shinier surface, reacts to light)
    const phongMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), phongMaterial);
    plane.position.set(3, 2, 0);
    plane.rotation.x = -Math.PI / 2; // Rotate to make it flat
    scene.add(plane);

    // MeshStandardMaterial (physically-based, more realistic)
    const standardMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const standardCube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), standardMaterial);
    standardCube.position.set(0, -2, 0);
    scene.add(standardCube);

    // MeshPhysicalMaterial (PBR, advanced material with transparency)
    const physicalMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        metalness: 0.5,
        roughness: 0.2,
    });
    const physicalSphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), physicalMaterial);
    physicalSphere.position.set(3, -2, 0);
    scene.add(physicalSphere);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate objects for some animation
    sphere.rotation.y += 0.01;
    cube.rotation.y += 0.01;
    plane.rotation.y += 0.01;

    // Render the scene
    renderer.render(scene, camera);
}
