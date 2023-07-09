
/**
 * Immutable 2D vector.
 */
export class Vector {
    static ZERO = new Vector(0, 0);

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Generate a random vector with each component between 0 (inclusive) and 1 (exclusive).
     */
    static random() {
        return new Vector(Math.random(), Math.random());
    }

    /**
     * Create a new vector from a two-element array.
     */
    static fromArray(p) {
        return new Vector(p[0], p[1]);
    }

    /**
     * Create a new vector from polar coordinates.
     */
    static fromPolar(r, theta) {
        return new Vector(Math.cos(theta)*r, Math.sin(theta)*r);
    }

    /**
     * This vector as a two-element array.
     */
    toArray() {
        return [this.x, this.y];
    }

    /**
     * Return the sum of this vector and the given vector.
     */
    plus(p) {
        return new Vector(this.x + p.x, this.y + p.y);
    }

    /**
     * Return the difference between this vector and the given vector.
     */
    minus(p) {
        return new Vector(this.x - p.x, this.y - p.y);
    }

    /**
     * Return the product of this vector and the given vector (piece-wise) or the scalar.
     */
    times(s) {
        if (s instanceof Vector) {
            return new Vector(this.x*s.x, this.y*s.y);
        } else {
            return new Vector(this.x*s, this.y*s);
        }
    }

    /**
     * Return the result of dividing this vector by the given vector (piece-wise) or the scalar.
     */
    dividedBy(s) {
        if (s instanceof Vector) {
            return new Vector(this.x/s.x, this.y/s.y);
        } else {
            return new Vector(this.x/s, this.y/s);
        }
    }

    /**
     * Return this vector with both components negated.
     */
    negate() {
        return new Vector(-this.x, -this.y);
    }

    /**
     * Return the square of the length of this vector.
     */
    lengthSquared() {
        return this.dot(this);
    }

    /**
     * Return the length of this vector.
     */
    length() {
        return Math.sqrt(this.lengthSquared());
    }

    /**
     * Return a new vector, linearly interporated between this vector (t = 0) and
     * the given vector (t = 1).
     */
    lerp(p, t) {
        return this.plus(p.minus(this).times(t));
    }

    /**
     * Return this vector rotated 90 degrees counter-clockwise.
     */
    perpendicular() {
        return new Vector(this.y, -this.x);
    }

    /**
     * Return this vector normalized to length 1. If the vector is of length
     * zero, a zero vector is returned.
     */
    normalized() {
        const length = this.length();
        if (length === 0) {
            return Vector.ZERO;
        }
        return this.dividedBy(length);
    }

    /**
     * Return the dot product between this vector and the given vector.
     */
    dot(p) {
        return this.x*p.x + this.y*p.y;
    }

    /**
     * Return this vector with its components swapped.
     */
    swap() {
        return new Vector(this.y, this.x);
    }

    /**
     * Determinant of the matrix with this on top and p on the bottom.
     */
    det(p) {
        return this.x*p.y - p.x*this.y;
    }

    /**
     * A point with the minimum of x and y of each vector.
     */
    minWith(p) {
        if (p.x < this.x || p.y < this.y) {
            return new Vector(Math.min(this.x, p.x), Math.min(this.y, p.y));
        } else {
            return this;
        }
    }

    /**
     * A point with the maximum of x and y of each vector.
     */
    maxWith(p) {
        if (p.x > this.x || p.y > this.y) {
            return new Vector(Math.max(this.x, p.x), Math.max(this.y, p.y));
        } else {
            return this;
        }
    }

    /**
     * Round coordinates to the nearest integer.
     */
    round() {
        return new Vector(Math.round(this.x), Math.round(this.y));
    }

    /**
     * A string representation of this vector.
     */
    toString() {
        return `[${this.x},${this.y}]`;
    }
}

