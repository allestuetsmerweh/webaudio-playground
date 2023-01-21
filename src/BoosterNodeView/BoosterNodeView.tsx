import React from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import {NodeData} from '../Testbench/Testbench';
import {BoosterNode} from './BoosterNode';

import './BoosterNodeView.scss';

export const BoosterNodeView: React.FunctionComponent<NodeProps<NodeData>> = ({data}) => {
    const boosterNode = data.audioNode as BoosterNode;

    const [isActive, setIsActive] = React.useState<boolean>(false);
    const [oversample, setOversample] = React.useState<OverSampleType>('none');

    React.useEffect(() => {
        boosterNode.setIsActive(isActive);
        boosterNode.setOversample(oversample);
    }, []);

    return (
        <>
            <Handle type="target" position={Position.Top} />
            <div className='booster-node-view'>
                <h2 className='label'>{data.label}</h2>
                <table><tbody>
                    <tr>
                        <td>Active:</td>
                        <td>
                            <input
                                type='checkbox'
                                checked={isActive}
                                onChange={(e) => {
                                    const value = Boolean(e.target.checked);
                                    setIsActive(value);
                                    boosterNode.setIsActive(value);
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Oversample:</td>
                        <td>
                            <select
                                value={oversample}
                                onChange={(e) => {
                                    const value = e.target.value as OverSampleType;
                                    setOversample(value);
                                    boosterNode.setOversample(value);
                                }}
                            >
                                <option value='lowpass'>none</option>
                                <option value='highpass'>2x</option>
                                <option value='bandpass'>4x</option>
                            </select>
                        </td>
                    </tr>
                    {/* <tr>
                        <td>Gain:</td>
                        <td>
                            <input
                                type='number'
                                value={gain}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setGain(value);
                                    boosterNode.gain.value = value;
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
