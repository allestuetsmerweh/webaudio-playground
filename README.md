# guitar-amplifier
A highly modular Guitar Amplifier Simulator written using the Web Audio API.

This project was highly inspired by [WebAudio-Guitar-Amplifier-Simulator](https://github.com/micbuffa/WebAudio-Guitar-Amplifier-Simulator-3) by [micbuffa](https://github.com/micbuffa).

## Usage

### [Demo](https://allestuetsmerweh.github.io/webaudio-playground/)

The `main` branch is automatically deployed at https://allestuetsmerweh.github.io/webaudio-playground/

### Run it yourself

- Check out the code
- Install npm dependencies: `npm install`
- Run the dev server: `npm run start`

## Schematic diagram

As used in https://github.com/micbuffa/WebAudio-Guitar-Amplifier-Simulator-3

```
          +---------------- input ------------+
          |                                   |
      inputGain                               |
          |                                   |
       Booster                                |
          |                                   |
      lowShelf1                               |
          |                                   |
      lowShelf2                               |
          |                                   |
   preampStage1Gain                           |
          |                                   |
     distortion1                              |
          |                                   |
      highPass1                               |
          |                                   |
      lowShelf3                               |
          |                                   |
   preampStage2Gain                           |
          |                                   |
     distortion2                              |
          |                                   |
      outputGain                            bypass
          |                                   |
     trebleFilter                             |
          |                                   |
      bassFilter                              |
          |                                   |
      midFilter                               |
          |                                   |
    presenceFilter                            |
          |                                   |
       eqlocut                                |
          |                                   |
       eqhicut -----+                         |
          |         |                         |
         EQ      byPassEq                     |
          |         |                         |
     masterVolume <-+                         |
          |                                   |
        reverb                                |
          |                                   |
      cabinetSim                              |
          |                                   |
          +---------------> output <----------+
```
