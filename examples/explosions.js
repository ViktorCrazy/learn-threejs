import * as THREE from 'three'
import * as dat from 'dat.gui'
import * as CANNON from 'cannon'


// Basic scene setup
let scene, camera, renderer;
let currentExplosion = null;
let clock = new THREE.Clock();

// Explosion settings
let explosionSettings = {
    type: 'particle', // Default explosion type
    particleCount: 500, // Number of particles in particle explosion
    shaderColor: 0xff0000, // Color for shader explosion
    spriteSize: 2 // Size of the sprite explosion
};

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
    const light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    // Handle window resizing
    window.addEventListener('resize', onWindowResize);

    // Add GUI for controlling explosions
    const gui = new dat.GUI();
    gui.add(explosionSettings, 'type', ['particle', 'physics', 'shader', 'sprite']).name('Explosion Type').onChange(updateExplosion);
    gui.add(explosionSettings, 'particleCount', 100, 1000).step(100).name('Particle Count').onChange(updateExplosion);
    gui.addColor(explosionSettings, 'shaderColor').name('Shader Color').onChange(updateExplosion);
    gui.add(explosionSettings, 'spriteSize', 1, 5).name('Sprite Size').onChange(updateExplosion);

    // Initialize explosion
    updateExplosion();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Update explosion type based on GUI input
function updateExplosion() {
    if (currentExplosion) {
        scene.remove(currentExplosion);
    }

    const type = explosionSettings.type;

    if (type === 'particle') {
        createParticleExplosion();
    } else if (type === 'physics') {
        createPhysicsExplosion();
    } else if (type === 'shader') {
        createShaderExplosion();
    } else if (type === 'sprite') {
        createSpriteExplosion();
    }
}

function createParticleExplosion() {
    const particlesCount = explosionSettings.particleCount;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const velocities = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
        positions[i * 3] = Math.random() * 2 - 1;
        positions[i * 3 + 1] = Math.random() * 2 - 1;
        positions[i * 3 + 2] = Math.random() * 2 - 1;

        velocities[i * 3] = Math.random() * 0.1 - 0.05;
        velocities[i * 3 + 1] = Math.random() * 0.1 - 0.05;
        velocities[i * 3 + 2] = Math.random() * 0.1 - 0.05;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.PointsMaterial({ color: 0xffaa00, size: 0.1 });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    currentExplosion = particles;

    function animateParticles() {
        const positions = particles.geometry.attributes.position.array;
        const velocities = particles.geometry.attributes.velocity.array;
        for (let i = 0; i < particlesCount; i++) {
            positions[i * 3] += velocities[i * 3];
            positions[i * 3 + 1] += velocities[i * 3 + 1];
            positions[i * 3 + 2] += velocities[i * 3 + 2];
        }
        particles.geometry.attributes.position.needsUpdate = true;
        if (particles) requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

function createPhysicsExplosion() {
    // Initialize Cannon.js physics world
    const world = new CANNON.World();
    world.gravity.set(0, 0, 0);

    // Create a sphere body (explosion center)
    const sphere = new CANNON.Body({ mass: 1 });
    sphere.addShape(new CANNON.Sphere(1));
    world.addBody(sphere);

    // Add a visual representation of the sphere
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    currentExplosion = mesh;

    // Apply force to the sphere
    const explosionForce = 1000;
    const explosionPosition = new CANNON.Vec3(0, 0, 0);
    sphere.applyForce(explosionPosition, sphere.position);

    // Update physics simulation
    function animatePhysics() {
        world.step(1 / 60);
        mesh.position.copy(sphere.position);
        mesh.rotation.set(sphere.rotation.x, sphere.rotation.y, sphere.rotation.z);
        if (sphere) requestAnimationFrame(animatePhysics);
    }
    animatePhysics();
}

function createShaderExplosion() {
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(explosionSettings.shaderColor) }
        },
        vertexShader: `
            uniform float time;
            void main() {
                vec3 pos = position + sin(time + position) * 0.5;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            void main() {
                gl_FragColor = vec4(color, 1.0);
            }
        `
    });

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    currentExplosion = mesh;

    function animateExplosion() {
        material.uniforms.time.value += 0.1;
        if (mesh) requestAnimationFrame(animateExplosion);
    }
    animateExplosion();
}

function createSpriteExplosion() {
    const spriteMaterial = new THREE.SpriteMaterial({
        map: new THREE.TextureLoader().load('explosion.png'),
        color: new THREE.Color(0xffa500),
        transparent: true
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(0, 0, 0);
    sprite.scale.set(explosionSettings.spriteSize, explosionSettings.spriteSize, explosionSettings.spriteSize);
    scene.add(sprite);

    currentExplosion = sprite;

    // Animate sprite
    function animateSprite() {
        sprite.scale.set(sprite.scale.x * 1.1, sprite.scale.y * 1.1, sprite.scale.z * 1.1);
        if (sprite.scale.x < 5) requestAnimationFrame(animateSprite);
    }
    animateSprite();
}

// Animation loop
function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
