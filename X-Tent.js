/* X-Tent enters new Math methods */
class Point {
    _isCoef(x) {
        const isFN = !isNaN(Number(x)) && isFinite(x);
        if (isFN) return Object.keys(this.coords).find(c => this[c] === x) !== undefined ? true : false;
        return isFN;
    }
    constructor(...args) {
        let n,
            arg,
            type,
            x,
            y,
            z,
            t,
            w,
            u,
            coefs = [],
            p;
        n = args.length;
        switch (n) {
            case 0:
                x = y = z = t = w = u = 0;
                p = {
                    x,
                    y,
                    z,
                    t,
                    w,
                    u
                };
                break;
            case 1:
                arg = args[0];
                type = typeof arg;
                switch (type) {
                    case "number":
                        x = y = z = t = w = u = arg;
                        p = {
                            x,
                            y,
                            z,
                            t,
                            w,
                            u
                        };
                        break;
                    default:
                        if (isNaN(Number(arg))) x = y = z = t = w = u = 0;
                        else x = y = z = t = w = u = Number(arg);
                        break;
                }
                p = {
                    x,
                    y,
                    z,
                    t,
                    w,
                    u
                };
                break;
            default:
                for (let i = 0; i < n; i++) {
                    arg = args[i];
                    type = typeof arg;
                    switch (type) {
                        case "number":
                            coefs.push(arg);
                            break;
                        default:
                            if (isNaN(Number(arg))) coefs.push(0);
                            else coefs.push(Number(arg));
                            break;
                    }
                }
                break;
        }
        const cn = coefs.length;
        if (cn > 0) {
            p = {
                x: coefs[0],
                y: coefs[1],
                z: coefs[2],
                t: coefs[3],
                w: coefs[4],
                u: coefs[5]
            };
            if (cn > 6) {
                const d = Math.abs(cn - 6);
                for (let i = 0; i < d; i++) p[`i${i + 1}`] = coefs[/*cn - d*/6 + i];
            }
            for (let x in p)
                if (p[x] == undefined) delete p[x];
        }

        //simplify multi-coefficient access
        for (let x in p) {
            Object.defineProperty(this, x, {
                value: p[x],
                writable: true,
                configurable: true,
                enumerable: true
            });
        }
    }
    moveTo(...args) {
        const newP = new Point(...args);
        for (let x in newP) {
            if (this[x] !== undefined) this[x] = newP[x];
        }
        return this;
    }
    moveBy(...args) {
        const newP = new Point(...args);
        for (let x in newP) {
            if (this[x] !== undefined) this[x] += newP[x];
            else this[x] = newP[x];
        }
        return this;
    }
    rotate(theta = Math.PI / 4) {
        const vec = Vector.fromPoint(this);
    }
    get coords() {
        const coords = {}/*,*/;
        //props = Object.getOwnPropertyDescriptors(this);
        for (let key in this) {
            coords[key] = this[key];
        }
        // for (let key in props) {
        //     const value = props[key].value,
        //         isCoef = this._isCoef(value);
        //     if (isCoef) coords[key] = value;
        // }
        return coords;
    }
    get matrix() {
        const matrix = [],
            props = Object.getOwnPropertyDescriptors(this),
            pl = this.N;
        let i = 0, counter = 0, coefs = [];
        for (let key in props) {
            const value = props[key].value,
                isCoef = this._isCoef(value);
            //We follow trinity logic (array of 3D arrays)
            if (isCoef) {
                i++;
                coefs.push(value);
                counter++;
                if (counter == 3) {
                    matrix.push([coefs[0], coefs[1], coefs[2]]);
                    counter = 0;
                    coefs = [];
                }
                else if (i == pl) matrix.push([value]);
            }
        }
        return matrix;
    }
    get N() {
        return Object.getOwnPropertyNames(this).length;
    }
};

class Vector {
    static fromPoint(p = new Point()) {
        return p.N > 2 ? new N_Vector(p) : new Vector(p.x, p.y);
    }
    static Polar = class {
        constructor(r = 1, theta = 0) {
            this.r = r;
            this.theta = theta;
        }
        get cartesian() {
            const x = this.r * Math.cos(this.theta),
                y = this.r * Math.sin(this.theta);
            return new Vector(x, y);
        }
    };
    static fromPointPair(p1 = Math.point(), p2 = Math.point()) {
        const c1 = p1.coords;
        const c2 = p2.coords;

        // 1. Get all unique dimensions from BOTH points (Union)
        const allKeys = [...new Set([...Object.keys(c1), ...Object.keys(c2)])];

        // 2. Calculate P2 - P1 for every dimension
        const diffs = allKeys.map(k => {
            const d1 = c1[k] || 0,
                d2 = c2[k] || 0;
            return d2 - d1;
        });

        // 3. Create Vector
        const N = diffs.length;
        if (N === 2) return new Vector(diffs[0], diffs[1]);
        return new N_Vector(new Point(...diffs));
    }
    static unit(theta = 0) {
        return new Vector.Polar(1, theta).cartesian;
    }
    static analyze_coeff(vec = new Vector()) {
        const mag = vec.mag,
            theta = Math.atan2(vec.y, vec.x),
            x_coeff = mag * Math.cos(theta),
            y_coeff = mag * Math.sin(theta);
        return {
            x_coeff,
            y_coeff
        };
    }
    _ix
    _iy
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this._ix = this.x;
        this._iy = this.y;
    }
    moveBy(dx = 0, dy = 0) {
        this.x += dx;
        this.y += dy;
        return this;
    }
    update(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        return this;
    }
    rotate(theta = Math.PI / 4) {
        const newTheta = this.theta + theta,
            target = new Vector.Polar(this.mag, newTheta).cartesian;
        return this.update(target.x, target.y);
    }
    reset() {
        this.x = this._ix;
        this.y = this._iy;
        return this;
    }
    scaleX(mag = 1) {
        this.x *= mag;
        return this;
    }
    scaleY(mag = 1) {
        this.y *= mag;
        return this;
    }
    scale(mag = 1) {
        return this.scaleX(mag).scaleY(mag);
    }
    add(vec = new Vector) {
        const newX = this.x + vec.x,
            newY = this.y + vec.y,
            copy = this.copy;
        copy.update(newX, newY);
        return copy;
    }
    sub(vec = new Vector()) {
        const newX = this.x - vec.x,
            newY = this.y - vec.y,
            copy = this.copy;
        copy.update(newX, newY);
        return copy;
    }
    dot(vec = new Vector()) {
        return (this.x * vec.x) + (this.y * vec.y);
    }
    cross(vec = new Vector()) {
        return Math.dmt([[this.x, this.y], [vec.x, vec.y]]);
    }
    norm(...args) {
        let mag,
            magX,
            magY;
        const arg_len = args.length;
        switch (arg_len) {
            case 0:
                throw new Error(`In ${this.constructor.name}:norm method, at least one argument is required`);
            case 1:
                mag = args[0];
                return this.scaleX(this.x / mag).scaleY(this.y / mag);
            case 2:
                magX = args[0];
                magY = args[1];
                return this.scaleX(this.x / magX).scaleY(this.y / magY);
            default:
                return NaN;
        }
    }
    get norm_mag() {
        return this.norm(this.mag);
    }
    get copy() {
        return new this.constructor(this.x, this.y);
    }
    get vector() {
        return new Vector(this.x, this.y);
    }

    //Physics engine optimized code for derivative
    get d() {
        if (this.mag < Math.EPSILON) return new this.constructor(0, 0);
        else {
            const copy = this.copy;
            return copy.norm_mag;
        }
    }
    get dir() {
        const d = this.d;
        return Math.atan2(d.y, d.x);
    }
    //for more human-like gameplay experience
    get dirDEG() {
        return this.dir * 180 / Math.PI;
    }
    get mag2() {
        return (this.x * this.x) + (this.y * this.y);
    }
    get mag() {
        return Math.sqrt(this.mag2);
    }
    get theta() {
        return Math.atan2(this.y, this.x);
    }
    get polar() {
        return new Vector.Polar(this.mag, this.theta);
    }
};

class N_Vector extends Vector {
    constructor(p = new Point()) {
        super(p.x, p.y);
        const coords = p.coords;
        for (let coef in coords) {
            Object.defineProperty(this, `_i${coef}`, {
                value: coords[coef],
                writable: true,
                configurable: true,
                enumerable: false
            });
            Object.defineProperty(this, coef, {
                value: this[`_i${coef}`],
                writable: true,
                configurable: true,
                enumerable: true
            });
        }
    }
    moveBy(...args) {
        const cn = args.length;
        if (cn > this.N) return new Error("Uncaught Type Error: In a N_Vector instance, the provided arguments length cannot be greater than its dimensions.");
        const coefs = Object.getOwnPropertyNames(this).filter(c => c.search("_") == -1);
        for (let i = 0; i < cn; i++) {
            const coef = coefs[i],
                arg = args[i];
            this[coef] += arg;
        }
        return this;
    }
    moveTo(...args) {
        const cn = args.length;
        if (cn > this.N) return new Error("Uncaught Type Error: In a N_Vector instance, the provided arguments length cannot be greater than its dimensions.");
        const coefs = Object.getOwnPropertyNames(this).filter(c => c.search("_") == -1);
        for (let i = 0; i < cn; i++) {
            const coef = coefs[i],
                arg = args[i];
            this[coef] = arg;
        }
        return this;
    }
    update() { }
    scaleN() { }
    scale() { }
    add() { }
    sub() { }
    dot() { }
    cross() { }
    norm() { }
    get copy() {
        const c = new this.constructor();
        for(let coef in this) c[coef] = this[coef];
        return c;
    }
    get coords() {
        const coords = {},
            coefs = Object.getOwnPropertyNames(this).filter(c => c.search("_") == -1);
        if (coefs.length > 0) coefs.forEach(c => coords[c] = this[c]);
        return coords;
    }
    get N() { return Object.getOwnPropertyNames(this.coords).length; }
    get norm_mag() { }
    get mag2() { }
    get mag() { }
    get d() { }
    get dir() { }
    get dirDEG() { }
    get vector2D() { }
    get theta() { }
    get polar() { }
};

class Complex extends Number {
    static fromVector(vector = new Vector()) {
        return new Complex(vector.x, vector.y);
    }
    constructor(x = 0, y = 0) {
        super(x);
        this.re = x;
        this.im = y;
    }
    get form() {
        let r_term,
            i_term,
            form;
        if (this.re != 0) r_term = this.re.toString();
        if (this.im < 0) i_term = "-" + this.im.abs().toString() + "i";
        else i_term = "+" + this.im.toString() + "i";
        if (this.re == 0 && this.im != 0) form = i_term;
        else if (this.re != 0 && this.im == 0) form = r_term;
        else if (this.re == 0 && this.im == 0) form = "0";
        else form = r_term.concat(i_term);
        return form;
    }
    get pow2() {
        const r_pow2 = this.re.pow2(),
            i_pow2 = (-1) * this.im.pow2(),
            abi2 = 2 * this.re * this.im,
            newRe = r_pow2 + i_pow2,
            newIm = abi2;
        return new Complex(newRe, newIm);
    }
    get length() {
        return (this.re.pow2() + this.im.pow2()).sqrt();
    }
    add(complex) {
        return new Complex(this.re + complex.re, this.im + complex.im);
    }
    mul(complex) {
        let a,
            b,
            c,
            d,
            mul;
        a = this.re;
        b = this.im;
        c = complex.re;
        d = complex.im;
        if (a == c && b == d) mul = this.pow2;
        else {
            let mul_ac,
                mul_ad,
                mul_bc,
                mul_bd,
                mul_re,
                mul_im;
            mul_ac = a * c;
            mul_ad = a * d;
            mul_bc = b * c;
            mul_bd = b * d;
            mul_re = mul_ac + mul_bd;
            mul_im = mul_ad + mul_bc;
            mul = new Complex(mul_re, mul_im);
        }
        return mul;
    }
    get vector() {
        return Math.vector(this.re, this.im);
    }
};
Object.defineProperty(Math, "EPSILON", {
    value: 0.000001,
    writable: false,
    enumerable: true,
});
Math.nrt = function (x, y) { return Math.pow(x, y.inv()); };
for (let i = 0; i <= 10000; i++) Math[`pow${i}`] = function (x) { return Math.pow(x, i); };
for (let i = 0; i <= 10000; i++) Math[`powm${i}`] = function (x) { return Math.pow(x, -i); };
for (let i = 2; i <= 100; i++) Math[`PI${i}`] = Math.PI * i;
Math.rad = function (x) {
    return x * Math.PI / 180;
};
Math.deg = function (x) {
    return x * 180 / Math.PI;
};
Math.complex = function (x = 0, y = 0) {
    return new Complex(x, y);
};
Math.sct = function (x) {
    return 1 / Math.cos(x);
};
Math.csc = function (x) {
    return 1 / Math.sin(x);
};
Math.neg = function (x) {
    return x <= 0 ? x : (-1) * x;
};
Math.point = function (...args) {
    return new Point(...args);
};
Math.vector = function (...args) {
    const D = args.length;
    switch (D) {
        case 2:
            return new Vector(args[0], args[1]);
        default:
            return new N_Vector(new Point(...args));
    }
};
Math.gcd = function (a = 1, b = 1) {
    var divided,
        divider,
        remainder;
    if (a == 0 || b == 0) return false;
    else if (a < 1 || b < 1) return false;
    divided = a;
    divider = b;
    do {
        remainder = divided % divider;
        divided = divider;
        divider = remainder;
    } while (divider != 0);
    return divided;
};
Math.lcm = function (a = 1, b = 1) {
    if (a == 0 || b == 0) return 0;
    return (a * b) / Math.gcd(a, b);
};
Math.mean = function (...args) {
    const n = args.length;
    let sum = 0;
    switch (n) {
        case 0:
            return new Error("At least one parameter typeof 'number' is required in argument list");
        case 1:
            return args[0] / 2;
        default:
            for (let i = 0; i < n; i++) sum += args[i];
            return sum / n;
    }
};
Math.ln = Math.log;
Math.loga_base = function (a = 1, base = 1) {
    return Math.ln(a) / Math.ln(base);
};
Math.minclamp = function (val, min, max) {
    return Math.min(min, Math.max(max, val));
};
Math.maxclamp = function (val, min, max) {
    return Math.max(min, Math.min(max, val));
};
Math.clamp = function (val, min, max) {
    const clampmin = Math.minclamp(val, min, max),
        clampmax = Math.maxclamp(val, min, max);
    return Math.max(clampmin, clampmax);
};
Math.norm = function (x, min, max) {
    return (x - min) / (max - min).preventZero();
};
Math.lognorm = function (x, min, max, base = Math.E, l = 1) {
    return Math.norm(Math.loga_base(l * x.nzp(), base), Math.loga_base(l * min.nzp(), base), Math.loga_base(l * max.nzp(), base));
};
Math.expnorm = function (x, min, max, a = Math.E, l = 1) {
    return Math.norm(Math.pow(a, l * x.nzp()), Math.pow(a, l * min.nzp()), Math.pow(a, l * max.nzp()));
};
Math.linmap = function (x, inmin, inmax, outmin, outmax) {
    return (outmax - outmin) * Math.norm(x, inmin, inmax) + outmin;
};
Math.logmap = function (x, inmin, inmax, outmin, outmax, base = Math.E, l = 1) {
    norm = Math.lognorm(x, inmin, inmax, base, l);
    return (outmax - outmin) * norm + outmin;
};
Math.expmap = function (x, inmin, inmax, outmin, outmax, a = Math.E, l = 1) {
    norm = Math.expnorm(x, inmin, inmax, a, l);
    return (outmax - outmin) * norm + outmin;
};

//An algorithm created by Argyrios Pournaris & Google Gemini.
//Google. (2026). Gemini 2.0 Flash [large language model]. https://gemini.google.com
//DIEPAFI GRANUMUSE SINGLE PERSON P.C.
//@Copyright 2026. All rights reserved
Math.dmt = function (matrix = []) {
    // 1. Check if the argument itself is a valid array
    if (!Array.isArray(matrix) || !matrix.length) return 0;

    const n = matrix.length;

    // 2. CHECK EVERY ELEMENT:
    // This ensures every row IS an array AND has the correct length for a square matrix
    const isValidSquareMatrix = matrix.every(row => Array.isArray(row) && row.length === n);

    // 3. If it is NOT valid, return 0
    if (!isValidSquareMatrix) return 0;

    // --- If we are here, execute the optimized code ---

    // Fast paths (2x2, 3x3)
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    if (n === 3) {
        // Rule of Sarrus
        return matrix[0][0] * matrix[1][1] * matrix[2][2] +
            matrix[0][1] * matrix[1][2] * matrix[2][0] +
            matrix[0][2] * matrix[1][0] * matrix[2][1] -
            matrix[0][2] * matrix[1][1] * matrix[2][0] -
            matrix[0][1] * matrix[1][0] * matrix[2][2] -
            matrix[0][0] * matrix[1][2] * matrix[2][1];
    }

    // 3. Gaussian Elimination (General Case for N > 3)
    // Create a shallow copy to avoid mutating the original matrix
    const a = new Array(n);
    for (let i = 0; i < n; i++) {
        a[i] = [...matrix[i]];
    }

    let det = 1;
    for (let i = 0; i < n; i++) {
        // Find Pivot (Strategy: Partial Pivoting)
        let pivot = i;
        for (let j = i + 1; j < n; j++) {
            if (Math.abs(a[j][i]) > Math.abs(a[pivot][i])) {
                pivot = j;
            }
        }

        // Singular Check (If pivot is 0, determinant is 0)
        // Using Math.EPSILON ensures we match your engine's precision standards
        if (Math.abs(a[pivot][i]) < Math.EPSILON) return 0;

        // Swap Rows if needed
        if (pivot !== i) {
            const temp = a[i];
            a[i] = a[pivot];
            a[pivot] = temp;
            det = -det; // Swapping rows flips the sign of the determinant
        }

        det *= a[i][i];

        // Eliminate rows below
        for (let j = i + 1; j < n; j++) {
            const factor = a[j][i] / a[i][i];
            for (let k = i + 1; k < n; k++) {
                // Eliminate the column value
                a[j][k] -= factor * a[i][k];
            }
        }
    }

    return det;
};
Math.lim = function (func, x, a = Math.EPSILON) {

    // 1. CONFIGURATION & PARSING
    const hPos = x + a,
        hNeg = x - a,
        pos = func(hPos),
        neg = func(hNeg);
    return Math.abs(neg - pos) < a * 10 ? (neg + pos) / 2 : "NaL"; //Not-a-Limit
};

//An algorithm created by Argyrios Pournaris & Google Gemini.
//Google. (2026). Gemini 2.0 Flash [large language model]. https://gemini.google.com
//DIEPAFI GRANUMUSE SINGLE PERSON P.C.
//@Copyright 2026. All rights reserved
Math.intg = function (target, ...args) {
    const cfg = {
        mode: null,
        func: null,
        arr: null,
        x0: 0,
        v: 0,
        dx: 1,
        n: 100,
        sign: 1
    },
        type = typeof target;
    let sum = 0, len = 0;

    switch (type) {
        case "function":
            cfg.mode = type;
            cfg.func = target;

            // Require Limits: Math.intg(f, a, b, [n])
            if (args.length < 2) return NaN;
            cfg.x0 = args[0];
            cfg.v = args[1];

            // Optional Resolution
            if (typeof args[2] === "number") cfg.n = Math.ceil(Math.abs(args[2]));

            // Normalize Bounds (if a > b)
            if (cfg.x0 > cfg.v) {
                const temp = cfg.x0;
                cfg.x0 = cfg.b;
                cfg.v = temp;
                cfg.sign = -1;
            } else if (cfg.x0 === cfg.v) {
                return 0;
            }

            // Simpson's Rule Requirement: n must be even
            if (cfg.n % 2 !== 0) cfg.n++;
            break;
        case "object":
            if (isArray(target)) {
                if (target.length < 2) return 0; // Cannot integrate single point

                // Determine Data Type (Uniform [y,y] or Scatter [[x,y], [x,y]])
                const el0 = target[0];

                if (typeof el0 === "number") {
                    cfg.mode = "row_data";
                    cfg.arr = target;
                    // Arg 0 is dx (step size), defaults to 1
                    if (typeof args[0] === "number") cfg.dx = args[0];
                }
                else if (Array.isArray(el0) && el0.length >= 2) {
                    // Scatter Data: [[x1, y1], [x2, y2]...]
                    cfg.mode = "data_scatter";
                    cfg.arr = target;
                }
                else {
                    return NaN; // Invalid array content
                }
            }
            break;
        case "number":
            if (args.length < 2) return NaN;
            return target * (args[1] - args[0]);
        default:
            return NaN;
    }

    // 2. SOLVER EXECUTION
    switch (cfg.mode) {
        case "function":
            const h = (cfg.v - cfg.x0) / cfg.n;
            const f = cfg.func;
            sum = f(cfg.x0) + f(cfg.v);
            for (let i = 1; i < cfg.n; i++) {
                let x = cfg.x0 + i * h;
                // Even indices get weight 2, Odd indices get weight 4
                if (i % 2 === 0) sum += 2 * f(x);
                else sum += 4 * f(x);
            }
            return (sum * h / 3) * cfg.sign;
        case "raw_data":
            const y = cfg.arr;
            len = y.length;
            sum = 0;

            // Validation Loop: Ensure all elements are numbers
            // Logic: 0.5 * dx * (y0 + 2*y1 + ... + yn)

            // Add ends
            if (typeof y[0] !== 'number' || typeof y[len - 1] !== 'number') return NaN;
            sum += y[0] + y[len - 1];

            // Add intermediates * 2
            for (let i = 1; i < len - 1; i++) {
                if (typeof y[i] !== 'number') return NaN;
                sum += 2 * y[i];
            }
            return (sum * config.dx) / 2;
        case "data_scatter":
            const pts = config.arr;
            len = pts.length;
            sum = 0;

            for (let i = 0; i < len - 1; i++) {
                const p1 = pts[i];
                const p2 = pts[i + 1];

                // p = [x, y]
                // Area = (y1 + y2) * (x2 - x1) / 2
                const y_sum = p1[1] + p2[1];
                const dx = p2[0] - p1[0]; // Can be negative if path reverses, which is valid for line integrals

                if (isNaN(y_sum) || isNaN(dx)) return NaN;

                sum += (y_sum * dx) / 2;
            }
            return sum;
    }
    return 0;
};
Math.krad = function (x, angle, phase) {
    return (angle - phase) / (Math.PI2 * x);
};
Math.kdeg = function (x, angle, phase) {
    return Math.deg(Math.krad(x, angle, phase));
};
Math.rrand = function (a = 0, b = 1) {
    return Math.linmap(Math.random(), 0, 1, a, b);
};

Number.prototype.rad = function () {
    return Math.rad(this);
};
Number.prototype.deg = function () {
    return Math.deg(this);
};
//using String methods to extract integers & decimals
Number.prototype.integers = function () {
    const this_str = this.toString(),
        pIndex = this_str.lastIndexOf(".");
    switch (pIndex) {
        case -1:
            return this.valueOf();
        default:
            return this_str.slice(0, pIndex);
    }
};
Number.prototype.decimals = function () {
    const this_str = this.toString(),
        pIndex = this_str.lastIndexOf(".");
    switch (pIndex) {
        case -1:
            return 0;
        default:
            return this_str.slice(pIndex + 1);
    }
};
Number.prototype.intN = function () {
    return this.integers().toString().length;
};
Number.prototype.decN = function () {
    const dec_str = this.decimals().toString();
    return dec_str == "0" ? 0 : dec_str.length;
};
Number.prototype.n = function () {
    return this.intN() + this.decN();
};
Number.prototype.length = Number.prototype.n;
Number.prototype.base = function (x) {
    return Number(this.toString(x));
};
Number.prototype.bin = function () {
    return this.base(2);
};
Number.prototype.base12 = function () {
    return this.base(12);
};
Number.prototype.base16 = function () {
    return this.base(16);
};
Number.prototype.minclamp = function (min, max) {
    return Math.minclamp(this, min, max);
};
Number.prototype.maxclamp = function (min, max) {
    return Math.maxclamp(this, min, max);
};
Number.prototype.clamp = function (min, max) {
    return Math.clamp(this, min, max);
};
Number.prototype.norm = function (min, max) {
    return Math.norm(this, min, max);
};
Number.prototype.lognorm = function (min, max, base = Math.E, l = 1) {
    return Math.lognorm(this, min, max, base, l);
};
Number.prototype.expnorm = function (min, max, a = Math.E, l = 1) {
    return Math.expnorm(this, min, max, a, l);
};
Number.prototype.abs = function () {
    return Math.abs(this);
};
Number.prototype.pow = function (x) {
    return Math.pow(this, x);
};
Object.getOwnPropertyNames(Math).forEach((key, i) => {
    if (key.search("pow") != -1) {
        switch (key) {
            case "pow":
                Number.prototype[key] = function (x) { return Math.pow(this, x); };
                break;
            default:
                Number.prototype[key] = function () { return Math[key](this); };
                break;
        }
    }
});
Number.prototype.inv = function (neg = false) {
    switch (neg) {
        case true:
            return 1 / this.nzn();
        default:
            return 1 / this;
    }
};
Number.prototype.neg = function () {
    return Math.neg(this.valueOf());
};
Number.prototype.sqrt = function () {
    return Math.sqrt(this.valueOf().abs());
};
Number.prototype.cbrt = function () {
    return Math.cbrt(this.valueOf());
};
Number.prototype.nrt = function (x) {
    return Math.nrt(this.valueOf(), x.inv());
}
Number.prototype.asin = function () {
    return Math.asin(this.valueOf());
};
Number.prototype.asinh = function () {
    return Math.asinh(this.valueOf());
};
Number.prototype.sin = function () {
    return Math.sin(this.valueOf());
};
Number.prototype.sinh = function () {
    return Math.sinh(this.valueOf());
};
Number.prototype.cos = function () {
    return Math.cos(this.valueOf());
};
Number.prototype.cosh = function () {
    return Math.cosh(this.valueOf());
};
Number.prototype.tan = function () {
    return Math.tan(this.valueOf());
};
Number.prototype.tanh = function () {
    return Math.tanh(this.valueOf());
};
Number.prototype.atan = function () {
    return Math.atan(this.valueOf());
};
Number.prototype.atanh = function () {
    return Math.atanh(this.valueOf());
};
Number.prototype.cot = function () {
    return Math.cot(this.valueOf());
};
Number.prototype.sct = function () {
    return Math.sct(this.valueOf());
};
Number.prototype.csc = function () {
    return Math.csc(this.valueOf());
};
Number.prototype.log = function () {
    return Math.log10(this.valueOf());
};
Number.prototype.ln = function () {
    return Math.ln(this.valueOf());
};
Number.prototype.log2 = function () {
    return Math.log2(this.valueOf());
};
Number.prototype.log_base = function (base) {
    return Math.loga_base(this.valueOf(), base);
};
Number.prototype.toVector = function () {
    return Math.complex(this.valueOf(), 0).vector;
};

//An algorithm created by Argyrios Pournaris & Google Gemini.
//Google. (2026). Gemini 2.0 Flash [large language model]. https://gemini.google.com
//DIEPAFI GRANUMUSE SINGLE PERSON P.C.
//@Copyright 2026. All rights reserved
Number.prototype.preventZero = function () {
    const value = this.valueOf();
    if (Math.abs(value) > Math.EPSILON) return value;
    return value >= 0 ? Math.EPSILON : -Math.EPSILON;
};
Number.prototype.preventNegative = function () {
    return Math.abs(this.valueOf());
};
Number.prototype.preventPositive = function () {
    return -Math.abs(this.valueOf());
};
//nzp: non-zero but close to zero & positive
Number.prototype.nzp = function () {
    return this.valueOf().preventZero().preventNegative();
};
//nzn: non-zero but close to zero & negative
Number.prototype.nzn = function () {
    return this.valueOf().preventZero().preventPositive();
};
Number.prototype.floor = function () {
    return Math.floor(this.valueOf());
};
Number.prototype.ceil = function () {
    return Math.ceil(this.valueOf());
};
Number.prototype.round = function () {
    return Math.round(this.valueOf());
};
Number.prototype.linmap = function (inmin, inmax, outmin, outmax) {
    return Math.linmap(this.valueOf(), inmin, inmax, outmin, outmax);
};
Number.prototype.logmap = function (inmin, inmax, outmin, outmax, base = Math.E, l = 1) {
    return Math.logmap(this.valueOf(), inmin, inmax, outmin, outmax, base, l);
};
Number.prototype.expmap = function (inmin, inmax, outmin, outmax, a = Math.E, l = 1) {
    return Math.expmap(this.valueOf(), inmin, inmax, outmin, outmax, a, l);
};
Number.prototype.rrand = function (x) {
    return Math.rrand(this.valueOf(), x);
};
Number.prototype.trunc = function () {
    return Math.trunc(this.valueOf());
};
Number.prototype.sign = function () {
    return Math.sign(this.valueOf());
};
Number.prototype.clz32 = function () {
    return Math.clz32(this.valueOf());
};
Number.prototype.fprec = function (decimals = 1) {
    const value = this.valueOf(),
        dec = value.decimals(),
        dec_n = dec;
};