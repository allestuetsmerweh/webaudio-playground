import React from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import {NodeData} from '../Testbench/Testbench';

import './BiquadFilterNodeView.scss';

export const BiquadFilterNodeView: React.FunctionComponent<NodeProps<NodeData>> = ({data}) => {
    const biquadFilterNode = data.audioNode as BiquadFilterNode;

    const [type, setType] = React.useState<BiquadFilterType>('lowpass');
    const [frequency, setFrequency] = React.useState<number>(440);
    const [qFactor, setQFactor] = React.useState<number>(0.8);
    const [gain, setGain] = React.useState<number>(0);

    React.useEffect(() => {
        biquadFilterNode.type = type;
        biquadFilterNode.frequency.value = frequency;
        biquadFilterNode.Q.value = qFactor;
        biquadFilterNode.gain.value = gain;
    }, []);

    return (
        <>
            <Handle type="target" position={Position.Top} />
            <div className='biquad-filter-node-view'>
                <h2 className='label'>{data.label}</h2>
                <table><tbody>
                    <tr>
                        <td>Type:</td>
                        <td>
                            <select
                                value={type}
                                onChange={(e) => {
                                    const value = e.target.value as BiquadFilterType;
                                    setType(value);
                                    biquadFilterNode.type = value;
                                }}
                            >
                                <option value='lowpass'>lowpass</option>
                                <option value='highpass'>highpass</option>
                                <option value='bandpass'>bandpass</option>
                                <option value='lowshelf'>lowshelf</option>
                                <option value='highshelf'>highshelf</option>
                                <option value='peaking'>peaking</option>
                                <option value='notch'>notch</option>
                                <option value='allpass'>allpass</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Frequency:</td>
                        <td>
                            <input
                                type='number'
                                value={frequency}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setFrequency(value);
                                    biquadFilterNode.frequency.value = value;
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Q-Factor:</td>
                        <td>
                            <input
                                type='number'
                                value={qFactor}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setQFactor(value);
                                    biquadFilterNode.Q.value = value;
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Gain:</td>
                        <td>
                            <input
                                type='number'
                                value={gain}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setGain(value);
                                    biquadFilterNode.gain.value = value;
                                }}
                            />
                        </td>
                    </tr>
                </tbody></table>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </>
    );
};
