# South-Synth-Moutpiece
A customizable p5.js audio visualizer that turns sound into pulsing circles, waveforms, and colorful reactive motion.

## Use it

Open `index.html` in a browser. The app types the scenario prompt, waits two seconds, then starts the configured audio while the internal log reveals in sync. With `Loop` checked, it advances through the configured scenarios.

Configured scenarios:

- Scenario 1: `audio-files/1.mp3`
- Scenario 2: `audio-files/2.1.mp3`, `audio-files/2.2.mp3`, `audio-files/2.3.mp3`
- Scenario 3: `audio-files/3.mp3`

You can still upload your own audio file, and the uploaded file will replace the scenario sequence.

Controls:

- `Shape`: switch between the layered circle mouth and the wavy line mouth.
- `Width` / `Height`: change the size of the reactive shape.
- `React`: change how strongly the shape responds to the audio.
- `Loop`: turn looping on or off.

## Customize it

Most quick changes are near the top of the `<script>` in `index.html`:

```js
const LOOK = {
  background: [9, 11, 18],
  bass: "#ff4d7d",
  mids: "#3ee7ff",
  treble: "#f6d365",
  glow: "#9be7d8",
  lineWeight: 3,
  fftSmooth: 0.84,
  fftBins: 1024
};
```
