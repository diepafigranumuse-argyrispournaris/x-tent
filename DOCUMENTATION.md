# X-Tent.js: DOCUMENTATION.md

## Abstract
The X-Tent.js library provides a comprehensive augmentation of the native JavaScript `Math` object and `Number` prototype, tailored for advanced mathematical computations, physics simulations, and geometric manipulations. It introduces robust classes for N-dimensional Cartesian points (`Point`), 2-dimensional and N-dimensional vectors (`Vector`, `N_Vector`), and complex numbers (`Complex`). Furthermore, it extensively extends the `Math` namespace with custom constants, trigonometric utilities, mapping/normalization functions, matrix determinants, and numerical approximations for limits and integrals. Finally, it prototypes the `Number` object to allow for a fluid, method-chaining approach to scalar mathematics.

---

## 1. Core Classes

### 1.1 `Point`
Represents a point in N-dimensional geometric space.

#### `constructor(...args)`
Instantiates a point, mapping arguments sequentially to coordinate axes `x`, `y`, `z`, `t`, `w`, and `u`. For dimensions $N > 6$, it assigns properties in the generated format `i1`, `i2`, etc. Missing arguments default to `0`.
```javascript
// Creates a 3D point (x: 10, y: 20, z: 30)
const p1 = new Point(10, 20, 30);
console.log(p1.y); // Output: 20

// Creates an 8D point
const p2 = new Point(1, 2, 3, 4, 5, 6, 7, 8);
console.log(p2.i2); // Output: 8
```

#### `moveTo(...args)`
Updates the point's coordinates to exactly match those of a newly instantiated point.
```javascript
const p = new Point(5, 5);
p.moveTo(10, -5); 
console.log(p.x, p.y); // Output: 10, -5
```

#### `moveBy(...args)`
Adds a newly defined point's coordinates to the current point's coordinates.
```javascript
const p = new Point(10, 10);
p.moveBy(5, -2);
console.log(p.x, p.y); // Output: 15, 8
```

#### `coords` (Getter)
Returns an object containing the key-value pairs of the point's specific dimensions.
```javascript
const p = new Point(3, 4);
console.log(p.coords); // Output: { x: 3, y: 4 }
```

#### `matrix` (Getter)
Returns a matrix grouping the point's coefficients in triplets, structured as an array of 3D arrays.
```javascript
const p = new Point(1, 2, 3, 4, 5);
console.log(p.matrix); // Output: [ [1, 2, 3], [4, 5] ]
```

#### `N` (Getter)
Returns the total number of dimensions defined within the point.
```javascript
const p = new Point(1, 2, 3, 4);
console.log(p.N); // Output: 4
```

---

### 1.2 `Vector`
Represents a standard 2-dimensional mathematical vector.

#### Static `fromPoint(p)`
Returns a standard `Vector` for 2D points, or an `N_Vector` if the target point has more than two dimensions.
```javascript
const p = new Point(3, 4);
const vec = Vector.fromPoint(p);
console.log(vec.mag); // Output: 5
```

#### Static `Vector.Polar` & `cartesian` (Getter)
A nested class representing a polar vector with radius `r` and angle `theta`. The `cartesian` getter calculates and returns a standard 2D `Vector`.
```javascript
const polarVec = new Vector.Polar(5, Math.PI / 4);
const cartesianVec = polarVec.cartesian; 
// Output: Vector { x: 3.535..., y: 3.535... }
```

#### Static `fromPointPair(p1, p2)`
Calculates a vector representing the mathematical difference across all unique dimensions of two given points ($P2 - P1$).
```javascript
const p1 = new Point(1, 2);
const p2 = new Point(4, 6);
const vec = Vector.fromPointPair(p1, p2);
console.log(vec.x, vec.y); // Output: 3, 4
```

#### Static `analyze_coeff(vec)`
Calculates and returns the `x_coeff` and `y_coeff` based on a given vector's magnitude and angle.
```javascript
const vec = new Vector(3, 4);
console.log(Vector.analyze_coeff(vec)); 
// Output: { x_coeff: 3, y_coeff: 4 }
```

#### `moveBy(dx, dy)` / `update(x, y)`
Translates or directly overwrites the vector's Cartesian coordinates.
```javascript
const vec = new Vector(0, 0);
vec.update(10, 10);
vec.moveBy(5, -5);
console.log(vec.x, vec.y); // Output: 15, 5
```

#### `rotate(theta)`
Rotates the vector by a specified $	heta$ in radians.
```javascript
const vec = new Vector(1, 0);
vec.rotate(Math.PI / 2);
// vec is now approximately (0, 1)
```

#### `scale(mag)` / `add(vec)` / `sub(vec)`
Performs scalar multiplication alongside vector addition and subtraction operations.
```javascript
const v1 = new Vector(2, 3);
const v2 = new Vector(1, 1);

v1.scale(2);        // v1 becomes (4, 6)
const v3 = v1.add(v2); // v3 is (5, 7)
const v4 = v1.sub(v2); // v4 is (3, 5)
```

#### `dot(vec)` / `cross(vec)`
Calculates the dot product and 2D cross product (determinant).
```javascript
const v1 = new Vector(3, 4);
const v2 = new Vector(1, 2);

console.log(v1.dot(v2));   // Output: 3*1 + 4*2 = 11
console.log(v1.cross(v2)); // Output: 3*2 - 4*1 = 2
```

#### `mag` / `mag2` (Getters)
Retrieves the standard magnitude ($|v|$) and the squared magnitude ($|v|^2$).
```javascript
const vec = new Vector(3, 4);
console.log(vec.mag2); // Output: 25
console.log(vec.mag);  // Output: 5
```

#### `d` / `dir` / `dirDEG` (Getters)
Physics-engine optimized getters returning the normalized derivative and direction in both radians and degrees.
```javascript
const vec = new Vector(1, 1);
console.log(vec.dirDEG); // Output: 45
```

---

### 1.3 `N_Vector`
Extends the base `Vector` class to support multi-dimensional spaces beyond 2D geometries.

#### `constructor(p)`
Initializes from a `Point` instance, mapping all point coefficients to internal non-enumerable properties while maintaining standard getters and setters.
```javascript
const p = new Point(1, 2, 3, 4);
const nVec = new N_Vector(p);
console.log(nVec.coords); // Output: { x: 1, y: 2, z: 3, t: 4 }
```

#### `moveBy(...args)` / `moveTo(...args)`
Translates or overwrites the multi-dimensional vector. Throws a Type Error if the argument length exceeds the vector's dimension count.
```javascript
const nVec = new N_Vector(new Point(0, 0, 0));
nVec.moveTo(10, 20, 30);
nVec.moveBy(1, 1, 1);
console.log(nVec.coords); // Output: { x: 11, y: 21, z: 31 }
```

---

### 1.4 `Complex`
Extends the native `Number` object to mathematically handle complex numbers of the structure $a + bi$.

#### `constructor(x, y)`
Stores the real part as `re` and the imaginary part as `im`.
```javascript
const c1 = new Complex(3, 4); // 3 + 4i
```

#### `form` (Getter)
Evaluates the inputs and returns the appropriately formatted string representation of the complex number.
```javascript
const c1 = new Complex(3, -4);
console.log(c1.form); // Output: "3-4i"
```

#### `pow2` / `length` (Getters)
Calculates the squared value (as a new Complex number) and the strict magnitude (modulus) of the complex number.
```javascript
const c1 = new Complex(3, 4);
console.log(c1.length); // Output: 5
```

#### `add(complex)` / `mul(complex)`
Performs complex addition and mathematically robust complex multiplication operations.
```javascript
const c1 = new Complex(1, 2);
const c2 = new Complex(3, 4);

const sum = c1.add(c2); // 4 + 6i
const prod = c1.mul(c2); // (1*3 - 2*4) + (1*4 + 2*3)i = -5 + 10i
```

---

## 2. `Math` Object Extensions

The global `Math` object is heavily expanded to include new computational constants and utilities.

#### Constants & Power Generation
`Math.EPSILON` is overridden to $0.000001$. Dynamically generates functions for powers (positive exponents: `Math.pow1`, `Math.pow2`,..., `Math.pow10000`, negative exponents: `Math.powm1`, `Math.powm2`,..., `Math.powm10000`) and constants for Pi multiples (`Math.PI2`, `Math.PI3`,...,`Math.PI100`).
```javascript
console.log(Math.EPSILON); // Output: 0.000001
console.log(Math.pow3(2)); // Output: 8
console.log(Math.PI2);     // Output: 6.283185307179586
```

#### Core Math Utilities
Custom algebraic and trigonometric helpers (`nrt`, `rad`, `deg`, `sct`, `csc`, `gcd`, `lcm`, `mean`, `loga_base`).
```javascript
console.log(Math.rad(180));       // Output: 3.14159...
console.log(Math.mean(10, 20));   // Output: 15
console.log(Math.gcd(12, 15));    // Output: 3
console.log(Math.nrt(27, 3));     // Output: 3 (Cube root of 27)
```

#### Mapping & Normalization
Functions to clamp, normalize, and interpolate values linearly, logarithmically, or exponentially (`clamp`, `norm`, `linmap`, `logmap`, `expmap`).
```javascript
// Constrain 15 between 0 and 10
console.log(Math.clamp(15, 0, 10)); // Output: 10

// Map 5 from range 0-10 to range 0-100
console.log(Math.linmap(5, 0, 10, 0, 100)); // Output: 50
```

#### `Math.dmt(matrix)`
Calculates the determinant of an $N 	imes N$ square matrix utilizing the Rule of Sarrus or Gaussian Elimination with partial pivoting.
```javascript
const matrix2x2 = [
    [1, 2],
    [3, 4]
];
console.log(Math.dmt(matrix2x2)); // Output: -2
```

#### `Math.lim(func, x, a)`
Approximates the limit of a mathematical function at a given target point `x` by testing positive and negative offset approaches based on precision `a`. **Important Note:** This method strictly requires a `function` to be passed as its first argument (`func`).
```javascript
// The function MUST be the first argument
const f = x => (x * x - 1) / (x - 1);

// Limit as x approaches 1
console.log(Math.lim(f, 1)); // Output: 2
```

#### `Math.intg(target, ...args)`
A numerical integration solver utilizing Simpson's Rule for mathematical functions, and trapezoidal rule logic for row data arrays or 2D scatter plots.
```javascript
// Integrate x^2 from 0 to 10 with 100 steps
const area = Math.intg(x => Math.pow(x, 2), 0, 10, 100); 

// Integrate raw array data with a step size of 1
const arrayArea = Math.intg([0, 10, 20, 10, 0], 1);
```

---

## 3. `Number.prototype` Extensions

The library heavily prototypes standard Numbers to enable direct method-chaining for scalars.

#### Value Extraction
Extract structural string components or digit counts (`integers()`, `decimals()`, `n()`).
```javascript
const num = 123.45;
console.log(num.integers()); // Output: "123"
console.log(num.decimals()); // Output: "45"
console.log(num.n());        // Output: 5 (Total digits)
```

#### Base Conversion
Convert scalars to binary, duodecimal, or hexadecimal formats (`bin()`, `base12()`, `base16()`).
```javascript
const num = 255;
console.log(num.base16()); // Output: 'ff' (255 evaluated in base 16 context)
console.log((10).bin());   // Output: '1010' (10 evaluated in base 2 context)
```

#### Trigonometry & Arithmetic
Standard trigonometric and arithmetic properties are directly callable as methods on scalars.
```javascript
const angle = Math.PI;
console.log(angle.cos()); // Output: -1

const val = 16;
console.log(val.sqrt()); // Output: 4
console.log(val.pow(2)); // Output: 256
```

#### Zero/Sign Prevention
Ensures mathematically safe values by returning precise `Math.EPSILON` adjustments when a zero or incorrect sign is encountered (`preventZero()`, `nzp()`, `nzn()`).
```javascript
const val = 0;
console.log(val.preventZero()); // Output: 0.000001
console.log(val.nzp());         // Output: 0.000001 (Non-zero positive)

const negVal = -0;
console.log(negVal.nzn());      // Output: -0.000001 (Non-zero negative)
```

#### Mapping Interfaces
Seamlessly chain normalization and mapping methods directly onto primitive numbers.
```javascript
const sensorValue = 512;
// Map 512 from 0-1023 to 0-100
const percentage = sensorValue.linmap(0, 1023, 0, 100); 
console.log(percentage.round()); // Output: 50
```
