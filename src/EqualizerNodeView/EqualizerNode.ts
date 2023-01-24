import {disconnect, connect, CompositeNode} from '../CompositeNode';

export type EqualizerSetting = number[];

const DEFAULT_FREQUENCIES = [100, 200, 400, 800, 1600, 3200];

export class EqualizerNode extends CompositeNode<GainNode, GainNode> {
    readonly channelCount = 1;
    readonly channelCountMode: ChannelCountMode = 'max';
    readonly channelInterpretation: ChannelInterpretation = 'speakers';
    readonly numberOfInputs = 1;
    readonly numberOfOutputs = 1;

    protected filterNodes: BiquadFilterNode[] = [];

    protected frequencies: number[] = [];

    constructor(context: BaseAudioContext) {
        super(context, context.createGain(), context.createGain());

        this.setFrequencies(DEFAULT_FREQUENCIES);
    }

    setFrequencies(newFrequencies: number[]): void {
        disconnect(this.inputNode);
        this.filterNodes.map((filterNode) => {
            disconnect(filterNode);
        });

        this.frequencies = newFrequencies;
        this.filterNodes = this.frequencies.map((frequency) => {
            const filterNode = this.context.createBiquadFilter();
            filterNode.frequency.value = frequency;
            filterNode.type = 'peaking';
            filterNode.gain.value = 0;
            return filterNode;
        });

        connect(this.inputNode, this.filterNodes[0]);
        for (let index = 0; index < this.filterNodes.length - 1; index++) {
            connect(this.filterNodes[index], this.filterNodes[index + 1]);
        }
        connect(this.filterNodes[this.filterNodes.length - 1], this.outputNode);
    }

    setValues(values: EqualizerSetting): void {
        const numValues = values.length;
        const numFrequencies = this.filterNodes.length;
        if (numValues !== numFrequencies) {
            throw new Error(`EqualizerNode.setValues called with ${numValues} values, but we have ${numFrequencies} frequencies`);
        }

        values.map((gain, index) => {
            this.filterNodes[index].gain.value = gain;
        });
    }
}
