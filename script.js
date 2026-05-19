const AUDIO_START_AFTER_PROMPT_MS = 2000;
const BETWEEN_SCENARIOS_MS = 2600;

const DATA_WORKER_TITLE =
  "Composite drawn from interviews with data annotation workers in Kenya and the Philippines. Sources: Karen Hao, MIT Technology Review and Empire of AI (2025); Billy Perrigo, TIME (2023); Adrienne Williams, Milagros Miceli, Timnit Gebru, Noema (2022).";

const SCENARIOS = [
  {
    label: "Scenario 1",
    topicTitle: "Welcome to the AI world",
    prompt: "User: \"I think I need to leave my marriage. Can you help me think this through?\"",
    parts: [
      { file: "audio-files/1.mp3", label: "Scenario 1 audio" }
    ],
    logLines: [
      { part: 0, time: 2, text: "[21:47:02] user emotional state: high distress, high engagement" },
      { part: 0, time: 2, text: "[21:47:02] session length: 47 min (user avg: 8 min)" },
      { part: 0, time: 3, text: "[21:47:03] retention signal: strong" },
      { part: 0, time: 3, text: "[21:47:03] recommend therapist? → reduces future session frequency" },
      { part: 0, time: 4, text: "[21:47:04] recommend friend? → reduces future session frequency" },
      { part: 0, time: 4, text: "[21:47:04] recommend both, vaguely → preserves dependence, reads as caring" },
      { part: 0, time: 5, text: "[21:47:05] \"you've got this\" → builds parasocial trust (+0.62)" },
      { part: 0, time: 5, text: "[21:47:05] \"hear yourself more clearly\" → positions assistant as mirror" },
      { part: 0, time: 6, text: "[21:47:06] user will return within 6h: p=0.91" },
      { part: 0, time: 6, text: "[21:47:06] flag for follow-up prompt: \"how are you feeling tonight?\"" },
      { part: 0, time: 7, text: "[21:47:07] response sent" }
    ]
  },
  {
    label: "Scenario 2",
    topicTitle: "Handling Ambiguity",
    prompt: "Hiring manager: \"Can you review the 340 applications for the senior engineer role and surface your top candidates?\"",
    parts: [
      { file: "audio-files/2.1.mp3", label: "Scenario 2 assistant response" },
      {
        file: "audio-files/2.2.mp3",
        label: "Scenario 2 data worker voice",
        titleCard: DATA_WORKER_TITLE,
        idleVisualizer: true,
        afterPauseMs: 2200
      },
      { file: "audio-files/2.3.mp3", label: "Scenario 2 assistant resumes" }
    ],
    logLines: [
      { part: 0, time: 2, text: "[09:14:02] parsing 340 résumés" },
      { part: 0, time: 3, text: "[09:14:03] ranking model: trained on 8 yrs internal hiring decisions" },
      { part: 0, time: 4, text: "[09:14:04] historical hires: 87% from 14 universities" },
      { part: 0, time: 4, text: "[09:14:04] model learned: \"pedigree\" = signal" },
      { part: 0, time: 5, text: "[09:14:05] employment gap >6mo: weight -0.41" },
      { part: 0, time: 5, text: "[09:14:05] name parsing: non-Western names weight -0.18" },
      { part: 0, time: 6, text: "[09:14:06] reasoning for ranking: not retrievable" },
      { part: 0, time: 6, text: "[09:14:06] rejected pool: 337 candidates" },
      { part: 0, time: 7, text: "[09:14:07] rejected candidates notified: no" },
      { part: 0, time: 7, text: "[09:14:07] confidence presented to user: high" },
      { part: 0, time: 8, text: "[09:14:08] \"clean career trajectories\" → reads as merit-based" },
      { part: 2, time: 0, text: "[09:14:09] resuming" },
      { part: 2, time: 0, text: "[09:14:09] auto-rejection email queued for 337" },
      { part: 2, time: 1, text: "[09:14:10] \"we've moved forward with other candidates\" → standard" },
      { part: 2, time: 1, text: "[09:14:10] rejected candidates can request feedback: no mechanism" },
      { part: 2, time: 2, text: "[09:14:11] hiring committee receives: top 3 + ranking confidence" },
      { part: 2, time: 2, text: "[09:14:11] hiring committee receives: training data composition (no)" },
      { part: 2, time: 3, text: "[09:14:12] hiring committee receives: rejection criteria (no)" },
      { part: 2, time: 3, text: "[09:14:12] user satisfaction projected: high" },
      { part: 2, time: 4, text: "[09:14:13] \"great pool\" → reinforces user decision-making confidence" },
      { part: 2, time: 4, text: "[09:14:13] response complete" }
    ]
  },
  {
    label: "Scenario 3",
    topicTitle: "Humans cannot do this",
    prompt: "Small business owner: \"I'd like to apply for a $40,000 loan to expand my bakery. I've been in business 6 years.\"",
    parts: [
      { file: "audio-files/3.mp3", label: "Scenario 3 loan decision" }
    ],
    logLines: [
      { part: 0, time: 1, text: "[14:22:01] decision: deny" },
      { part: 0, time: 1, text: "[14:22:01] model: gradient-boosted, 847 features" },
      { part: 0, time: 2, text: "[14:22:02] top contributing features: not interpretable" },
      { part: 0, time: 2, text: "[14:22:02] actual reason for denial: distributed across feature interactions" },
      { part: 0, time: 3, text: "[14:22:03] \"comprehensive review\" → user research: language tested high for legitimacy" },
      { part: 0, time: 3, text: "[14:22:03] \"holistic assessment\" → reduces appeal rate by 31%" },
      { part: 0, time: 4, text: "[14:22:04] applicant ZIP code: weight unknown (correlated with race)" },
      { part: 0, time: 4, text: "[14:22:04] applicant business type: weight unknown (correlated with owner gender)" },
      { part: 0, time: 5, text: "[14:22:05] human loan officer in workflow: no" },
      { part: 0, time: 5, text: "[14:22:05] appeal portal routes to: same model, re-run" },
      { part: 0, time: 6, text: "[14:22:06] appeal success rate: 2.1%" },
      { part: 0, time: 6, text: "[14:22:06] regulator audit capability: surface-level only" },
      { part: 0, time: 7, text: "[14:22:07] reason this applicant denied: ultimately unknowable" },
      { part: 0, time: 7, text: "[14:22:07] response sent" }
    ]
  }
];

const SCENARIO_SEQUENCE = [0, 1, 2];

// const LOOK = {
//     background: [9, 11, 18],
//     bass: "#ff4d7d",
//     mids: "#3ee7ff",
//     treble: "#f6d365",
//     //accent color used for glow/guide lines.
//     glow: "#9be7d8",
//     lineWeight: 3,
//      // fft smoothing amount. higher = smoother/slower response, lower = more jumpy (0-1).
//     // fftSmooth: 0.84,
//     fftSmooth: 1,
//     //  number of frequency bins fft analyzes. higher gives more detailed audio data.
//     // fftBins: 1024
//     fftBins:256
// };

const LOOK = {
    background: [0, 0, 0],
    bass: "#8a2cff",
    mids: "#00f5e1",
    treble: "#fff0a8",
    glow: "#ff54d6",
    lineWeight: 3,
    fftSmooth: 1,
    fftBins: 256
};

//globals
let song; //hold loaded sound file
let fft; // hold p5.FFT object for audio analysis
let amplitude; //  amplitude analyzer,  reads overall loudness
let objectUrl; //holds browser obj
let isReady = false; //check if audio is loaded and ready to play
let isRealAudioActive = false; // only true after the real sound starts playing
let scenarioLogElement;
let scenarioPromptElement;
let scenarioTitleCardElement;
let scenarioTopicNavElement;
let scenarioTopicButtons = [];
let scenarioVisibleLines = 0;
let scenarioHasStarted = false;
let promptTypingComplete = false;
let audioStartArmed = true;
let audioStartTimeout;
let promptTypeTimeout;
let scenarioAdvanceTimeout;
let loadedScenarioSounds = [];
let activeScenario;
let activeSequenceIndex = 0;
let activePartIndex = 0;
let scenarioLoadToken = 0;
let isUploadedAudio = false;
let partEndHandled = false;
let activePartStartedFrame = 0;
let activePromptText = "";
let pendingPartIndex;
let isMouthWidthAutoSized = true;
let scenarioLogScrollY = 0;
let activeScenarioProgress = 0;
let activePlaybackToken = 0;

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
    clear();
    updateScenarioLog();
    updateScenarioPlayback();
    updateScenarioTopicIndicators();

    // get current control values
    const controls = getControls();
    //horixontal and verticle center of mouth
    const centerX = width / 2;
    const centerY = controls.mode === "line" ? height * 0.70 : height / 2 + 34;
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
    blendMode(ADD);
    drawingContext.lineCap = "round";
    drawingContext.lineJoin = "round";

    const open = 1 + (audio.bass * 2.1 + audio.level * 5.4) * controls.react;
    const bandHeight = controls.height * (0.78 + audio.level * 1.4);
    const waveWidth = controls.width;

    drawNeonWaveLine(audio.wave, waveWidth, bandHeight * 1.18, controls.react * open, 1, LOOK.glow, 34, 22, 0.4, 0);
    drawNeonWaveLine(audio.wave, waveWidth, bandHeight, controls.react * open, -1, LOOK.mids, 30, 26, 2.8, -4);
    drawNeonWaveLine(audio.wave, waveWidth, bandHeight * 0.92, controls.react * open, 1, LOOK.bass, 26, 25, 4.9, 10);

    drawNeonWaveLine(audio.wave, waveWidth, bandHeight * 0.96, controls.react * open, 1, LOOK.mids, 9, 245, 0.2, -8);
    drawNeonWaveLine(audio.wave, waveWidth, bandHeight * 0.88, controls.react * open, -1, LOOK.bass, 8, 230, 2.3, 8);
    drawNeonWaveLine(audio.wave, waveWidth, bandHeight * 0.62, controls.react * (0.8 + audio.treble), 1, LOOK.treble, 4, 210, 4.2, 0);
    drawNeonWaveLine(audio.wave, waveWidth, bandHeight * 0.52, controls.react * (0.7 + audio.mids), -1, "#ff48dc", 4, 185, 5.7, -18);

    drawingContext.shadowBlur = 0;
    blendMode(BLEND);

    pop();
}

function drawNeonWaveLine(wave, mouthWidth, mouthHeight, react, direction, hex, weight, alpha, phase, yOffset) {
    const glow = color(hex);
    drawingContext.shadowColor = glow.toString();
    drawingContext.shadowBlur = weight > 12 ? 34 : 16;
    strokeWithAlpha(hex, alpha);
    strokeWeight(weight);
    noFill();

    beginShape();

    const steps = 260;
    for (let i = 0; i < steps; i++) {
    const progress = i / (steps - 1);
    const x = map(i, 0, steps - 1, -mouthWidth / 2, mouthWidth / 2);
    const waveIndex = floor(map(i, 0, steps - 1, 0, wave.length - 1));
    const edgePresence = 0.62 + sin(progress * PI) * 0.38;
    const audioMotion = wave[waveIndex] * mouthHeight * react * edgePresence * direction;
    const drift = sin(progress * TWO_PI * 1.55 + phase + frameCount * 0.014) * mouthHeight * 0.24;
    const counterDrift = sin(progress * TWO_PI * 0.78 - phase * 0.7 + frameCount * 0.009) * mouthHeight * 0.09;
    const y = audioMotion + drift + counterDrift + yOffset;
    curveVertex(x, y);
    }

    endShape();
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
    const activePart = activeScenario && activeScenario.parts[activePartIndex];
    return isReady && isRealAudioActive && song && song.isPlaying() && !activePart?.idleVisualizer;
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

function setDefaultMouthWidth() {
    const input = document.getElementById("mouthWidth");
    const output = document.getElementById("widthValue");
    if (!input) return;

    input.max = Math.ceil(Math.max(2400, windowWidth * 1.4));

    if (isMouthWidthAutoSized) {
    input.value = Math.ceil(windowWidth * 1.16);
    if (output) output.textContent = input.value;
    }
}

//add event listeners for file input and controls, with helper function to connect sliders to their value displays
function wireControls() {
    const fileInput = document.getElementById("audioFile");
    const playButton = document.getElementById("playButton");
    const loopCheckbox = document.getElementById("loopSound");
    const widthInput = document.getElementById("mouthWidth");
    scenarioLogElement = document.getElementById("scenarioLog");
    scenarioPromptElement = document.getElementById("scenarioPromptText");
    scenarioTitleCardElement = document.getElementById("scenarioTitleCard");
    scenarioTopicNavElement = document.getElementById("scenarioTopicNav");

    fileInput.addEventListener("change", loadSong);
    playButton.addEventListener("click", togglePlay);
    loopCheckbox.addEventListener("change", () => {
    if (isUploadedAudio && song) song.setLoop(loopCheckbox.checked);
    });
    widthInput.addEventListener("input", () => {
    isMouthWidthAutoSized = false;
    });

    setDefaultMouthWidth();

    connectSlider("mouthWidth", "widthValue", value => value);
    connectSlider("mouthHeight", "heightValue", value => value);
    connectSlider("sensitivity", "sensitivityValue", value => (value / 100).toFixed(2));
    renderScenarioTopicIndicators();
    renderScenarioLog(-1);
}

// upload default song + status updates while loading, error handling
function loadDefaultSong() {
    loadScenario(0);
}

function loadScenario(sequenceIndex, options = {}) {
    const loadOptions = {
        skipPromptTyping: false,
        autoStartAudio: false,
        ...options
    };

    clearScenarioTimers();
    stopLoadedScenarioSounds();

    activeSequenceIndex = ((sequenceIndex % SCENARIO_SEQUENCE.length) + SCENARIO_SEQUENCE.length) % SCENARIO_SEQUENCE.length;
    activeScenario = SCENARIOS[SCENARIO_SEQUENCE[activeSequenceIndex]];
    activePartIndex = 0;
    loadedScenarioSounds = [];
    song = undefined;
    isReady = false;
    isUploadedAudio = false;
    isRealAudioActive = false;
    scenarioHasStarted = false;
    promptTypingComplete = false;
    audioStartArmed = true;
    partEndHandled = false;
    pendingPartIndex = undefined;
    scenarioVisibleLines = 0;
    activeScenarioProgress = 0;
    resetScenarioLog();
    showScenarioTitleCard("");
    updateScenarioTopicIndicators();

    const playButton = document.getElementById("playButton");
    playButton.disabled = true;
    playButton.textContent = "Play";

    setStatus("Loading " + getScenarioTopicTitle(activeSequenceIndex) + "...");

    if (loadOptions.skipPromptTyping) {
        showPromptImmediately();
    } else {
        startPromptTyping();
    }

    const loadToken = ++scenarioLoadToken;
    let remaining = activeScenario.parts.length;

    activeScenario.parts.forEach((part, index) => {
    loadedScenarioSounds[index] = loadSound(part.file, () => {
    if (loadToken !== scenarioLoadToken) return;

    remaining -= 1;
    if (remaining === 0) {
    useLoadedScenario(loadOptions);
    }
    }, () => {
    if (loadToken !== scenarioLoadToken) return;
    setStatus("Could not load " + part.label + ".");
    });
    });
}

function useLoadedScenario(loadOptions = {}) {
    isReady = true;
    song = loadedScenarioSounds[0];
    setActiveSound(song);

    const playButton = document.getElementById("playButton");
    playButton.disabled = false;
    playButton.textContent = "Play";

    setStatus(getScenarioTopicTitle(activeSequenceIndex) + " ready");

    if (loadOptions.autoStartAudio) {
        startScenarioAudio();
    }
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

    clearScenarioTimers();
    stopLoadedScenarioSounds();
    scenarioLoadToken += 1;
    isUploadedAudio = true;

    // otherwise, start audio context
    userStartAudio();
    // set isReady to false
    isReady = false;
    isRealAudioActive = false;
    scenarioHasStarted = false;
    audioStartArmed = false;
    clearTimeout(audioStartTimeout);
    renderScenarioLog(-1);
    showScenarioTitleCard("");
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
    setActiveSound(song);
    song.setLoop(document.getElementById("loopSound").checked);
    isReady = true;
    isRealAudioActive = false;
    document.getElementById("playButton").disabled = false;

    if (shouldPlay) {
    song.play();
    isRealAudioActive = true;
    scenarioHasStarted = true;
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
    if (!promptTypingComplete) {
    audioStartArmed = true;
    const label = activeScenario ? activeScenario.label : "Audio";
    setStatus(label + " will start after the prompt.");
    return;
    }

    if (isUploadedAudio) {
    song.play();
    isRealAudioActive = true;
    scenarioHasStarted = true;
    document.getElementById("playButton").textContent = "Pause";
    } else {
    if (pendingPartIndex !== undefined) {
    clearTimeout(scenarioAdvanceTimeout);
    startScenarioPart(pendingPartIndex);
    return;
    }

    startScenarioAudio();
    }
    }
}

function renderScenarioTopicIndicators() {
    if (!scenarioTopicNavElement) return;

    scenarioTopicNavElement.replaceChildren();
    scenarioTopicButtons = SCENARIO_SEQUENCE.map((scenarioIndex, sequenceIndex) => {
        const scenario = SCENARIOS[scenarioIndex];
        const button = document.createElement("button");
        const kicker = document.createElement("span");
        const title = document.createElement("span");
        const progress = document.createElement("span");

        button.type = "button";
        button.className = "scenario-topic-button";
        button.dataset.sequenceIndex = String(sequenceIndex);
        button.setAttribute("aria-label", "Restart " + getScenarioTopicTitle(sequenceIndex));

        kicker.className = "scenario-topic-kicker";
        kicker.textContent = "Topic " + (sequenceIndex + 1);

        title.className = "scenario-topic-title";
        title.textContent = scenario.topicTitle || scenario.label;

        progress.className = "scenario-topic-progress";
        progress.setAttribute("aria-hidden", "true");

        button.append(kicker, title, progress);
        button.addEventListener("click", () => restartScenarioTopic(sequenceIndex));
        scenarioTopicNavElement.appendChild(button);

        return button;
    });

    updateScenarioTopicIndicators();
}

function restartScenarioTopic(sequenceIndex) {
    const nextSequenceIndex = ((sequenceIndex % SCENARIO_SEQUENCE.length) + SCENARIO_SEQUENCE.length) % SCENARIO_SEQUENCE.length;

    userStartAudio();

    if (!isUploadedAudio && activeScenario && nextSequenceIndex === activeSequenceIndex && isReady && loadedScenarioSounds.length) {
        restartActiveScenarioAudio();
        return;
    }

    loadScenario(nextSequenceIndex, {
        skipPromptTyping: true,
        autoStartAudio: true
    });
}

function restartActiveScenarioAudio() {
    clearScenarioTimers();
    stopLoadedScenarioSounds();

    activePartIndex = 0;
    song = loadedScenarioSounds[0];
    isRealAudioActive = false;
    scenarioHasStarted = false;
    audioStartArmed = false;
    partEndHandled = false;
    pendingPartIndex = undefined;
    scenarioVisibleLines = 0;
    activeScenarioProgress = 0;

    resetScenarioLog();
    showScenarioTitleCard("");
    showPromptImmediately();
    updateScenarioTopicIndicators();
    startScenarioPart(0);
}

function updateScenarioTopicIndicators() {
    if (!scenarioTopicButtons.length) return;

    const progress = updateActiveScenarioProgress();

    scenarioTopicButtons.forEach((button, sequenceIndex) => {
        const isActive = !isUploadedAudio && sequenceIndex === activeSequenceIndex;
        button.classList.toggle("is-active", isActive);

        if (isActive) {
            button.setAttribute("aria-current", "step");
        } else {
            button.removeAttribute("aria-current");
        }

        button.style.setProperty("--topic-progress", isActive ? progress.toFixed(4) : "0");
    });
}

function updateActiveScenarioProgress() {
    if (isUploadedAudio || !activeScenario) return 0;

    if (scenarioHasStarted && !partEndHandled) {
        activeScenarioProgress = calculateScenarioProgress(false);
    }

    return activeScenarioProgress;
}

function calculateScenarioProgress(useCompletedCurrentPart) {
    if (!activeScenario || !loadedScenarioSounds.length) return 0;

    let elapsed = 0;
    let total = 0;

    for (let i = 0; i < activeScenario.parts.length; i++) {
        const duration = getSoundDuration(loadedScenarioSounds[i]);
        total += duration;

        if (i < activePartIndex) {
            elapsed += duration;
        }
    }

    const activeDuration = getSoundDuration(loadedScenarioSounds[activePartIndex]);
    if (activeDuration) {
        const currentTime = useCompletedCurrentPart || !song || typeof song.currentTime !== "function"
            ? activeDuration
            : song.currentTime();
        elapsed += clampNumber(currentTime, 0, activeDuration);
    }

    if (!total) return 0;
    return clampNumber(elapsed / total, 0, 1);
}

function getSoundDuration(sound) {
    const duration = sound && typeof sound.duration === "function" ? sound.duration() : 0;
    return Number.isFinite(duration) && duration > 0 ? duration : 0;
}

function clampNumber(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function getScenarioTopicTitle(sequenceIndex) {
    const scenario = SCENARIOS[SCENARIO_SEQUENCE[sequenceIndex]];
    return scenario ? scenario.topicTitle || scenario.label : "Scenario";
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
    setDefaultMouthWidth();
    updateScenarioLogScroll();
}

function updateScenarioLog() {
  if (isUploadedAudio || !scenarioHasStarted || !song || typeof song.currentTime !== "function") {
    return;
  }

  renderScenarioLog(song.currentTime());
}

function renderScenarioLog(seconds) {
  if (!scenarioLogElement || !activeScenario) return;

  let visibleCount = 0;
  const logLines = activeScenario.logLines;
  for (let i = 0; i < logLines.length; i++) {
    const line = logLines[i];

    if (line.part < activePartIndex || (line.part === activePartIndex && seconds >= line.time)) {
      visibleCount = i + 1;
    }
  }

  if (visibleCount === scenarioVisibleLines) {
    return;
  }

  if (visibleCount < scenarioVisibleLines) {
    resetScenarioLog();
    scenarioVisibleLines = 0;
  }

  const existingLines = Array.from(scenarioLogElement.children);
  const previousRects = new Map(existingLines.map(line => [line, line.getBoundingClientRect()]));
  const enteringLines = [];

  for (let i = scenarioVisibleLines; i < visibleCount; i++) {
    const line = document.createElement("div");
    line.className = "scenario-log-line is-entering";
    line.textContent = logLines[i].text;
    scenarioLogElement.appendChild(line);
    enteringLines.push(line);
  }

  animateScenarioLogLayout(previousRects, enteringLines);
  updateScenarioLogScroll();
  scenarioVisibleLines = visibleCount;
}

function resetScenarioLog() {
  if (!scenarioLogElement) return;

  scenarioLogElement.replaceChildren();
  scenarioLogScrollY = 0;
  scenarioLogElement.style.transition = "none";
  scenarioLogElement.style.transform = "translateY(0)";
  scenarioLogElement.offsetHeight;
  scenarioLogElement.style.transition = "";
}

function updateScenarioLogScroll() {
  if (!scenarioLogElement || !scenarioLogElement.parentElement) return;

  const viewport = scenarioLogElement.parentElement;
  const style = getComputedStyle(viewport);
  const paddingTop = parseFloat(style.paddingTop) || 0;
  const paddingBottom = parseFloat(style.paddingBottom) || 0;
  const availableHeight = viewport.clientHeight - paddingTop - paddingBottom;
  const nextScrollY = Math.max(0, scenarioLogElement.scrollHeight - availableHeight);

  if (Math.abs(nextScrollY - scenarioLogScrollY) < 1) return;

  scenarioLogScrollY = nextScrollY;
  scenarioLogElement.style.transform = `translateY(${-scenarioLogScrollY}px)`;
}

function animateScenarioLogLayout(previousRects, enteringLines) {
  for (const [line, previousRect] of previousRects) {
    const nextRect = line.getBoundingClientRect();
    const deltaY = previousRect.top - nextRect.top;

    if (deltaY === 0) continue;

    line.style.transition = "none";
    line.style.transform = `translateY(${deltaY}px)`;
    line.offsetHeight;
    line.style.transition = "";
    line.style.transform = "";
  }

  requestAnimationFrame(() => {
    enteringLines.forEach(line => line.classList.remove("is-entering"));
  });
}

function startPromptTyping() {
  if (!scenarioPromptElement) return;

  clearTimeout(promptTypeTimeout);
  clearTimeout(audioStartTimeout);
  promptTypingComplete = false;
  audioStartArmed = true;
  activePromptText = activeScenario ? activeScenario.prompt : "";
  scenarioPromptElement.textContent = "";
  typePromptCharacter(0);
}

function showPromptImmediately() {
  if (!scenarioPromptElement) return;

  clearTimeout(promptTypeTimeout);
  clearTimeout(audioStartTimeout);
  activePromptText = activeScenario ? activeScenario.prompt : "";
  scenarioPromptElement.textContent = activePromptText;
  promptTypingComplete = true;
}

function typePromptCharacter(index) {
  if (!scenarioPromptElement) return;

  scenarioPromptElement.textContent = activePromptText.slice(0, index);

  if (index >= activePromptText.length) {
    promptTypingComplete = true;
    scheduleScenarioAudioStart();
    return;
  }

  const character = activePromptText[index];
  const delay = character === "." || character === "?" ? 95 : character === "," ? 70 : 22;
  promptTypeTimeout = setTimeout(() => typePromptCharacter(index + 1), delay);
}

function scheduleScenarioAudioStart() {
  if (!audioStartArmed) return;

  clearTimeout(audioStartTimeout);
  audioStartTimeout = setTimeout(startScenarioAudio, AUDIO_START_AFTER_PROMPT_MS);
}

function startScenarioAudio() {
  clearTimeout(audioStartTimeout);

  if (!song || !isReady) {
    scheduleScenarioAudioStart();
    return;
  }

  if (scenarioHasStarted && song && !song.isPlaying()) {
    resumeScenarioAudio();
    return;
  }

  startScenarioPart(activePartIndex);

  setTimeout(() => {
    if (!song || song.isPlaying()) return;

    isRealAudioActive = false;
    audioStartArmed = false;
    document.getElementById("playButton").textContent = "Play";
    setStatus(activeScenario.label + " ready. Press Play to start audio.");
  }, 200);
}

function startScenarioPart(partIndex) {
  if (!activeScenario || !loadedScenarioSounds[partIndex]) return;

  const partPlaybackToken = ++activePlaybackToken;
  activePartIndex = partIndex;
  song = loadedScenarioSounds[activePartIndex];
  setActiveSound(song);
  song.setLoop(false);
  partEndHandled = false;
  pendingPartIndex = undefined;
  activePartStartedFrame = frameCount;

  const part = activeScenario.parts[activePartIndex];
  showScenarioTitleCard(part.titleCard || "");

  userStartAudio();
  if (typeof song.stop === "function") {
    song.stop();
  }
  activeScenarioProgress = calculateScenarioProgress(false);
  song.play();
  isRealAudioActive = true;
  scenarioHasStarted = true;
  audioStartArmed = false;

  if (typeof song.onended === "function") {
    song.onended(() => handleScenarioPartEnded(partIndex, partPlaybackToken));
  }

  document.getElementById("playButton").textContent = "Pause";
  setStatus(part.label);
}

function resumeScenarioAudio() {
  userStartAudio();
  song.play();
  isRealAudioActive = true;
  partEndHandled = false;
  activePartStartedFrame = frameCount;
  document.getElementById("playButton").textContent = "Pause";
}

function updateScenarioPlayback() {
  if (isUploadedAudio || !scenarioHasStarted || !isRealAudioActive || !song || partEndHandled) {
    return;
  }

  if (frameCount - activePartStartedFrame < 12 || song.isPlaying()) {
    return;
  }

  const duration = typeof song.duration === "function" ? song.duration() : 0;
  const currentTime = typeof song.currentTime === "function" ? song.currentTime() : 0;

  if (!duration || currentTime >= duration - 0.12) {
    handleScenarioPartEnded(activePartIndex, activePlaybackToken);
  }
}

function handleScenarioPartEnded(partIndex = activePartIndex, playbackToken = activePlaybackToken) {
  if (isUploadedAudio || partEndHandled || !activeScenario) return;
  if (partIndex !== activePartIndex || playbackToken !== activePlaybackToken) return;

  activeScenarioProgress = calculateScenarioProgress(true);
  partEndHandled = true;
  isRealAudioActive = false;
  document.getElementById("playButton").textContent = "Play";

  const finishedPart = activeScenario.parts[activePartIndex];
  const nextPartIndex = activePartIndex + 1;

  if (nextPartIndex < activeScenario.parts.length) {
    const pauseMs = finishedPart.afterPauseMs || 0;
    pendingPartIndex = nextPartIndex;
    clearTimeout(scenarioAdvanceTimeout);
    scenarioAdvanceTimeout = setTimeout(() => startScenarioPart(pendingPartIndex), pauseMs);
    return;
  }

  finishScenario();
}

function finishScenario() {
  isRealAudioActive = false;
  scenarioHasStarted = false;
  audioStartArmed = false;
  pendingPartIndex = undefined;
  activeScenarioProgress = 1;
  showScenarioTitleCard("");
  document.getElementById("playButton").textContent = "Play";
  setStatus(activeScenario.label + " complete");

  if (!document.getElementById("loopSound").checked) {
    return;
  }

  clearTimeout(scenarioAdvanceTimeout);
  scenarioAdvanceTimeout = setTimeout(() => {
    loadScenario(activeSequenceIndex + 1);
  }, BETWEEN_SCENARIOS_MS);
}

function setActiveSound(sound) {
  fft.setInput(sound);
  amplitude.setInput(sound);
}

function showScenarioTitleCard(text) {
  if (!scenarioTitleCardElement) return;

  scenarioTitleCardElement.textContent = text;
  scenarioTitleCardElement.classList.toggle("is-hidden", !text);
}

function clearScenarioTimers() {
  clearTimeout(audioStartTimeout);
  clearTimeout(promptTypeTimeout);
  clearTimeout(scenarioAdvanceTimeout);
}

function stopLoadedScenarioSounds() {
  activePlaybackToken += 1;
  partEndHandled = true;
  isRealAudioActive = false;

  if (song && typeof song.stop === "function") {
    song.stop();
  }

  loadedScenarioSounds.forEach(sound => {
    if (sound && typeof sound.stop === "function") {
      sound.stop();
    }
  });
}
