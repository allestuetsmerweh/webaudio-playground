import React from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import {NodeData} from '../Testbench/Testbench';
import {TonestackNode} from './TonestackNode';

import './TonestackNodeView.scss';

export const TonestackNodeView: React.FunctionComponent<NodeProps<NodeData>> = ({data}) => {
    const tonestackNode = data.audioNode as TonestackNode;

    const [bassValue, setBassValue] = React.useState<number>(10);
    const [midValue, setMidValue] = React.useState<number>(10);
    const [trebleValue, setTrebleValue] = React.useState<number>(10);
    const [presenceValue, setPresenceValue] = React.useState<number>(10);

    React.useEffect(() => {
        tonestackNode.setBassValue(bassValue);
        tonestackNode.setMidValue(midValue);
        tonestackNode.setTrebleValue(trebleValue);
        tonestackNode.setPresenceValue(presenceValue);
    }, []);

    return (
        <>
            <Handle type="target" position={Position.Top} />
            <div className='tonestack-node-view'>
                <h2 className='label'>{data.label}</h2>
                <table><tbody>
                    <tr>
                        <td>Bass:</td>
                        <td>
                            <input
                                type='text'
                                value={bassValue}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setBassValue(value);
                                    tonestackNode.setBassValue(value);
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Mid:</td>
                        <td>
                            <input
                                type='text'
                                value={midValue}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setMidValue(value);
                                    tonestackNode.setMidValue(value);
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Treble:</td>
                        <td>
                            <input
                                type='text'
                                value={trebleValue}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setTrebleValue(value);
                                    tonestackNode.setTrebleValue(value);
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Presence:</td>
                        <td>
                            <input
                                type='text'
                                value={presenceValue}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setPresenceValue(value);
                                    tonestackNode.setPresenceValue(value);
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
