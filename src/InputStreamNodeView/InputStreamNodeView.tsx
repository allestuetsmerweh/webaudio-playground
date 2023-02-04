import React from 'react';
import {Dialog} from 'primereact/dialog';
import {Handle, NodeProps, Position} from 'reactflow';
import {NodeData} from '../Testbench/Testbench';
import {audioContext} from '../audioContext';

import './InputStreamNodeView.scss';

const getConstraints = (deviceId?: string): MediaStreamConstraints => ({
    audio: {
        deviceId,
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
    },
});

const getStream = async (deviceId?: string) => {
    const constraints = getConstraints(deviceId);
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        return stream;
    } catch (error: unknown) {
        console.error('Error with getUserMedia: ', error);
        throw error;
    }
};

const getDevices = async () => {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices;
    } catch (error: unknown) {
        console.error('Error with enumerateDevices: ', error);
        throw error;
    }
};


const convertToMono = (input: MediaStreamAudioSourceNode): ChannelMergerNode => {
    const splitter = audioContext.createChannelSplitter(2);
    const merger = audioContext.createChannelMerger(2);

    input.connect(splitter);
    splitter.connect(merger, 0, 0);
    splitter.connect(merger, 0, 1);
    return merger;
};


export const InputStreamNodeView: React.FunctionComponent<NodeProps<NodeData>> = ({data}) => {
    const gainNode = data.audioNode as GainNode;

    const [gain, setGain] = React.useState<number>(0);

    const [audioContextStarted, setAudioContextStarted] = React.useState<boolean>(false);
    const [inputDevices, setInputDevices] = React.useState<MediaDeviceInfo[]>();
    const [selectedDeviceId, setSelectedDeviceId] = React.useState<string>();
    const [inputNode, setInputNode] = React.useState<AudioNode>();

    const gotStream = React.useCallback((stream) => {
        if (!inputDevices) {
            getDevices().then((devices) => {
                setInputDevices(devices.filter(
                    (device) => device.kind === 'audioinput',
                ));
            });
        }

        if (inputNode) {
            console.log(`${inputNode} disconnected.`);
            inputNode.disconnect();
        }

        const stereoInput = audioContext.createMediaStreamSource(stream);
        const newInputNode = convertToMono(stereoInput);
        setInputNode(newInputNode);
    }, [inputDevices, inputNode]);

    React.useEffect(() => {
        gainNode.gain.value = gain;

        getStream(selectedDeviceId).then(gotStream);
    }, [selectedDeviceId]);

    React.useEffect(() => {
        if (!inputNode) {
            return;
        }
        console.log('NEW INPUT NODE');
        inputNode.connect(gainNode);

        new Array(10).fill(0).map((_, index) => {
            setTimeout(() => {
                const value = (index + 1) / 10;
                setGain(value);
                gainNode.gain.value = value;
            }, index * 100);
        });

        setTimeout(() => {
            const value = 0.2;
            setGain(value);
            gainNode.gain.value = value;
        }, 100);
    }, [inputNode]);

    const inputDevicesUi = inputDevices ? (
        <tr>
            <td>Device:</td>
            <td>
                <select
                    value={selectedDeviceId}
                    onChange={(e) => {
                        const newDeviceId = e.target.value;
                        setSelectedDeviceId(newDeviceId);
                    }}
                >
                    {inputDevices.map((device) => (<option value={device.deviceId}>{device.label}</option>))}
                </select>
            </td>
        </tr>
    ) : '';

    return (
        <>
            <div className='input-stream-node-view'>
                <h2 className='label'>{data.label}</h2>
                <table><tbody>
                    {inputDevicesUi}
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
                <Dialog
                    header="Header"
                    visible={!audioContextStarted}
                    style={{ width: '50vw' }}
                    footer={'Footer'}
                    onHide={() => {
                        audioContext.resume();
                        setAudioContextStarted(true);
                    }}
                >
                    <p>Close this dialog when you're ready to start.</p>
                </Dialog>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </>
    );
};
