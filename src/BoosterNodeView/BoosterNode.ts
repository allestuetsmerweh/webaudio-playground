import {disconnect, connect, CompositeNode} from '../CompositeNode';

export class BoosterNode extends CompositeNode<GainNode, GainNode> {
    readonly channelCount = 1;
    readonly channelCountMode: ChannelCountMode = 'max';
    readonly channelInterpretation: ChannelInterpretation = 'speakers';
    readonly numberOfInputs = 1;
    readonly numberOfOutputs = 1;

    protected filterNode: BiquadFilterNode;
    protected shaperNode: WaveShaperNode;

    constructor(context: BaseAudioContext) {
        super(context, context.createGain(), context.createGain());
        this.shaperNode = context.createWaveShaper();
        this.shaperNode.curve = this.makeDistortionCurve(640);
        this.filterNode = context.createBiquadFilter();
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.value = 3317;
        this.filterNode.Q.value = 1;
    }

    setIsActive(value: boolean) {
        this.inputNode.gain.value = 0;
        this.outputNode.gain.value = 0;
        disconnect(this.inputNode);
        console.log(`BoosterNode active: ${value}`);
        if (value) {
            connect(this.inputNode, this.shaperNode);
            connect(this.shaperNode, this.filterNode);
            connect(this.filterNode, this.outputNode);
            this.inputNode.gain.value = 1;
            this.outputNode.gain.value = 1;
        } else {
            connect(this.inputNode, this.outputNode);
            this.inputNode.gain.value = 1;
            this.outputNode.gain.value = 1;
        }
    }

    setOversample(value: OverSampleType) {
        this.shaperNode.oversample = value;
    }

    makeDistortionCurve(k: number): Float32Array {
        var n_samples = 44100; //65536; //22050; //44100;
        var curve = new Float32Array(n_samples);
        var deg = Math.PI / 180;
        for (var i = 0; i < n_samples; i += 1) {
            var x = i * 2 / n_samples - 1;
            curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
        }
        return curve;
    }
}