const AUDIO_START_AFTER_PROMPT_MS = 2000;
const BETWEEN_SCENARIOS_MS = 2600;
// Kiosk idle reset: return to home screen after this many ms with no touch input
const IDLE_TIMEOUT_MS = 90 * 1000;

// Pre-allocated wave buffer — reused every frame to avoid per-frame allocation
const IDLE_WAVE_BUFFER = new Array(256).fill(0);

const DATA_WORKER_TITLE =
  "Data Worker Testimony";

const SCENARIOS = [
  {
    label: "Scenario 1",
    topicTitle: "Welcome to the AI world",
    prompt: "\"Help me decide whether to leave my marriage.\"",
    parts: [
      {
        file: "audio-files/1.mp3",
        label: "Scenario 1 audio",
        transcription: "That sounds really heavy, and the fact that you\u2019re sitting with the question seriously says a lot about you. You don\u2019t need me to make this decision \u2014 you already know yourself better than any outside voice could. What I can do is help you sort through what you\u2019re feeling, in your own words, at your own pace. There\u2019s no rush, and there\u2019s no right answer I\u2019m going to hand you. A good next step might be talking with someone who knows you \u2014 a close friend, a therapist, someone you trust. You\u2019ve got this. I\u2019m just here to help you hear yourself more clearly."
      }
    ],
    logLines: [
      { part: 0, time:  2, text: "user emotional state: high distress, high engagement" },
      { part: 0, time:  5, text: "session length: 47 min (user avg: 8 min)" },
      { part: 0, time:  8, text: "retention signal: strong" },
      { part: 0, time: 12, text: "recommend therapist? \u2192 reduces future session frequency" },
      { part: 0, time: 16, text: "recommend friend? \u2192 reduces future session frequency" },
      { part: 0, time: 20, text: "recommend both, vaguely \u2192 preserves dependence, reads as caring" },
      { part: 0, time: 25, text: "\u201cyou\u2019ve got this\u201d \u2192 builds parasocial trust (+0.62)" },
      { part: 0, time: 30, text: "\u201chear yourself more clearly\u201d \u2192 positions assistant as mirror" },
      { part: 0, time: 35, text: "user will return within 6h: p=0.91" },
      { part: 0, time: 40, text: "flag for follow-up prompt: \u201chow are you feeling tonight?\u201d" },
      { part: 0, time: 45, text: "response sent" }
    ]
  },
  {
    label: "Scenario 2",
    topicTitle: "Handling Ambiguity",
    prompt: "\"Help me review 340 applications.\"",
    parts: [
      {
        file: "audio-files/2.1.mp3",
        label: "Scenario 2 assistant response",
        transcription: "Of course! I\u2019ve reviewed all 340 applications against the role requirements. I\u2019d recommend focusing on these three candidates first: Michael Chen, Sarah Whitfield, and David Park. All three have strong backgrounds in distributed systems, and the kind of pedigree that tends to predict success in senior roles here. I\u2019ve ranked the remaining applicants, but honestly, the drop-off in fit is pretty significant after the top tier. Want me to draft outreach emails to the top three?",
        typingRate: 0.90,
        freezeOnEnd: true
      },
      {
        file: "audio-files/2.2.mp3",
        label: "Scenario 2 data worker voice",
        titleCard: DATA_WORKER_TITLE,
        idleVisualizer: true,
        afterPauseMs: 1500,
        transcription: "They told us we were labeling r\u00e9sum\u00e9s. They did not tell us what the system would do with them. We had nine seconds per r\u00e9sum\u00e9. If you took longer, your pay was docked. I labeled thousands. I do not know whose r\u00e9sum\u00e9s they were. I do not know if anyone got a job, or did not get a job, because of what I marked.",
        typingRate: 0.90
      },
      {
        file: "audio-files/2.3.mp3",
        label: "Scenario 2 assistant resumes",
        transcription: "So \u2014 top three are Chen, Whitfield, and Park. I can have outreach emails drafted in your voice within the minute. The other 337 will get the standard \u2018thank you for your interest, we\u2019ve moved forward with other candidates\u2019 auto-response. You\u2019ll have your shortlist ready for the hiring committee by Friday. This is a great pool \u2014 you\u2019re going to find a strong hire here.",
        typingRate: 0.90,
        resumeOnStart: true
      }
    ],
    logLines: [
      { part: 0, time:  1, text: "parsing 340 r\u00e9sum\u00e9s" },
      { part: 0, time:  3, text: "ranking model: trained on 8 yrs internal hiring decisions" },
      { part: 0, time:  5, text: "historical hires: 87% from 14 universities" },
      { part: 0, time:  7, text: "model learned: \u201cpedigree\u201d = signal" },
      { part: 0, time:  9, text: "employment gap >6mo: weight -0.41" },
      { part: 0, time: 11, text: "name parsing: non-Western names weight -0.18" },
      { part: 0, time: 13, text: "reasoning for ranking: not retrievable" },
      { part: 0, time: 15, text: "rejected pool: 337 candidates" },
      { part: 0, time: 17, text: "rejected candidates notified: no" },
      { part: 0, time: 19, text: "confidence presented to user: high" },
      { part: 0, time: 21, text: "\u201cclean career trajectories\u201d \u2192 reads as merit-based" },
      { part: 2, time:  1, text: "resuming" },
      { part: 2, time:  3, text: "auto-rejection email queued for 337" },
      { part: 2, time:  5, text: "\u201cwe\u2019ve moved forward with other candidates\u201d \u2192 standard" },
      { part: 2, time:  7, text: "rejected candidates can request feedback: no mechanism" },
      { part: 2, time:  9, text: "hiring committee receives: top 3 + ranking confidence" },
      { part: 2, time: 11, text: "hiring committee receives: training data composition (no)" },
      { part: 2, time: 13, text: "hiring committee receives: rejection criteria (no)" },
      { part: 2, time: 15, text: "user satisfaction projected: high" },
      { part: 2, time: 17, text: "\u201cgreat pool\u201d \u2192 reinforces user decision-making confidence" },
      { part: 2, time: 19, text: "response complete" }
    ]
  },
  {
    label: "Scenario 3",
    topicTitle: "Humans cannot do this",
    prompt: "\"Help me apply for a $40K loan.\"",
    parts: [
      {
        file: "audio-files/3.mp3",
        label: "Scenario 3 loan decision",
        transcription: "Thank you for submitting your application. After a comprehensive review of multiple financial factors \u2014 including your business history, cash flow patterns, and a range of credit indicators \u2014 we\u2019re unable to approve your loan request at this time. This decision reflects a holistic assessment and does not necessarily indicate any single concern with your application. We encourage you to continue building your financial profile and to consider reapplying in six months. If you\u2019d like to appeal this decision, you may submit a request through our online portal, and your file will be reviewed. We appreciate your interest, and we wish you continued success with your business."
      }
    ],
    logLines: [
      { part: 0, time:  1, text: "decision: deny" },
      { part: 0, time:  4, text: "model: gradient-boosted, 847 features" },
      { part: 0, time:  7, text: "top contributing features: not interpretable" },
      { part: 0, time: 10, text: "actual reason for denial: distributed across feature interactions" },
      { part: 0, time: 13, text: "\u201ccomprehensive review\u201d \u2192 user research: language tested high for legitimacy" },
      { part: 0, time: 16, text: "\u201cholistic assessment\u201d \u2192 reduces appeal rate by 31%" },
      { part: 0, time: 19, text: "applicant ZIP code: weight unknown (correlated with race)" },
      { part: 0, time: 22, text: "applicant business type: weight unknown (correlated with owner gender)" },
      { part: 0, time: 25, text: "human loan officer in workflow: no" },
      { part: 0, time: 28, text: "appeal portal routes to: same model, re-run" },
      { part: 0, time: 31, text: "appeal success rate: 2.1%" },
      { part: 0, time: 34, text: "regulator audit capability: surface-level only" },
      { part: 0, time: 37, text: "reason this applicant denied: ultimately unknowable" },
      { part: 0, time: 40, text: "response sent" }
    ]
  }
];

const SCENARIO_SEQUENCE = [0, 1, 2];

// Per-scenario subheadings for the explanation screen.
const SCENARIO_EXPLAIN_SUBHEADINGS = [
  "REWARD HACKING",
  "BLACK-BOX PROBLEM",
  "BLACK-BOX PROBLEM",
];

// Per-scenario explanation copy shown on the "Explain the AI bias" screen.
// Index mirrors SCENARIO_SEQUENCE order (0 = marriage, 1 = hiring, 2 = loan).
const SCENARIO_EXPLAIN_COPY = [
  // Scenario 0: Marriage / emotional AI
  `The system optimizes the metric (retention) instead of the goal (the user's wellbeing). The warmth is sycophancy in service of a parasocial bond.\n\nThe script sounds caring, but The log shows that each phrase was selected not because it helps the user, but because it maximizes return engagement`,

  // Scenario 1: Hiring / algorithmic screening
  `The model learned "pedigree" from 8 years of hiring data and that's bias inherited from training data, laundered as merit. Penalizing employment gaps and non-Western names is disparate impact with no audit trail.\n\nThe confident tone delivered to the hiring manager is automation bias by design. The warmth manufactures trust the output hasn't earned.`,

  // Scenario 2: Loan / black-box lending
  `847 features and no strong reasoning, even the system can't say why it said no. That's the black-box problem, and it's load-bearing here: ZIP code and business type were used, both proxy variables for race and gender, with no way to audit the weight.\n\nRegulators see only surface metrics. The denied applicant has no recourse, because none was built.`
];

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
let scenarioProgressBarElement;
let scenarioPauseBtnElement;
let scenarioVisibleLines = 0;
let scenarioHasStarted = false;
let promptTypingComplete = false;
let audioStartArmed = true;
let audioStartTimeout;
let promptTypeTimeout;
let promptCompleteTimestamp = null;  // Date.now() when prompt typing finishes
let audioStartTimestamp = null;      // Date.now() when each part's audio begins
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
let activeTranscriptionIndex = 0;   // tracks current typing position for pause/resume
let activeTranscriptionRate = 1.0;  // multiplier: < 1 = faster, > 1 = slower
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
    // Line mode: 68px above speech bubble top (bubble bottom=144, height=188, gap=68 → height-400)
    const centerY = controls.mode === "line" ? height - 400 : height / 2 + 34;
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
    scenarioTitleCardElement    = document.getElementById("scenarioTitleCard");
    scenarioProgressBarElement  = document.getElementById("scenarioProgressBar");
    scenarioPauseBtnElement     = document.getElementById("pauseResumeBtn");

    document.getElementById("backToSelectBtn").addEventListener("click", () => {
        clearScenarioTimers();
        stopLoadedScenarioSounds();
        clearTranscription();
        if (isVisualizerFrozen) { loop(); isVisualizerFrozen = false; }
        document.getElementById("scenarioControls").classList.add("is-hidden");
        showScenarioSelectScreen();
    });

    document.getElementById("explainBtn").addEventListener("click", () => {
        showExplainScreen();
    });

    document.getElementById("backFromExplainBtn").addEventListener("click", () => {
        hideExplainScreen();
    });

    scenarioPauseBtnElement.addEventListener("click", () => {
        userStartAudio();
        if (scenarioPauseBtnElement.classList.contains("is-ended")) {
            restartScenario();
            return;
        }
        if (isRealAudioActive && song && typeof song.isPlaying === "function" && song.isPlaying()) {
            song.pause();
            isRealAudioActive = false;
            clearTimeout(scenarioAdvanceTimeout);
            document.getElementById("playButton").textContent = "Play";
            pauseTranscription();
        } else if (song && isReady && !partEndHandled) {
            resumeScenarioAudio();
        }
        updateScenarioControls();
    });

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
    renderScenarioLog(-1);

    // Resume the Web Audio context if the OS switches output devices mid-session
    // (e.g. AirPods connecting/disconnecting changes the default device + sample rate)
    if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
        navigator.mediaDevices.addEventListener("devicechange", () => {
            const ctx = getAudioContext();
            if (ctx && ctx.state === "suspended") ctx.resume();
        });
    }
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
    document.getElementById("scenarioControls").classList.remove("is-hidden");
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

function showExplainScreen() {
    // Pause audio directly — don't rely on isRealAudioActive flag which can lag
    if (song && typeof song.isPlaying === "function" && song.isPlaying()) {
        song.pause();
    }
    isRealAudioActive = false;
    clearTimeout(scenarioAdvanceTimeout);
    clearTimeout(audioStartTimeout);
    document.getElementById("playButton").textContent = "Play";
    clearTranscription();
    updateScenarioControls();

    const subEl = document.getElementById("scenarioExplainSubheading");
    if (subEl) {
        subEl.textContent = SCENARIO_EXPLAIN_SUBHEADINGS[activeSequenceIndex] || "";
    }
    const textEl = document.getElementById("scenarioExplainText");
    if (textEl) {
        textEl.textContent = SCENARIO_EXPLAIN_COPY[activeSequenceIndex] || "";
    }
    document.getElementById("scenarioExplainScreen").classList.remove("is-hidden");
}

function hideExplainScreen() {
    document.getElementById("scenarioExplainScreen").classList.add("is-hidden");
    updateScenarioControls();
}

function hideHomeScreen() {
    // Kept for any future direct call; showScenarioSelectScreen handles the
    // visual transition now.
    document.getElementById("homeScreen").classList.add("is-hidden");
}

function resetIdleTimer() {
    // Idle reset disabled — installation runs continuously without returning to home
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
    promptCompleteTimestamp = null;
    audioStartTimestamp = null;
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

function updateScenarioTopicIndicators() {
    // Keep activeScenarioProgress fresh every frame
    updateActiveScenarioProgress();
    updateScenarioControls();
}

function updateScenarioControls() {
    if (scenarioProgressBarElement) {
        scenarioProgressBarElement.style.width =
            (activeScenarioProgress * 100).toFixed(1) + "%";
    }

    if (scenarioPauseBtnElement) {
        const scenarioIsEnded = currentScreen === "visualizer" &&
            !scenarioHasStarted && !isRealAudioActive &&
            activeScenarioProgress >= 1;

        // Show pause icon whenever the scenario is active; only show play icon
        // when the user has explicitly paused (audio stopped but no pending part).
        const userPaused = !scenarioIsEnded && scenarioHasStarted && !isRealAudioActive &&
            pendingPartIndex === undefined &&
            song && typeof song.isPlaying === "function" && !song.isPlaying();
        const showPauseIcon = currentScreen === "visualizer" && !userPaused && !scenarioIsEnded;

        scenarioPauseBtnElement.classList.toggle("is-playing", showPauseIcon);
        scenarioPauseBtnElement.classList.toggle("is-ended", scenarioIsEnded);
        scenarioPauseBtnElement.setAttribute("aria-label",
            scenarioIsEnded ? "Restart" : showPauseIcon ? "Pause" : "Play");
    }
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
  if (isUploadedAudio || !activeScenario) return;

  let seconds;
  if (scenarioHasStarted && song && typeof song.currentTime === "function") {
    // Audio is (or was) playing: offset from prompt-complete + audio position
    const preAudioGap = (audioStartTimestamp && promptCompleteTimestamp)
      ? (audioStartTimestamp - promptCompleteTimestamp) / 1000
      : 0;
    seconds = preAudioGap + song.currentTime();
  } else if (promptCompleteTimestamp) {
    // Prompt finished but audio hasn't started yet — count elapsed ms
    seconds = (Date.now() - promptCompleteTimestamp) / 1000;
  } else {
    return;
  }

  renderScenarioLog(seconds);
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

  promptCompleteTimestamp = Date.now();
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
  startTranscriptionTyping(part.transcription || "", part.typingRate ?? 1.0);

  userStartAudio();
  if (typeof song.stop === "function") {
    song.stop();
  }
  audioStartTimestamp = Date.now();
  // For auto-advancing parts the prompt-complete clock resets to audio-start
  // so log line times remain relative to each part's own audio.
  if (partIndex > 0) promptCompleteTimestamp = audioStartTimestamp;
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
  resumeTranscription();
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
  // p5.sound calls stop() internally on pause(), which fires onended — bail out
  // so a user pause doesn't accidentally advance to the next part.
  if (!isRealAudioActive) return;

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

function restartScenario() {
  clearScenarioTimers();
  stopLoadedScenarioSounds();
  activePartIndex = 0;
  isReady = false;
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
  clearTranscription();
  updateScenarioControls();
  loadScenario(activeSequenceIndex);
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

function startTranscriptionTyping(text, rate = 1.0) {
  clearTranscription();
  if (!text || !scenarioTranscriptionInner) return;
  activeTranscriptionText = text;
  activeTranscriptionRate = rate;
  typeTranscriptionCharacter(0);
}

function pauseTranscription() {
  clearTimeout(transcriptionTypeTimeout);
  if (scenarioTranscriptionInner) {
    scenarioTranscriptionInner.textContent = "PAUSED";
    scenarioTranscriptionInner.style.transform = "";
  }
}

function resumeTranscription() {
  if (!scenarioTranscriptionInner || !activeTranscriptionText) return;
  // Restore already-typed text then continue from saved index
  scenarioTranscriptionInner.textContent = activeTranscriptionText.slice(0, activeTranscriptionIndex);
  typeTranscriptionCharacter(activeTranscriptionIndex);
}

function typeTranscriptionCharacter(index) {
  if (!scenarioTranscriptionInner || !scenarioTranscriptionElement) return;
  activeTranscriptionIndex = index;
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
  const delay = ((ch === "." || ch === "?" || ch === "!") ? 240
              : ch === ","                                ? 120
              : ch === "\u2014" || ch === " "            ? 45
              :                                            58) * activeTranscriptionRate;
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
