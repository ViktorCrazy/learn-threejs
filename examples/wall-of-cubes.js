import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
import * as CANNON from 'cannon'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const light1 = new THREE.SpotLight(0xffffff, 100)
light1.position.set(2.5, 5, 5)
light1.angle = Math.PI / 4
light1.penumbra = 0.5
light1.castShadow = true
light1.shadow.mapSize.width = 1024
light1.shadow.mapSize.height = 1024
light1.shadow.camera.near = 0.5
light1.shadow.camera.far = 20
scene.add(light1)

const light2 = new THREE.SpotLight(0xffffff, 100)
light2.position.set(-2.5, 5, 5)
light2.angle = Math.PI / 4
light2.penumbra = 0.5
light2.castShadow = true
light2.shadow.mapSize.width = 1024
light2.shadow.mapSize.height = 1024
light2.shadow.camera.near = 0.5
light2.shadow.camera.far = 20
scene.add(light2)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 5, 10)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.y = 0.5

const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)

const normalMaterial = new THREE.MeshNormalMaterial()
const phongMaterial = new THREE.MeshPhongMaterial()

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)

let cubes = []
let cubeBodies = []
const rows = 5
const columns = 5
const gap = 1.2

// Create a grid of cubes to form a wall
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
        const cubeMesh = new THREE.Mesh(cubeGeometry, normalMaterial)
        cubeMesh.position.set(j * gap - (columns - 1) * gap / 2, i * gap + 1, 0)
        cubeMesh.castShadow = true
        scene.add(cubeMesh)

        const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
        const cubeBody = new CANNON.Body({ mass: 1 })
        cubeBody.addShape(cubeShape)
        cubeBody.position.set(cubeMesh.position.x, cubeMesh.position.y, cubeMesh.position.z)
        world.addBody(cubeBody)

        cubes.push(cubeMesh)
        cubeBodies.push(cubeBody)
    }
}

const planeGeometry = new THREE.PlaneGeometry(25, 25)
const planeMesh = new THREE.Mesh(planeGeometry, phongMaterial)
planeMesh.rotateX(-Math.PI / 2)
planeMesh.receiveShadow = true
scene.add(planeMesh)
const planeShape = new CANNON.Plane()
const planeBody = new CANNON.Body({ mass: 0 })
planeBody.addShape(planeShape)
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(planeBody)

window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = new Stats()
document.body.appendChild(stats.dom)

const gui = new GUI()
const physicsFolder = gui.addFolder('Physics')
physicsFolder.add(world.gravity, 'x', -10.0, 10.0, 0.1)
physicsFolder.add(world.gravity, 'y', -10.0, 10.0, 0.1)
physicsFolder.add(world.gravity, 'z', -10.0, 10.0, 0.1)
physicsFolder.open()

const clock = new THREE.Clock()
let delta

// Raycasting to detect which cube is clicked
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

window.addEventListener('click', onMouseClick, false)

function onMouseClick(event) {
    // Normalize mouse coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    // Set the raycaster position based on the mouse coordinates
    raycaster.update(camera, renderer.domElement)

    // Check for intersections with cubes
    const intersects = raycaster.intersectObjects(cubes)

    if (intersects.length > 0) {

        const intersectedCube = intersects[0]
        const cubeIndex = cubes.indexOf(intersectedCube.object)

        // Apply a force to the clicked cube
        const force = new CANNON.Vec3(0, 10, 0) // Push up
        cubeBodies[cubeIndex].applyForce(force, cubeBodies[cubeIndex].position)
    }
}

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    delta = Math.min(clock.getDelta(), 0.1)
    world.step(delta)

    // Copy coordinates from Cannon to Three.js
    for (let i = 0; i < cubes.length; i++) {
        cubes[i].position.set(cubeBodies[i].position.x, cubeBodies[i].position.y, cubeBodies[i].position.z)
        cubes[i].quaternion.set(cubeBodies[i].quaternion.x, cubeBodies[i].quaternion.y, cubeBodies[i].quaternion.z, cubeBodies[i].quaternion.w)
    }

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()
