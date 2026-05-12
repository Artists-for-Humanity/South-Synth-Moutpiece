# South-Synth-Moutpiece
A customizable p5.js audio visualizer that turns sound into pulsing circles, waveforms, and colorful reactive motion.

## Use it

Open `index.html` in a browser and press `Play` to hear the default RFK speech. You can still upload your own audio file, and the uploaded file will replace the default sound.

The default recording is Robert F. Kennedy's April 4, 1968 statement on the assassination of Martin Luther King Jr., loaded from Wikimedia Commons.

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
