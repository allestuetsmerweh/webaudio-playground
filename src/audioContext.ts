export const audioContext = new AudioContext();

// In Chrome, the audio context must be started/resumed by a user-initiated
// action. Let's make the experience consistent across browsers and suspend it
// for now.
audioContext.suspend();
