export abstract class CompositeNode<
    InputNode extends AudioNode,
    OutputNode extends AudioNode,
> implements Partial<AudioNode> {
    abstract channelCount: number;
    abstract channelCountMode: ChannelCountMode;
    abstract channelInterpretation: ChannelInterpretation;
    abstract numberOfInputs: number;
    abstract numberOfOutputs: number;

    constructor(
        public readonly context: BaseAudioContext,
        public readonly inputNode: InputNode,
        public readonly outputNode: OutputNode,
    ) {}

    addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions | undefined): void {
        throw new Error("Method not implemented.");
    }
    dispatchEvent(event: Event): boolean {
        throw new Error("Method not implemented.");
    }
    removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | EventListenerOptions | undefined): void {
        throw new Error("Method not implemented.");
    }
}

export type AudioNodeOrComposite = AudioNode|CompositeNode<AudioNode, AudioNode>;

export function connect(source: AudioNodeOrComposite, target: AudioNodeOrComposite): void {
    const sourceNode = source instanceof CompositeNode ? source.outputNode : source;
    const targetNode = target instanceof CompositeNode ? target.inputNode : target;
    sourceNode.connect(targetNode);
}

export function disconnect(source: AudioNodeOrComposite, target?: AudioNodeOrComposite): void {
    const sourceNode = source instanceof CompositeNode ? source.outputNode : source;
    const targetNode = target instanceof CompositeNode ? target.inputNode : target;
    if (targetNode) {
        sourceNode.disconnect(targetNode);
        return;
    }
    sourceNode.disconnect();
}