import * as THREE from 'three';
import * as CANNON from 'cannon';
import { Demo } from "./utils/cannon/demo";

const demo = new Demo();
const size = 1.0;

demo.addScene("Friction", () => {
    const shape = new CANNON.Box(new CANNON.Vec3(size, size, size));

    // Create world
    const world = demo.getWorld();
    world.broadphase = new CANNON.NaiveBroadphase();
    world.iterations = 10;

    // Materials
    const groundMaterial = new CANNON.Material("groundMaterial");

    // Adjust constraint equation parameters for ground/ground contact
    const ground_ground_cm = new CANNON.ContactMaterial(groundMaterial, groundMaterial, {
        friction: 0.4,
        restitution: 0.3,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3,
        frictionEquationStiffness: 1e8,
        frictionEquationRegularizationTime: 3,
    });

    // Add contact material to the world
    world.addContactMaterial(ground_ground_cm);

    // Ground plane
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
    groundBody.addShape(groundShape);
    world.add(groundBody);
    demo.addVisual(groundBody);

    // Create a slippery material (friction coefficient = 0.0)
    const slipperyMaterial = new CANNON.Material("slipperyMaterial");

    // The ContactMaterial defines what happens when two materials meet.
    // In this case, we want a friction coefficient of 0.0 when the slippery material touches the ground.
    const slippery_ground_cm = new CANNON.ContactMaterial(groundMaterial, slipperyMaterial, {
        friction: 0,
        restitution: 0.3,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3,
    });

    // We must add the contact materials to the world
    world.addContactMaterial(slippery_ground_cm);

    // Create slippery box
    const boxBody = new CANNON.Body({ mass: 1, material: slipperyMaterial });
    boxBody.addShape(shape);
    boxBody.position.set(0, 0, 5);
    world.add(boxBody);
    demo.addVisual(boxBody);

    // Create box made of groundMaterial
    const boxBody2 = new CANNON.Body({ mass: 10, material: groundMaterial });
    boxBody2.addShape(shape);
    boxBody2.position.set(size * 4, 0, 5);
    world.add(boxBody2);
    demo.addVisual(boxBody2);

    // Change gravity so the boxes will slide along the x-axis
    world.gravity.set(-3, 0, -60);
});

demo.start();
