import React from 'react';
import {Dialog} from 'primereact/dialog';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Node,
    Edge,
} from 'reactflow';
import {audioContext} from '../audioContext';
import {AnalyserNodeView} from '../AnalyserNodeView/AnalyserNodeView';
import {BiquadFilterNodeView} from '../BiquadFilterNodeView/BiquadFilterNodeView';
import {InputStreamNodeView} from '../InputStreamNodeView/InputStreamNodeView';
import {BoosterNode} from '../BoosterNodeView/BoosterNode';
import {BoosterNodeView} from '../BoosterNodeView/BoosterNodeView';
import {TonestackNode} from '../TonestackNodeView/TonestackNode';
import {TonestackNodeView} from '../TonestackNodeView/TonestackNodeView';
import {EqualizerNode} from '../EqualizerNodeView/EqualizerNode';
import {EqualizerNodeView} from '../EqualizerNodeView/EqualizerNodeView';
import {AudioNodeOrComposite, connect, disconnect} from '../CompositeNode';

import 'reactflow/dist/style.css';
import './Testbench.scss';

const getWhiteNoise = () => {
    const bufferSize = 2 * audioContext.sampleRate,
    noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate),
    output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    whiteNoise.start(0);
    return whiteNoise;
};

const getAudioSweepOscillator = () => {
    const oscillator = audioContext.createOscillator();

    oscillator.type = 'sine';
    let frequency = 440; // value in hertz
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.start();

    setInterval(() => {
        if (frequency > 10000) {
            frequency = 55;
        } else {
            frequency = frequency * Math.pow(2, 1/12);
        }
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    }, 250);

    return oscillator;
};

// const getPinkNoise = () => {
//     const bufferSize = 4096;
//     const b: [number, number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0, 0];
//     var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
//     node.onaudioprocess = function(e) {
//         var output = e.outputBuffer.getChannelData(0);
//         for (var i = 0; i < bufferSize; i++) {
//             var white = Math.random() * 2 - 1;
//             b[0] = 0.99886 * b[0] + white * 0.0555179;
//             b[1] = 0.99332 * b[1] + white * 0.0750759;
//             b[2] = 0.96900 * b[2] + white * 0.1538520;
//             b[3] = 0.86650 * b[3] + white * 0.3104856;
//             b[4] = 0.55000 * b[4] + white * 0.5329522;
//             b[5] = -0.7616 * b[5] - white * 0.0168980;
//             output[i] = b[0] + b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + white * 0.5362;
//             output[i] *= 0.11; // (roughly) compensate for gain
//             b[6] = white * 0.115926;
//         }
//     }
//     return node;
// }

export interface NodeData {
    label: string;
    audioNode: AudioNodeOrComposite;
}

const initialNodes: Node<NodeData>[] = [
    // {id: 'whiteNoise', position: {x: 0, y: 0}, type: 'input', data: {label: 'White Noise', audioNode: getWhiteNoise()}},
    // {id: 'whiteNoiseAnalyser', position: {x: 0, y: 100}, type: 'analyser', data: {label: 'White Noise Analyser', audioNode: audioContext.createAnalyser()}},
    // {id: 'sweep', position: {x: 500, y: 0}, type: 'input', data: {label: 'Audio Frequency Sweep', audioNode: getAudioSweepOscillator()}},
    // {id: 'sweepAnalyser', position: {x: 500, y: 100}, type: 'analyser', data: {label: 'Audio Frequency Sweep Analyser', audioNode: audioContext.createAnalyser()}},
    {id: 'inputStream', position: {x: 250, y: 150}, type: 'inputStream', data: {label: 'Device Input', audioNode: audioContext.createGain()}},
    {id: 'inputStreamAnalyser', position: {x: 550, y: 150}, type: 'analyser', data: {label: 'Device Input Analyser', audioNode: audioContext.createAnalyser()}},

    {id: 'booster', position: {x: 250, y: 300}, type: 'booster', data: {label: 'Booster', audioNode: new BoosterNode(audioContext)}},
    {id: 'boosterAnalyser', position: {x: 550, y: 300}, type: 'analyser', data: {label: 'Booster Analyser', audioNode: audioContext.createAnalyser()}},

    {id: 'tonestack', position: {x: 250, y: 450}, type: 'tonestack', data: {label: 'Tonestack', audioNode: new TonestackNode(audioContext)}},
    {id: 'tonestackAnalyser', position: {x: 550, y: 450}, type: 'analyser', data: {label: 'Tonestack Analyser', audioNode: audioContext.createAnalyser()}},

    {id: 'equalizer', position: {x: 250, y: 650}, type: 'equalizer', data: {label: 'Equalizer', audioNode: new EqualizerNode(audioContext)}},
    {id: 'equalizerAnalyser', position: {x: 550, y: 650}, type: 'analyser', data: {label: 'Equalizer Analyser', audioNode: audioContext.createAnalyser()}},

    // {id: 'biquadFilter', position: {x: 250, y: 300}, type: 'biquadFilter', data: {label: 'Biquad Filter', audioNode: audioContext.createBiquadFilter()}},
    // {id: 'biquadFilterAnalyser', position: {x: 250, y: 500}, type: 'analyser', data: {label: 'Biquad Filter Analyser', audioNode: audioContext.createAnalyser()}},
    
    {id: 'output', position: {x: 250, y: 900}, type: 'output', data: {label: 'Audio Output', audioNode: audioContext.destination}},
];
  
const initialEdges: Edge<unknown>[] = [
    // {id: 'noiseAnalyser', source: 'whiteNoise', target: 'whiteNoiseAnalyser'},
    // {id: 'noiseBiquad', source: 'whiteNoise', target: 'biquadFilter'},
    // {id: 'sweepAnalyser', source: 'sweep', target: 'sweepAnalyser'},
    // {id: 'sweepBiquad', source: 'sweep', target: 'biquadFilter'},
    {id: 'inputStreamAnalyser', source: 'inputStream', target: 'inputStreamAnalyser'},

    {id: 'inputStreamBooster', source: 'inputStream', target: 'booster'},
    {id: 'boosterAnalyser', source: 'booster', target: 'boosterAnalyser'},

    {id: 'boosterTonestack', source: 'booster', target: 'tonestack'},
    {id: 'tonestackAnalyser', source: 'tonestack', target: 'tonestackAnalyser'},

    {id: 'tonestackEqualizer', source: 'tonestack', target: 'equalizer'},
    {id: 'equalizerAnalyser', source: 'equalizer', target: 'equalizerAnalyser'},

    {id: 'equalizerOutput', source: 'equalizer', target: 'output'},

    // {id: 'inputStreamBiquad', source: 'inputStream', target: 'biquadFilter'},
    // {id: 'biquadAnalyser', source: 'biquadFilter', target: 'biquadFilterAnalyser'},
    // {id: 'biquadOutput', source: 'biquadFilter', target: 'output'},
];

export const Testbench = () => {
    const [audioContextStarted, setAudioContextStarted] = React.useState<bool>(false);
    const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<unknown>(initialEdges);

    const nodeTypes = React.useMemo(() => ({
        inputStream: InputStreamNodeView,
        analyser: AnalyserNodeView,
        biquadFilter: BiquadFilterNodeView,
        booster: BoosterNodeView,
        tonestack: TonestackNodeView,
        equalizer: EqualizerNodeView,
    }), []);
  
    const onConnect = React.useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    React.useEffect(() => {
        const nodeById: {[id: string]: Node<NodeData>} = {};
        nodes.map(node => {
            disconnect(node.data.audioNode);
            nodeById[node.id] = node;
        });
        edges.map(edge => {
            const sourceAudioNode = nodeById[edge.source].data.audioNode;
            const targetAudioNode = nodeById[edge.target].data.audioNode;
            connect(sourceAudioNode, targetAudioNode);
        });
    }, [nodes, edges]);

    return (<>
        <div className="test">
            <ReactFlow
                nodeTypes={nodeTypes}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
            >
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>
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
                <p>Please set your audio volume accordingly now!</p>
            </Dialog>
        </div>
    </>);
};
