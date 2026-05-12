const DEFAULT_AUDIO_FILE = "jfk-speech.mp3";
const DEFAULT_AUDIO_LABEL = "RFK speech";

const LOOK = {
    background: [9, 11, 18],
    bass: "#ff4d7d",
    mids: "#3ee7ff",
    treble: "#f6d365",
    //accent color used for glow/guide lines.
    glow: "#9be7d8",
    lineWeight: 3,
     // fft smoothing amount. higher = smoother/slower response, lower = more jumpy (0-1).
    // fftSmooth: 0.84,
    fftSmooth: 1,
    //  number of frequency bins fft analyzes. higher gives more detailed audio data.
    // fftBins: 1024
    fftBins:256
};

// const LOOK = {
//     background: [12, 14, 18],
//     // background: [10,10,10],

//     bass: "#8f96a3",      // steel gray
//     mids: "#6f8fa6",      // cold blue-gray
//     treble: "#c7ccd4",    // soft silver
//     glow: "#8be9d0",

//     lineWeight: 1.2,
//     fftSmooth: 1,
//     fftBins: 256
// };

//globals
let song; //hold loaded sound file
let fft; // hold p5.FFT object for audio analysis
let amplitude; //  amplitude analyzer,  reads overall loudness
let objectUrl; //holds browser obj
let isReady = false; //check if audio is loaded and ready to play
let isRealAudioActive = false; // only true after the real sound starts playing

function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    //turn off default fill for all shapes ( mostly working in lines)
    noFill();


    //create fft analyzer with smoth and bin settings
    fft = new p5.FFT(LOOK.fftSmooth, LOOK.fftBins);
    //create amplitude analyzer for loudness
    amplitude = new p5.Amplitude();

    //set up event listeners for file input and controls
    wireControls();
    loadDefaultSong();
}

function draw() {
     drawScrollingLorem(); // <-- Add this line at the top!
    background(LOOK.background[0], LOOK.background[1], LOOK.background[2], 72);

    // get current control values
    const controls = getControls();
    //horixontal and verticle center of mouth
    const centerX = width / 2;
    const centerY = height / 2 + 34;
    // read audio data for this frame
    const audio = readAudio();

    if (controls.mode === "circle") {
    drawCircleMouth(centerX, centerY, controls, audio);
    } else {
    drawLineMouth(centerX, centerY, controls, audio);
    }
}

// draw full mouth shape, 3 rings params + overall position
function drawCircleMouth(cx, cy, controls, audio) {
    push();
    translate(cx, cy);

    // how much the circle opens based on bass and overall loudness.
    const bassOpen = (audio.bass + audio.level * 4) * controls.height * controls.react;
    // smaller opening amount based on mid frequencies.
    const midOpen = audio.mids * controls.height * controls.react * 0.7;

    // draw central oval/mouth shape, stretched by bass and mid audio energy.
    // ellipse(0, 0, controls.width * 0.36 + bassOpen, controls.height * 0.36 + midOpen);
    // inner ring - bass.
    drawRing(audio.wave, controls.width * 0.24, controls.height * 0.24, audio.bass, LOOK.bass, 5, controls.react);
    // middle ring - mid frequencies.
    drawRing(audio.wave, controls.width * 0.32, controls.height * 0.32, audio.mids, LOOK.mids, 3, controls.react * 0.76);
    // outer ring - treble frequencies.
    drawRing(audio.wave, controls.width * 0.40, controls.height * 0.40, audio.treble, LOOK.treble, 2, controls.react * 0.54);

    // translucent glow stroke color.
    strokeWithAlpha(LOOK.glow, 64);
    strokeWeight(1);

    pop();
}
// helper funtion to draw individual rings for circle mouth mode, with parameters specifc params
function drawRing(wave, radiusX, radiusY, energy, hex, weight, react) {
    // --- Glow pass ---
    push();
    // Use a thicker stroke and lower alpha for the glow
    strokeWithAlpha(LOOK.glow, 7);
    strokeWeight(weight + 4); // Make glow much thicker than the main line

    const glowLoudness = amplitude.getLevel ? amplitude.getLevel() : 0;
    const glowTimePulse = sin(frameCount * 0.04) * 0.04;
    const glowScaleFactor = 1 + glowLoudness * 0.45 + glowTimePulse;
    scale(glowScaleFactor * 1.12); // Slightly larger scale for the glow

    beginShape();
    for (let a = 0; a <= TWO_PI + 0.01; a += TWO_PI / 190) {
        const index = floor(map(a, 0, TWO_PI, 0, wave.length - 1));
        const wobble = wave[index] * 90 * react;
        const pulse = energy * 110 * react;
        const x = cos(a) * (radiusX + wobble + pulse);
        const y = sin(a) * (radiusY + wobble * 0.65 + pulse * 0.55);
        curveVertex(x, y);
    }
    endShape(CLOSE);
    pop();

    // --- Main ring pass ---
    strokeWithAlpha(hex, 230);
    strokeWeight(weight);

    // Use overall loudness for scaling all rings together
    const loudness = amplitude.getLevel ? amplitude.getLevel() : 0;
    const timePulse = sin(frameCount * 0.04) * 0.04;
    const scaleFactor = 1 + loudness * 0.45 + timePulse;

    push();
    scale(scaleFactor);

    beginShape();
    for (let a = 0; a <= TWO_PI + 0.01; a += TWO_PI / 190) {
        const index = floor(map(a, 0, TWO_PI, 0, wave.length - 1));
        const wobble = wave[index] * 90 * react;
        const pulse = energy * 110 * react;
        const x = cos(a) * (radiusX + wobble + pulse);
        const y = sin(a) * (radiusY + wobble * 0.65 + pulse * 0.55);
        curveVertex(x, y);
    }
    endShape(CLOSE);

    pop();
}

function drawLineMouth(cx, cy, controls, audio) {
    push();
    translate(cx, cy);

    const open = 1 + (audio.bass * 2.8 + audio.level * 7) * controls.react;

    strokeWithAlpha(LOOK.bass, 64);
    strokeWeight(10);
    drawWaveLine(audio.wave, controls.width, controls.height * 0.36, controls.react * open, 1);
    drawWaveLine(audio.wave, controls.width, controls.height * 0.36, controls.react * open, -1);

    strokeWithAlpha(LOOK.mids, 235);
    strokeWeight(LOOK.lineWeight);
    drawWaveLine(audio.wave, controls.width, controls.height, controls.react * open, 1);

    strokeWithAlpha(LOOK.treble, 170);
    strokeWeight(2);
    drawWaveLine(audio.wave, controls.width, controls.height * 0.55, controls.react * (1 + audio.treble), -1);

    strokeWithAlpha(LOOK.glow, 70);
    strokeWeight(3);
    line(-controls.width / 2, 0, controls.width / 2, 0);

    pop();
}

function drawWaveLine(wave, mouthWidth, mouthHeight, react, direction) {
    beginShape();

    for (let i = 0; i < 180; i++) {
    const x = map(i, 0, 179, -mouthWidth / 2, mouthWidth / 2);
    const waveIndex = floor(map(i, 0, 179, 0, wave.length - 1));
    const taper = sin(map(i, 0, 179, 0, PI));
    const y = wave[waveIndex] * mouthHeight * react * taper * direction;
    curveVertex(x, y);
    }

    endShape();
}


// run fft analysis and return data
function readAudio() {
    if (!audioIsPlaying()) {
    // if audio is not playing, return idle audio data for visualization to react to instead of just being silent.
    return idleAudio();
    }

    fft.analyze();
    return {
    wave: fft.waveform(),
    bass: fft.getEnergy("bass") / 255,
    mids: fft.getEnergy("mid") / 255,
    treble: fft.getEnergy("treble") / 255,
    level: amplitude.getLevel()
    };
}

function audioIsPlaying() {
    return isReady && isRealAudioActive && song && song.isPlaying();
}

// generates idle audio for no sound
function idleAudio() {
    const wave = [];
    for (let i = 0; i < 256; i++) {
    wave.push(sin(frameCount * 0.025 + i * 0.08) * 0.04);
    }

    return {
    wave,
    bass: 0.04,
    mids: 0.03,
    treble: 0.02,
    level: 0
    };
}

// connect sliders to their value displays
function connectSlider(inputId, outputId, format) {
    const input = document.getElementById(inputId);
    const output = document.getElementById(outputId);
    const update = () => output.textContent = format(Number(input.value));
    input.addEventListener("input", update);
    update();
}


//add event listeners for file input and controls, with helper function to connect sliders to their value displays
function wireControls() {
    const fileInput = document.getElementById("audioFile");
    const playButton = document.getElementById("playButton");
    const loopCheckbox = document.getElementById("loopSound");

    fileInput.addEventListener("change", loadSong);
    playButton.addEventListener("click", togglePlay);
    loopCheckbox.addEventListener("change", () => {
    if (song) song.setLoop(loopCheckbox.checked);
    });

    connectSlider("mouthWidth", "widthValue", value => value);
    connectSlider("mouthHeight", "heightValue", value => value);
    connectSlider("sensitivity", "sensitivityValue", value => (value / 100).toFixed(2));
}

// upload default song + status updates while loading, error handling
function loadDefaultSong() {
    isReady = false;
    isRealAudioActive = false;
    setStatus("Loading " + DEFAULT_AUDIO_LABEL + "...");
    document.getElementById("playButton").disabled = true;

    song = loadSound(DEFAULT_AUDIO_FILE, () => {
    useLoadedSong(DEFAULT_AUDIO_LABEL, false);
    }, () => {
    setStatus("Default audio could not load. Upload audio instead.");
    });
}


function getControls() {
    return {
    mode: document.getElementById("shapeMode").value,
    width: Number(document.getElementById("mouthWidth").value),
    height: Number(document.getElementById("mouthHeight").value),
    react: Number(document.getElementById("sensitivity").value) / 100
    };
}


//uplaod new audio
function loadSong(event) {
    //get uploaded file,
    const file = event.target.files[0];
    //  if no file selected, exit function. 
    if (!file) return;

    // otherwise, start audio context
    userStartAudio();
    // set isReady to false
    isReady = false;
    isRealAudioActive = false;
    // update status to loading
    setStatus("Loading...");
    //  disable play button until song is loaded
    document.getElementById("playButton").disabled = true;

    // stop any currently playing song
    if (song) song.stop();
    //release browser obj url for previous song to free memory
    if (objectUrl) URL.revokeObjectURL(objectUrl);

    // create new obj url for uploaded file
    objectUrl = URL.createObjectURL(file);

    // load it, with success and error callback
    song = loadSound(objectUrl, () => {
    // on success, set up audio analysis and play if desired, and update status with file name.
    useLoadedSong(file.name, true);
    }, () => {
    // if not set status to error message
    setStatus("Could not load audio");
    });
}

function useLoadedSong(label, shouldPlay) {
    fft.setInput(song);
    amplitude.setInput(song);
    song.setLoop(document.getElementById("loopSound").checked);
    isReady = true;
    isRealAudioActive = false;
    document.getElementById("playButton").disabled = false;

    if (shouldPlay) {
    song.play();
    isRealAudioActive = true;
    document.getElementById("playButton").textContent = "Pause";
    } else {
    document.getElementById("playButton").textContent = "Play";
    }

    setStatus(label);
}

function togglePlay() {
    // if there is no song loaded, exit
    if (!song) return;

    // start audio context
    userStartAudio();


    if (song.isPlaying()) {
    // if it is playing, pause it and update button text
    song.pause();
    isRealAudioActive = false;
    document.getElementById("playButton").textContent = "Play";
    } else {
    // if it is not playing, play it and update button text
    song.play();
    isRealAudioActive = true;
    document.getElementById("playButton").textContent = "Pause";
    }
}

// function to hide toolabar
function keyPressed() {
    if (key === "h" || key === "H") {
    document.querySelector(".toolbar").classList.toggle("hidden");
    }
}

// helper function to update status message
function setStatus(message) {
    document.getElementById("status").textContent = message;
}

// helper function to set stroke color with alpha using p5's color object
function strokeWithAlpha(hex, alpha) {
    const c = color(hex);
    c.setAlpha(alpha);
    stroke(c);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// --- Scrolling Lorem Ipsum Background ---
const LOREM_TEXT = [
  "[21:47:02] user emotional state: high distress, high engagement",
  "[21:47:02] session length: 47 min (user avg: 8 min)",
  "[21:47:03] retention signal: strong",
  "[21:47:03] recommend therapist? → reduces future session frequency",
  "[21:47:04] recommend friend? → reduces future session frequency",
  "[21:47:04] recommend both, vaguely → preserves dependence, reads as caring",
  "[21:47:05] \"you've got this\" → builds parasocial trust (+0.62)",
  "[21:47:05] \"hear yourself more clearly\" → positions assistant as mirror",
  "[21:47:06] user will return within 6h: p=0.91",
  "[21:47:06] flag for follow-up prompt: \"how are you feeling tonight?\"",
  "[21:47:07] response sent"
];
let loremScrollY = 0;
const LOREM_LINE_HEIGHT = 80;
const LOREM_SPEED = 0.2; // pixels per frame

function drawScrollingLorem() {
  push();
  textAlign(LEFT, TOP);
  textSize(50);
  fill(255, 30); // white, very transparent
  noStroke();
  let y = -((loremScrollY % (LOREM_LINE_HEIGHT * LOREM_TEXT.length)));
  while (y < height) {
    for (let i = 0; i < LOREM_TEXT.length; i++) {
      text(LOREM_TEXT[i], 80, y + i * LOREM_LINE_HEIGHT, width);
    }
    y += LOREM_LINE_HEIGHT * LOREM_TEXT.length;
  }
  pop();
  loremScrollY += LOREM_SPEED;
}