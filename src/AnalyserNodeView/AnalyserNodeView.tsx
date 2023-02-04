import React from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import {SignalView} from '../SignalView/SignalView';
import {NodeData} from '../Testbench/Testbench';

import './AnalyserNodeView.scss';

export const AnalyserNodeView: React.FunctionComponent<NodeProps<NodeData>> = ({data}) => {
    const analyser = data.audioNode as AnalyserNode;

    return (
        <>
            <Handle type="target" position={Position.Top} />
            <div className='analyser-node-view'>
                <label className='label'>{data.label}</label>
                <SignalView analyser={analyser} width={512} height={128} />
            </div>
        </>
    );
};
