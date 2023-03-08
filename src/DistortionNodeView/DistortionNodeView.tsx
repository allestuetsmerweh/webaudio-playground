import React from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import {NodeData} from '../Testbench/Testbench';
import {DistortionNode} from './DistortionNode';
import {DistortionIdent, distortionIdents, getCurve, distortions} from './distortions';

import './DistortionNodeView.scss';

export const DistortionNodeView: React.FunctionComponent<NodeProps<NodeData>> = ({data}) => {
    const distortionNode = data.audioNode as DistortionNode;

    const canvas = React.useRef<HTMLCanvasElement>(null);

    const requestRef = React.useRef<number>();

    const [distortion, setDistortion] = React.useState<DistortionIdent>('none');
    const [intensity, setIntensity] = React.useState<number>(1);

    const wid = 200;
    const hei = 200;

    const drawCurve = (ctx: CanvasRenderingContext2D, curve: Float32Array) => {
        ctx.beginPath();
        ctx.moveTo(0, (1 - curve[0]) * hei / 2);
        for (let i = 1; i < curve.length; i++) {
            ctx.lineTo(
                i * wid / (curve.length - 1),
                (1 - curve[i]) * hei / 2,
            );
        }
        ctx.stroke();
    };

    const draw = () => {
        const ctx = canvas.current?.getContext('2d');
        if (!ctx) {
            console.warn('Canvas not found');
            return;
        }
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect(0, 0, 200, 200);

        const curve = getCurve(distortions[distortion], intensity);
        const curveLess = getCurve(distortions[distortion], intensity / 10);
        const curveMore = getCurve(distortions[distortion], intensity * 10);

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'blue';

        drawCurve(ctx, curveLess);
        drawCurve(ctx, curveMore);

        ctx.lineWidth = 3;
        ctx.strokeStyle = 'lightBlue';

        drawCurve(ctx, curve);

        requestRef.current = requestAnimationFrame(draw);
    };

    React.useEffect(() => {
        requestRef.current = requestAnimationFrame(draw);
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [distortion, intensity]);

    React.useEffect(() => {
        const curve = getCurve(distortions[distortion], intensity);
        distortionNode.setDistortionCurve(curve);
    }, [distortion, intensity]);

    return (
        <>
            <Handle type="target" position={Position.Top} />
            <div className='distortion-node-view'>
                <h2 className='label'>{data.label}</h2>
                <table><tbody>
                    <tr>
                        <td>Function:</td>
                        <td>
                            <select
                                value={distortion}
                                onChange={(e) => {
                                    const value = e.target.value as DistortionIdent;
                                    setDistortion(value);
                                }}
                            >
                                {distortionIdents.map((ident) => (
                                    <option value={ident}>{ident}</option>
                                ))}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Intensity:</td>
                        <td>
                            <input
                                type='number'
                                value={intensity}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setIntensity(value);
                                }}
                            />
                        </td>
                    </tr>
                </tbody></table>
                <canvas
                    ref={canvas}
                    width={200}
                    height={200}
                    className='canvas'
                >
                </canvas>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </>
    );
};
