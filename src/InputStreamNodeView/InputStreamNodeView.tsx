import React from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import {NodeData} from '../Testbench/Testbench';
import {audioContext} from '../audioContext';

import './InputStreamNodeView.scss';

const DEFAULT_CONSTRAINTS = { 
    audio: {
         echoCancellation: false,
         mozNoiseSuppression: false,
         mozAutoGainControl: false,
    } 
};

const getStream = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(DEFAULT_CONSTRAINTS);
        return stream;
    } catch (error: unknown) {
        console.error('Error with getUserMedia: ', error);
        throw error;
    }
};

const convertToMono = (input: MediaStreamAudioSourceNode): ChannelMergerNode => {
    var splitter = audioContext.createChannelSplitter(2);
    var merger = audioContext.createChannelMerger(2);

    input.connect(splitter);
    splitter.connect(merger, 0, 0);
    splitter.connect(merger, 0, 1);
    return merger;
}


export const InputStreamNodeView: React.FunctionComponent<NodeProps<NodeData>> = ({data}) => {
    const gainNode = data.audioNode as GainNode;

    const [gain, setGain] = React.useState<number>(0);

    React.useEffect(() => {
        gainNode.gain.value = gain;
        
        getStream().then(stream => {
            const stereoInput = audioContext.createMediaStreamSource(stream);
            const input = convertToMono(stereoInput);
            input.connect(gainNode);

            new Array(10).fill(0).map((_, index) => {
                setTimeout(() => {
                    const value = (index + 1) / 10;
                    setGain(value);
                    gainNode.gain.value = value;
                }, index*50);
            });

            setTimeout(() => {
                const value = 0.2;
                setGain(value);
                gainNode.gain.value = value;
            }, 100);
        });
    }, []);

    return (
        <>
            <div className='input-stream-node-view'>
                <h2 className='label'>{data.label}</h2>
                <table><tbody>
                    <tr>
                        <td>Gain:</td>
                        <td>
                            <input
                                type='number'
                                value={gain}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setGain(value);
                                    gainNode.gain.value = value;
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
