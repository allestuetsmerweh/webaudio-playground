import {connect, CompositeNode} from '../CompositeNode';

export class DistortionNode extends CompositeNode<GainNode, GainNode> {
    readonly channelCount = 1;
    readonly channelCountMode: ChannelCountMode = 'max';
    readonly channelInterpretation: ChannelInterpretation = 'speakers';
    readonly numberOfInputs = 1;
    readonly numberOfOutputs = 1;

    protected shaperNode: WaveShaperNode;

    constructor(context: BaseAudioContext) {
        super(context, context.createGain(), context.createGain());
        this.shaperNode = context.createWaveShaper();
        connect(this.inputNode, this.shaperNode);
        connect(this.shaperNode, this.outputNode);
    }

    setDistortionCurve(value: Float32Array): void {
        this.shaperNode.curve = value;
    }
}
