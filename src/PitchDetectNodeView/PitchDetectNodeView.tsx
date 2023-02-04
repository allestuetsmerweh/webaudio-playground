import React from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import {NodeData} from '../Testbench/Testbench';

import './PitchDetectNodeView.scss';

export const PitchDetectNodeView: React.FunctionComponent<NodeProps<NodeData>> = ({data}) => {
    const analyser = data.audioNode as AnalyserNode;

    const canvas = React.useRef<HTMLCanvasElement>(null);
    const wid = 400;
    const hei = 300;

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            const newHertz = getFrequencyUsingAutocorrelation(analyser);
            const newPitch = hertzToPitch(newHertz?.hertz ?? 0);

            const ctx = canvas.current?.getContext('2d');
            if (!ctx) {
                console.warn('Canvas not found');
                return;
            }
            ctx.clearRect(0, 0, wid, hei);

            if (!newHertz || !newPitch) {
                return;
            }

            ctx.fillStyle = 'rgb(0,0,0)';
            ctx.font = '128px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(String(newPitch.pitch), wid / 2 - 20, hei * 3 / 4);
            ctx.font = '64px sans-serif';
            ctx.fillText(String(Math.floor(newPitch.octave)), wid / 2 + 40, hei * 3 / 4 + 20);

            ctx.beginPath();
            ctx.moveTo(wid / 2, hei);
            ctx.lineTo(
                wid / 2 + Math.sin(newPitch.pitchDiff * Math.PI / 2) * (hei - 10),
                hei - Math.cos(newPitch.pitchDiff * Math.PI / 2) * (hei - 10),
            );
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.strokeStyle = 'rgb(0,0,0)';
            ctx.stroke();
        }, 100);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <>
            <Handle type="target" position={Position.Top} />
            <div className='pitch-detect-node-view'>
                <h2 className='label'>{data.label}</h2>
                <canvas
                    ref={canvas}
                    width={wid}
                    height={hei}
                    className='canvas'
                >
                </canvas>
            </div>
        </>
    );
};

// Slightly adapted version from https://github.com/cwilso/PitchDetect
function getFrequencyUsingAutocorrelation(
    analyser: AnalyserNode,
): {hertz: number}|undefined {
    const size = 2048;
    if (analyser.fftSize !== size) {
        analyser.fftSize = size;
    }
    const sampleRate = analyser.context.sampleRate;
    const buf = new Float32Array(size);
    analyser.getFloatTimeDomainData(buf);

    // Implements the ACF2+ algorithm
    const SIZE = buf.length;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
        const val = buf[i];
        rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.0005) { // not enough signal
        return undefined;
    }

    // Linear programming (How much autocorrelation for each offset?)
    const c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE - i; j++) {
            c[i] = c[i] + buf[j] * buf[j + i];
        }
    }

    // Find maximal autocorrelation
    let d = 0;
    while (c[d] > c[d + 1]) {
        d++;
    }
    let maxValue = -1;
    let maxIndex = -1;
    for (let i = d; i < SIZE; i++) {
        if (c[i] > maxValue) {
            maxValue = c[i];
            maxIndex = i;
        }
    }

    // Adjust index to be a continuous (non-discrete) value.
    const prevValue = c[maxIndex - 1];
    const nextValue = c[maxIndex + 1];
    const a = prevValue + nextValue - 2 * maxValue;
    const b = (nextValue - prevValue) / 2;
    if (a) {
        maxIndex = maxIndex - b / a;
    }

    return {
        hertz: sampleRate / maxIndex,
    };
}

type Pitch = 'A'|'A#'|'B'|'C'|'C#'|'D'|'D#'|'E'|'F'|'F#'|'G'|'G#';
const pitches: Pitch[] = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

function hertzToPitch(hertz: number): {pitch: Pitch, pitchDiff: number, octave: number} {
    const a4 = Math.log2(440);
    const value = Math.log2(hertz);
    const octavesDiff = value - a4;
    const preciseIndex = (octavesDiff - Math.floor(octavesDiff)) * pitches.length;
    const index = Math.round(preciseIndex) % pitches.length;
    return {
        pitch: pitches[index],
        pitchDiff: preciseIndex - Math.round(preciseIndex),
        octave: 4 + octavesDiff,
    };
}
