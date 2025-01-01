export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // Adds another vector to this vector (mutable)
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    // Subtracts another vector from this vector (mutable)
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    // Scales the vector by a scalar (mutable)
    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    // Rotates the vector by an angle (in radians, mutable)
    rotate(angle) {
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const xNew = this.x * cosA - this.y * sinA;
        const yNew = this.x * sinA + this.y * cosA;
        this.x = xNew;
        this.y = yNew;
        return this;
    }

    // Normalize the vector to have a length of 1 (mutable)
    normalize() {
        const length = this.length();
        if (length > 0) {
            this.scale(1 / length);
        }
        return this;
    }

    // Get the length (magnitude) of the vector
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Dot product of this vector and another vector
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    // Return a copy of the vector
    clone() {
        return new Vector2(this.x, this.y);
    }
}
