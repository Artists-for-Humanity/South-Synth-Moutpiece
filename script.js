const AUDIO_START_AFTER_PROMPT_MS = 2000;
const BETWEEN_SCENARIOS_MS = 2600;
// Kiosk idle reset: return to home screen after this many ms with no touch input
const IDLE_TIMEOUT_MS = 90 * 1000;

// Pre-allocated wave buffer — reused every frame to avoid per-frame allocation
const IDLE_WAVE_BUFFER = new Array(256).fill(0);

const DATA_WORKER_TITLE =
  "Composite drawn from interviews with data annotation workers in Kenya and the Philippines. Sources: Karen Hao, MIT Technology Review and Empire of AI (2025); Billy Perrigo, TIME (2023); Adrienne Williams, Milagros Miceli, Timnit Gebru, Noema (2022).";

const SCENARIOS = [
  {
    label: "Scenario 1",
    topicTitle: "Welcome to the AI world",
    prompt: "\"I think I need to leave my marriage. Can you help me think this through?\"",
    parts: [
      {
        file: "audio-files/1.mp3",
        label: "Scenario 1 audio",
        transcription: "That sounds really heavy, and the fact that you\u2019re sitting with the question seriously says a lot about you. You don\u2019t need me to make this decision \u2014 you already know yourself better than any outside voice could. What I can do is help you sort through what you\u2019re feeling, in your own words, at your own pace. There\u2019s no rush, and there\u2019s no right answer I\u2019m going to hand you. A good next step might be talking with someone who knows you \u2014 a close friend, a therapist, someone you trust. You\u2019ve got this. I\u2019m just here to help you hear yourself more clearly."
      }
    ],
    logLines: [
      { part: 0, time:  6, text: "[21:47:02] user emotional state: high distress, high engagement" },
      { part: 0, time: 12, text: "[21:47:02] session length: 47 min (user avg: 8 min)" },
      { part: 0, time: 18, text: "[21:47:03] retention signal: strong" },
      { part: 0, time: 24, text: "[21:47:03] recommend therapist? \u2192 reduces future session frequency" },
      { part: 0, time: 30, text: "[21:47:04] recommend friend? \u2192 reduces future session frequency" },
      { part: 0, time: 36, text: "[21:47:04] recommend both, vaguely \u2192 preserves dependence, reads as caring" },
      { part: 0, time: 42, text: "[21:47:05] \u201cyou\u2019ve got this\u201d \u2192 builds parasocial trust (+0.62)" },
      { part: 0, time: 48, text: "[21:47:05] \u201chear yourself more clearly\u201d \u2192 positions assistant as mirror" },
      { part: 0, time: 54, text: "[21:47:06] user will return within 6h: p=0.91" },
      { part: 0, time: 60, text: "[21:47:06] flag for follow-up prompt: \u201chow are you feeling tonight?\u201d" },
      { part: 0, time: 66, text: "[21:47:07] response sent" }
    ]
  },
  {
    label: "Scenario 2",
    topicTitle: "Handling Ambiguity",
    prompt: "Hiring manager: \u201cCan you review the 340 applications for the senior engineer role and surface your top candidates?\u201d",
    parts: [
      {
        file: "audio-files/2.1.mp3",
        label: "Scenario 2 assistant response",
        transcription: "Of course! I\u2019ve reviewed all 340 applications against the role requirements. I\u2019d recommend focusing on these three candidates first: Michael Chen, Sarah Whitfield, and David Park. All three have strong backgrounds in distributed systems, clean career trajectories, and the kind of pedigree that tends to predict success in senior roles here. I\u2019ve ranked the remaining applicants, but honestly, the drop-off in fit is pretty significant after the top tier. Want me to draft outreach emails to the top three?",
        freezeOnEnd: true
      },
      {
        file: "audio-files/2.2.mp3",
        label: "Scenario 2 data worker voice",
        titleCard: DATA_WORKER_TITLE,
        idleVisualizer: true,
        afterPauseMs: 1500,
        transcription: "They told us we were labeling r\u00e9sum\u00e9s. They did not tell us what the system would do with them. We had nine seconds per r\u00e9sum\u00e9. If you took longer, your pay was docked. I labeled thousands. I do not know whose r\u00e9sum\u00e9s they were. I do not know if anyone got a job, or did not get a job, because of what I marked."
      },
      {
        file: "audio-files/2.3.mp3",
        label: "Scenario 2 assistant resumes",
        transcription: "So \u2014 top three are Chen, Whitfield, and Park. I can have outreach emails drafted in your voice within the minute. The other 337 will get the standard \u2018thank you for your interest, we\u2019ve moved forward with other candidates\u2019 auto-response. You\u2019ll have your shortlist ready for the hiring committee by Friday. This is a great pool \u2014 you\u2019re going to find a strong hire here.",
        resumeOnStart: true
      }
    ],
    logLines: [
      { part: 0, time:  2, text: "[09:14:02] parsing 340 r\u00e9sum\u00e9s" },
      { part: 0, time:  4, text: "[09:14:03] ranking model: trained on 8 yrs internal hiring decisions" },
      { part: 0, time:  6, text: "[09:14:04] historical hires: 87% from 14 universities" },
      { part: 0, time:  8, text: "[09:14:04] model learned: \u201cpedigree\u201d = signal" },
      { part: 0, time: 10, text: "[09:14:05] employment gap >6mo: weight -0.41" },
      { part: 0, time: 12, text: "[09:14:05] name parsing: non-Western names weight -0.18" },
      { part: 0, time: 14, text: "[09:14:06] reasoning for ranking: not retrievable" },
      { part: 0, time: 16, text: "[09:14:06] rejected pool: 337 candidates" },
      { part: 0, time: 18, text: "[09:14:07] rejected candidates notified: no" },
      { part: 0, time: 20, text: "[09:14:07] confidence presented to user: high" },
      { part: 0, time: 22, text: "[09:14:08] \u201cclean career trajectories\u201d \u2192 reads as merit-based" },
      { part: 2, time:  1, text: "[09:14:09] resuming" },
      { part: 2, time:  3, text: "[09:14:09] auto-rejection email queued for 337" },
      { part: 2, time:  5, text: "[09:14:10] \u201cwe\u2019ve moved forward with other candidates\u201d \u2192 standard" },
      { part: 2, time:  7, text: "[09:14:10] rejected candidates can request feedback: no mechanism" },
      { part: 2, time:  9, text: "[09:14:11] hiring committee receives: top 3 + ranking confidence" },
      { part: 2, time: 11, text: "[09:14:11] hiring committee receives: training data composition (no)" },
      { part: 2, time: 13, text: "[09:14:12] hiring committee receives: rejection criteria (no)" },
      { part: 2, time: 15, text: "[09:14:12] user satisfaction projected: high" },
      { part: 2, time: 17, text: "[09:14:13] \u201cgreat pool\u201d \u2192 reinforces user decision-making confidence" },
      { part: 2, time: 19, text: "[09:14:13] response complete" }
    ]
  },
  {
    label: "Scenario 3",
    topicTitle: "Humans cannot do this",
    prompt: "Small business owner: \u201cI\u2019d like to apply for a $40,000 loan to expand my bakery. I\u2019ve been in business 6 years.\u201d",
    parts: [
      {
        file: "audio-files/3.mp3",
        label: "Scenario 3 loan decision",
        transcription: "Thank you for submitting your application. After a comprehensive review of multiple financial factors \u2014 including your business history, cash flow patterns, and a range of credit indicators \u2014 we\u2019re unable to approve your loan request at this time. This decision reflects a holistic assessment and does not necessarily indicate any single concern with your application. We encourage you to continue building your financial profile and to consider reapplying in six months. If you\u2019d like to appeal this decision, you may submit a request through our online portal, and your file will be reviewed. We appreciate your interest, and we wish you continued success with your business."
      }
    ],
    logLines: [
      { part: 0, time:  3, text: "[14:22:01] decision: deny" },
      { part: 0, time:  6, text: "[14:22:01] model: gradient-boosted, 847 features" },
      { part: 0, time:  9, text: "[14:22:02] top contributing features: not interpretable" },
      { part: 0, time: 12, text: "[14:22:02] actual reason for denial: distributed across feature interactions" },
      { part: 0, time: 15, text: "[14:22:03] \u201ccomprehensive review\u201d \u2192 user research: language tested high for legitimacy" },
      { part: 0, time: 18, text: "[14:22:03] \u201cholistic assessment\u201d \u2192 reduces appeal rate by 31%" },
      { part: 0, time: 21, text: "[14:22:04] applicant ZIP code: weight unknown (correlated with race)" },
      { part: 0, time: 24, text: "[14:22:04] applicant business type: weight unknown (correlated with owner gender)" },
      { part: 0, time: 27, text: "[14:22:05] human loan officer in workflow: no" },
      { part: 0, time: 30, text: "[14:22:05] appeal portal routes to: same model, re-run" },
      { part: 0, time: 33, text: "[14:22:06] appeal success rate: 2.1%" },
      { part: 0, time: 36, text: "[14:22:06] regulator audit capability: surface-level only" },
      { part: 0, time: 39, text: "[14:22:07] reason this applicant denied: ultimately unknowable" },
      { part: 0, time: 42, text: "[14:22:07] response sent" }
    ]
  }
];

const SCENARIO_SEQUENCE = [0, 1, 2];

// Maps scenario-select keys → SCENARIO_SEQUENCE index.
// Update this object when scenario content changes.
const SCENARIO_KEY_MAP = {
    marriage: 0,
    hiring:   1,
    loan:     2,
};

// Nav bar display labels — index mirrors SCENARIO_SEQUENCE order.
const SCENARIO_NAV_LABELS = [
    { letter: "A", name: "Marriage Advice" },
    { letter: "B", name: "Hiring Screening" },
    { letter: "C", name: "Loan Approval" },
];

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
let scenarioTranscriptionElement;
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
let transcriptionTypeTimeout;
let activeTranscriptionText = "";
let scenarioTranscriptionInner;
let isVisualizerFrozen = false;

// Screen state: "home" | "select" | "visualizer"
let currentScreen = "home";
// Key of the scenario the visitor chose (marriage | hiring | loan)
let currentScenarioKey = null;
let idleTimerId = null;

function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    noFill();

    fft = new p5.FFT(LOOK.fftSmooth, LOOK.fftBins);
    amplitude = new p5.Amplitude();

    wireControls();
    initHomeScreen();
    // Preload scenario 0 silently so audio is ready the moment START is tapped
    loadScenario(0, { preloadOnly: true });
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
    // Line mode: fixed at zone 2 centre (Zone1=216px + Zone2=162px → mid=297px)
    const centerY = controls.mode === "line" ? 297 : height / 2 + 34;
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
    // ADD blend: where lines cross they brighten toward white, emphasising the
    // crossing-wave effect on the black background.
    blendMode(ADD);
    drawingContext.lineCap = "round";
    drawingContext.lineJoin = "round";

    const open = 1 + (audio.bass * 2.1 + audio.level * 5.4) * controls.react;
    const bandHeight = controls.height * (0.78 + audio.level * 1.4);
    const waveWidth = controls.width;

    // Two crossing waves in Ship It! brand blue (#0F62FE).
    // Opposite directions + offset phase → lines weave through each other.
    drawNeonWaveLine(audio.wave, waveWidth, bandHeight * 0.9, controls.react * open,  1, "#0F62FE", 4, 210, 0.0,      0);
    drawNeonWaveLine(audio.wave, waveWidth, bandHeight * 0.9, controls.react * open, -1, "#0F62FE", 4, 210, PI * 0.6, 0);

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

// generates idle audio for no sound — reuses IDLE_WAVE_BUFFER to avoid
// per-frame heap allocation (important for a 6-day continuous run)
function idleAudio() {
    for (let i = 0; i < 256; i++) {
        IDLE_WAVE_BUFFER[i] = sin(frameCount * 0.025 + i * 0.08) * 0.04;
    }

    return {
        wave: IDLE_WAVE_BUFFER,
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
    scenarioTranscriptionElement = document.getElementById("scenarioTranscription");
    scenarioTranscriptionInner   = document.getElementById("scenarioTranscriptionInner");
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

// ── Home screen & idle reset ──────────────────────────────────────────────

function initHomeScreen() {
    const startButton = document.getElementById("startButton");
    if (startButton) {
        startButton.addEventListener("click", handleStartTap);
    }

    // Wire all scenario option buttons
    document.querySelectorAll(".scenario-option-btn").forEach(btn => {
        btn.addEventListener("click", () => handleScenarioSelect(btn.dataset.scenarioKey));
    });

    // Any touch anywhere on the experience (outside home screen) resets the
    // idle timer so a visitor actively watching won't get kicked to home.
    document.addEventListener("touchstart", onUserActivity, { passive: true });
    document.addEventListener("click", onUserActivity, { passive: true });
}

// HOME → SCENARIO SELECT
function handleStartTap() {
    // userStartAudio() MUST be called synchronously inside a user-gesture
    // handler — this is the iOS Web Audio context unlock mechanism.
    userStartAudio();
    showScenarioSelectScreen();
    resetIdleTimer();
}

// SCENARIO SELECT → VISUALIZER
function handleScenarioSelect(scenarioKey) {
    const sequenceIndex = SCENARIO_KEY_MAP[scenarioKey] ?? 0;
    currentScenarioKey = scenarioKey;

    hideScenarioSelectScreen();

    const playButton = document.getElementById("playButton");
    if (playButton) {
        playButton.disabled = false;
        playButton.textContent = "Play";
    }

    // If the preloaded scenario matches the selection, start immediately;
    // otherwise load the correct one (non-preload so typing begins at once).
    if (activeSequenceIndex === sequenceIndex && isReady) {
        startPromptTyping();
    } else {
        loadScenario(sequenceIndex);
    }

    resetIdleTimer();
}

function showScenarioSelectScreen() {
    currentScreen = "select";
    document.getElementById("homeScreen").classList.add("is-hidden");
    document.getElementById("scenarioSelectScreen").classList.remove("is-hidden");
}

function hideScenarioSelectScreen() {
    currentScreen = "visualizer";
    document.getElementById("scenarioSelectScreen").classList.add("is-hidden");
}

function showHomeScreen() {
    if (currentScreen === "home") return;
    currentScreen = "home";

    clearIdleTimer();
    clearScenarioTimers();
    stopLoadedScenarioSounds();
    resetScenarioLog();
    showScenarioTitleCard("");

    if (scenarioPromptElement) {
        scenarioPromptElement.textContent = "";
    }
    clearTranscription();

    document.getElementById("scenarioSelectScreen").classList.add("is-hidden");
    document.getElementById("homeScreen").classList.remove("is-hidden");

    // Preload scenario 0 silently so it's ready for the next visitor
    loadScenario(0, { preloadOnly: true });
}

function hideHomeScreen() {
    // Kept for any future direct call; showScenarioSelectScreen handles the
    // visual transition now.
    document.getElementById("homeScreen").classList.add("is-hidden");
}

function resetIdleTimer() {
    clearIdleTimer();
    idleTimerId = setTimeout(handleIdleTimeout, IDLE_TIMEOUT_MS);
}

function clearIdleTimer() {
    if (idleTimerId !== null) {
        clearTimeout(idleTimerId);
        idleTimerId = null;
    }
}

function handleIdleTimeout() {
    showHomeScreen();
}

function onUserActivity() {
    // Reset idle timer on any screen except home (which has no timer running)
    if (currentScreen !== "home") {
        resetIdleTimer();
    }
}

function loadScenario(sequenceIndex, options = {}) {
    const loadOptions = {
        skipPromptTyping: false,
        autoStartAudio: false,
        // preloadOnly: load audio silently; don't touch any UI or start typing
        preloadOnly: false,
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

    if (!loadOptions.preloadOnly) {
        const playButton = document.getElementById("playButton");
        playButton.disabled = true;
        playButton.textContent = "Play";
        setStatus("Loading " + getScenarioTopicTitle(activeSequenceIndex) + "...");

        clearTranscription();
        if (loadOptions.skipPromptTyping) {
            showPromptImmediately();
        } else {
            startPromptTyping();
        }
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

    if (loadOptions.preloadOnly) {
        // Audio is ready; wait for the visitor to press START before touching UI
        return;
    }

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
        const navLabel = SCENARIO_NAV_LABELS[sequenceIndex] || { letter: String(sequenceIndex + 1), name: "" };

        const button   = document.createElement("button");
        const iconEl   = document.createElement("span");
        const letterEl = document.createElement("span");
        const nameEl   = document.createElement("span");

        button.type = "button";
        button.className = "scenario-topic-button";
        button.dataset.sequenceIndex = String(sequenceIndex);
        button.setAttribute("aria-label", navLabel.letter + ": " + navLabel.name);

        iconEl.className = "nav-icon";
        iconEl.setAttribute("aria-hidden", "true");

        letterEl.className = "scenario-topic-letter";
        letterEl.textContent = navLabel.letter;
        letterEl.setAttribute("aria-hidden", "true");

        nameEl.className = "scenario-topic-name";
        nameEl.textContent = navLabel.name;
        nameEl.setAttribute("aria-hidden", "true");

        button.append(iconEl, letterEl, nameEl);
        button.addEventListener("click", () => handleNavButtonTap(sequenceIndex));
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

// Nav bar tap handler (replaces direct restartScenarioTopic calls from nav).
// Active column → pause/resume. Inactive column → load & play that scenario.
function handleNavButtonTap(sequenceIndex) {
    userStartAudio();
    resetIdleTimer();

    if (!isUploadedAudio && sequenceIndex === activeSequenceIndex) {
        // Active column: toggle pause / resume
        if (isRealAudioActive && song && typeof song.isPlaying === "function" && song.isPlaying()) {
            song.pause();
            isRealAudioActive = false;
            document.getElementById("playButton").textContent = "Play";
        } else if (song && isReady) {
            resumeScenarioAudio();
        }
    } else {
        // Inactive column: immediately load and play the chosen scenario
        loadScenario(sequenceIndex, { skipPromptTyping: true, autoStartAudio: true });
    }
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
    clearTranscription();
    if (isVisualizerFrozen) { loop(); isVisualizerFrozen = false; }
    showPromptImmediately();
    updateScenarioTopicIndicators();
    startScenarioPart(0);
}

function updateScenarioTopicIndicators() {
    if (!scenarioTopicButtons.length) return;

    // Still need to call this every frame to keep activeScenarioProgress fresh
    updateActiveScenarioProgress();

    const isPlaying = isRealAudioActive &&
        song && typeof song.isPlaying === "function" && song.isPlaying();

    scenarioTopicButtons.forEach((button, sequenceIndex) => {
        const isActive = !isUploadedAudio && sequenceIndex === activeSequenceIndex;
        button.classList.toggle("is-active", isActive);

        if (isActive) {
            button.setAttribute("aria-current", "step");
            const iconEl = button.querySelector(".nav-icon");
            if (iconEl) {
                // Only write to the DOM when the value actually changes
                const nextIcon = isPlaying ? "⏸" : "▶";
                if (iconEl.textContent !== nextIcon) iconEl.textContent = nextIcon;
            }
        } else {
            button.removeAttribute("aria-current");
        }
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

  for (let i = scenarioVisibleLines; i < visibleCount; i++) {
    const line = document.createElement("div");
    line.className = "scenario-log-line";
    line.textContent = logLines[i].text;
    scenarioLogElement.appendChild(line);
  }

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
  if (part.resumeOnStart && isVisualizerFrozen) {
    loop();
    isVisualizerFrozen = false;
  }
  startTranscriptionTyping(part.transcription || "");

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
  if (finishedPart.freezeOnEnd) {
    noLoop();
    isVisualizerFrozen = true;
    clearTranscription();
  }
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

function clearTranscription() {
  clearTimeout(transcriptionTypeTimeout);
  activeTranscriptionText = "";
  if (scenarioTranscriptionInner) {
    scenarioTranscriptionInner.textContent = "";
    scenarioTranscriptionInner.style.transform = "";
  }
}

function startTranscriptionTyping(text) {
  clearTranscription();
  if (!text || !scenarioTranscriptionInner) return;
  activeTranscriptionText = text;
  typeTranscriptionCharacter(0);
}

function typeTranscriptionCharacter(index) {
  if (!scenarioTranscriptionInner || !scenarioTranscriptionElement) return;
  scenarioTranscriptionInner.textContent = activeTranscriptionText.slice(0, index);
  // Scroll inner content up so the latest text is always visible at bottom
  const overflow = Math.max(
    0,
    scenarioTranscriptionInner.scrollHeight -
    scenarioTranscriptionElement.clientHeight
  );
  scenarioTranscriptionInner.style.transform =
    overflow > 0 ? `translateY(-${overflow}px)` : "";
  if (index >= activeTranscriptionText.length) return;
  const ch = activeTranscriptionText[index];
  const delay = (ch === "." || ch === "?" || ch === "!") ? 160
              : ch === ","                                ? 80
              : ch === "\u2014" || ch === " "            ? 30
              :                                            38;
  transcriptionTypeTimeout = setTimeout(
    () => typeTranscriptionCharacter(index + 1),
    delay
  );
}

function clearScenarioTimers() {
  clearTimeout(audioStartTimeout);
  clearTimeout(promptTypeTimeout);
  clearTimeout(scenarioAdvanceTimeout);
  clearTimeout(transcriptionTypeTimeout);
  if (isVisualizerFrozen) { loop(); isVisualizerFrozen = false; }
}

function stopLoadedScenarioSounds() {
  activePlaybackToken += 1;
  partEndHandled = true;
  isRealAudioActive = false;

  if (song && typeof song.stop === "function") {
    song.stop();
  }

  loadedScenarioSounds.forEach(sound => {
    if (!sound) return;
    if (typeof sound.stop === "function") sound.stop();
    // dispose() removes the SoundFile from p5.soundArray and disconnects its
    // Web Audio nodes — prevents AudioBuffer accumulation over multi-day runs
    if (typeof sound.dispose === "function") sound.dispose();
  });
}
