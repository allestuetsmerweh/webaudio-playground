type DistortionFunction = (x: number, k: number) => number;

export function getCurve(fn: DistortionFunction, k: number): Float32Array {
    const nSamples = 44100;
    const curve = new Float32Array(nSamples);
    for (let i = 0; i < nSamples; i++) {
        const x = i * 2 / nSamples - 1;
        curve[i] = fn(x, k);
    }
    return curve;
}

// -----------------------------------------------------------------------------

const noDistortion: DistortionFunction = (x, _k) => x;

const classicDistortion: DistortionFunction =
    (x, k) => (1 + k) * x / (1 + k * Math.abs(x));

const fuzzDistortion: DistortionFunction = (x, k) => {
    const y = k * x;
    return Math.min(1, Math.max(-1, y));
};

const tanhDistortion: DistortionFunction = (x, k) => tanh(x * k);
function tanh(n: number): number {
    return (Math.exp(n) - Math.exp(-n)) / (Math.exp(n) + Math.exp(-n));
}

const cleanDistortion: DistortionFunction = (x, k) => {
    const a = 1 - k / 150;
    const abx = Math.abs(x);
    const y = abx < a ? abx : a + (abx - a) / (1 + Math.pow((abx - a) / (1 - a), 2));
    return Math.sign(x) * y * (1 / ((a + 1) / 2));
};

const hiGainDistortion: DistortionFunction = (x, k) => {
    const a = 1 / (1 + Math.pow(k, 2));
    return x / (Math.abs(x) + a);
};

// -----------------------------------------------------------------------------

export const distortions = {
    none: noDistortion,
    classic: classicDistortion,
    fuzz: fuzzDistortion,
    tanh: tanhDistortion,
    clean: cleanDistortion,
    hiGain: hiGainDistortion,
};

export type DistortionIdent = keyof typeof distortions;

export const distortionIdents = Object.keys(distortions) as DistortionIdent[];
