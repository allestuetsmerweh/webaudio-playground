import React from 'react';

import './SignalView.scss';

interface SignalViewProps {
    analyser?: AnalyserNode;
    width: number;
    height: number;
    noWaveform?: boolean;
}

export const SignalView = (props: SignalViewProps): React.ReactElement => {
    const canvas = React.useRef<HTMLCanvasElement>(null);

    const requestRef = React.useRef<number>();

    const drawSpectrum = (ctx: CanvasRenderingContext2D, analyser: AnalyserNode) => {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        ctx.fillStyle = 'rgb(0,0,0)';
        for (let i = 0; i < props.width; i++) {
            const value = data[i] * props.height / 256;
            ctx.fillRect(i, props.height - value, 1, value);
        }
    };

    const drawWaveform = (ctx: CanvasRenderingContext2D, analyser: AnalyserNode) => {
        const data = new Uint8Array(props.width);
        analyser.getByteTimeDomainData(data);

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'lightBlue';

        ctx.beginPath();
        ctx.moveTo(0, props.height / 2);
        for (let i = 0; i < data.length; i++) {
            const value = data[i] * props.height / 256;
            ctx.lineTo(i, value);
        }
        ctx.lineTo(props.width, props.height / 2);
        ctx.stroke();
    };

    const draw = () => {
        const ctx = canvas.current?.getContext('2d');
        if (!ctx) {
            console.warn('Canvas not found');
            return;
        }
        ctx.fillStyle = props.analyser ? 'rgb(0,100,0)' : 'rgb(100,0,0)';
        ctx.fillRect(0, 0, props.width, props.height);

        if (props.analyser) {
            drawSpectrum(ctx, props.analyser);
            if (!props.noWaveform) {
                drawWaveform(ctx, props.analyser);
            }
        }

        requestRef.current = requestAnimationFrame(draw);
    };

    React.useEffect(() => {
        requestRef.current = requestAnimationFrame(draw);
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [props.analyser]);

    React.useEffect(() => {
        if (props.analyser) {
            props.analyser.fftSize = props.width * 8;
        }
    }, [props.analyser]);

    return (<>
        <div className='signal-view'>
            <canvas
                ref={canvas}
                width={props.width}
                height={props.height}
                className='canvas'
            >
            </canvas>
        </div>
    </>);
};
