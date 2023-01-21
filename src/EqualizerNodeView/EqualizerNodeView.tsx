import React from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import {NodeData} from '../Testbench/Testbench';
import {EqualizerNode, EqualizerSetting} from './EqualizerNode';

import './EqualizerNodeView.scss';

const FREQUENCIES = [100, 200, 400, 800, 1600, 3200];

export const EqualizerNodeView: React.FunctionComponent<NodeProps<NodeData>> = ({data}) => {
    const equalizerNode = data.audioNode as EqualizerNode;

    const [values, setValues] = React.useState<EqualizerSetting>(FREQUENCIES.map(() => 0));

    React.useEffect(() => {
        equalizerNode.setValues(values);
    }, []);

    return (
        <>
            <Handle type="target" position={Position.Top} />
            <div className='equalizer-node-view'>
                <h2 className='label'>{data.label}</h2>
                <table><tbody>
                    {FREQUENCIES.map((frequency, index) => (
                        <tr>
                            <td>{frequency}:</td>
                            <td>
                                <input
                                    type='text'
                                    value={values[index]}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        const newValues = [...values];
                                        newValues[index] = value;
                                        setValues(newValues);
                                        equalizerNode.setValues(newValues);
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                    {/* <tr>
                        <td>Gain:</td>
                        <td>
                            <input
                                type='number'
                                value={gain}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setGain(value);
                                    EqualizerNode.gain.value = value;
                                }}
                            />
                        </td>
                    </tr> */}
                </tbody></table>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </>
    );
};
