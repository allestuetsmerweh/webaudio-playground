import {connect, CompositeNode} from '../CompositeNode';

export class TonestackNode extends CompositeNode<GainNode, GainNode> {
    readonly channelCount = 1;
    readonly channelCountMode: ChannelCountMode = 'max';
    readonly channelInterpretation: ChannelInterpretation = 'speakers';
    readonly numberOfInputs = 1;
    readonly numberOfOutputs = 1;

    protected bassFilterNode: BiquadFilterNode;
    protected midFilterNode: BiquadFilterNode;
    protected trebleFilterNode: BiquadFilterNode;
    protected presenceFilterNode: BiquadFilterNode;

    constructor(context: BaseAudioContext) {
        super(context, context.createGain(), context.createGain());

        this.bassFilterNode = context.createBiquadFilter();
        this.bassFilterNode.frequency.value = 100;
        this.bassFilterNode.type = 'lowshelf';
        this.bassFilterNode.Q.value = 0.7071; // To check with Lepou

        this.midFilterNode = context.createBiquadFilter();
        this.midFilterNode.frequency.value = 1700;
        this.midFilterNode.type = 'peaking';
        this.midFilterNode.Q.value = 0.7071; // To check with Lepou

        this.trebleFilterNode = context.createBiquadFilter();
        this.trebleFilterNode.frequency.value = 6500;
        this.trebleFilterNode.type = 'highshelf';
        this.trebleFilterNode.Q.value = 0.7071; // To check with Lepou

        this.presenceFilterNode = context.createBiquadFilter();
        this.presenceFilterNode.frequency.value = 3900;
        this.presenceFilterNode.type = 'peaking';
        this.presenceFilterNode.Q.value = 0.7071; // To check with Lepou

        connect(this.inputNode, this.bassFilterNode);
        connect(this.bassFilterNode, this.midFilterNode);
        connect(this.midFilterNode, this.trebleFilterNode);
        connect(this.trebleFilterNode, this.presenceFilterNode);
        connect(this.presenceFilterNode, this.outputNode);
    }

    setBassValue(value: number): void {
        // value is [0, 10]
        this.bassFilterNode.gain.value = (value - 10) * 7;
        console.log(`bass gain set to ${this.bassFilterNode.gain.value}`);
    }

    setMidValue(value: number): void {
        // value is [0, 10]
        this.midFilterNode.gain.value = (value - 5) * 4;
        console.log(`mid gain set to ${this.midFilterNode.gain.value}`);
    }

    setTrebleValue(value: number): void {
        // value is [0, 10]
        this.trebleFilterNode.gain.value = (value - 10) * 10;
        console.log(`treble gain set to ${this.trebleFilterNode.gain.value}`);
    }

    setPresenceValue(value: number): void {
        // value is [0, 10]
        this.presenceFilterNode.gain.value = (value - 5) * 2;
        console.log(`presence gain set to ${this.presenceFilterNode.gain.value}`);
    }
}
