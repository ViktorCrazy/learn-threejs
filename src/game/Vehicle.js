import { Vector2 } from "../math/Vector2";

export class Vehicle {
    constructor(x, y, width, height, maxSpeed = 5, turnRate = 3, friction = 0.98, drag = 0.95) {
        this.position = new Vector2(x, y);  // Vehicle position
        this.velocity = new Vector2(0, 0);  // Vehicle velocity (starts at rest)
        this.acceleration = 0;  // Current acceleration
        this.angle = -90;  // Angle of the vehicle in degrees
        this.width = width;
        this.height = height;
        this.maxSpeed = maxSpeed;
        this.turnRate = turnRate;
        this.friction = friction;
        this.drag = drag;
    }

    // Update the vehicle's position and physics each frame
    update(gas, brake, turnLeft, turnRight) {
        // Handle acceleration and braking
        if (gas) {
            this.acceleration += 0.0003;  // Accelerate
        }
        if (brake) {
            this.acceleration -= 0.0002;  // Brake
        }

        // Apply friction to slow down the vehicle
        this.acceleration *= this.friction;
        if (Math.abs(this.acceleration) < 0.0001) this.acceleration = 0;

        // Limit the speed to the max speed
        if (this.velocity.length() > this.maxSpeed) {
            this.velocity.normalize().scale(this.maxSpeed);
        }

        // Handle turning
        if (turnLeft) {
            this.angle -= this.turnRate;  // Turn left
        }
        if (turnRight) {
            this.angle += this.turnRate;  // Turn right
        }

        // Update the velocity based on acceleration and direction
        const direction = new Vector2(Math.cos(this.angle * Math.PI / 180), Math.sin(this.angle * Math.PI / 180));
        this.velocity.add(direction.scale(this.acceleration));  // Apply acceleration in the direction of the angle

        // Apply drag for air resistance (slows down the velocity)
        this.velocity.scale(this.drag);

        // Update the position based on velocity
        this.position.add(this.velocity);

        // Ensure velocity doesn't exceed maxSpeed
        if (this.velocity.length() > this.maxSpeed) {
            this.velocity.normalize().scale(this.maxSpeed);
        }
    }

    // Basic AABB collision detection
    checkCollision(obstacle) {
        let vehicleBounds = { x: this.position.x, y: this.position.y, width: this.width, height: this.height };
        let obstacleBounds = { x: obstacle.x, y: obstacle.y, width: obstacle.width, height: obstacle.height };

        return vehicleBounds.x < obstacleBounds.x + obstacleBounds.width &&
            vehicleBounds.x + vehicleBounds.width > obstacleBounds.x &&
            vehicleBounds.y < obstacleBounds.y + obstacleBounds.height &&
            vehicleBounds.y + vehicleBounds.height > obstacleBounds.y;
    }
}
