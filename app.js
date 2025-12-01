const refs = {
  field: document.getElementById("field"),
  spawn: document.getElementById("spawn"),
  auto: document.getElementById("auto"),
  audio: document.getElementById("audio"),
  clear: document.getElementById("clear"),
  bpm: document.getElementById("bpm"),
  bpmReadout: document.getElementById("bpm-readout"),
  pulseCount: document.getElementById("pulse-count"),
  hypeValue: document.getElementById("hype-value"),
  hypeBar: document.getElementById("hype-bar"),
  streakValue: document.getElementById("streak-value"),
  streakBar: document.getElementById("streak-bar"),
  laneCount: document.getElementById("lane-count"),
  melodyBar: document.getElementById("melody-bar"),
  modeLabel: document.getElementById("mode-label"),
  auroraState: document.getElementById("aurora-state"),
  feedList: document.getElementById("feed-list"),
  questList: document.getElementById("quest-list"),
  shuffleBeats: document.getElementById("shuffle-beats"),
  template: document.getElementById("pulse-template"),
  kitButtons: Array.from(document.querySelectorAll("[data-kit]")),
  fx: {
    reverb: document.getElementById("fx-reverb"),
    delay: document.getElementById("fx-delay"),
    crush: document.getElementById("fx-crush")
  },
  poly: document.getElementById("poly"),
  polyReadout: document.getElementById("poly-readout"),
  glitch: document.getElementById("glitch"),
  glitchReadout: document.getElementById("glitch-readout"),
  swing: document.getElementById("swing"),
  swingReadout: document.getElementById("swing-readout"),
  humanize: document.getElementById("humanize"),
  humanizeReadout: document.getElementById("humanize-readout"),
  drop: document.getElementById("drop"),
  addLane: document.getElementById("add-lane"),
  randomizeLanes: document.getElementById("randomize-lanes"),
  laneList: document.getElementById("lane-list"),
  laneEmpty: document.getElementById("lane-empty")
};

const kits = {
  synthwave: {
    label: "Synthwave",
    palette: ["#63f6c5", "#ff8dd6", "#7aa0ff"],
    pulseNotes: [196, 220, 246.94, 261.63, 293.66, 329.63, 349.23, 392],
    melodyRoots: [220, 246.94, 261.63, 293.66],
    scales: [
      { name: "Escala Solar", steps: [0, 2, 5, 7, 9] },
      { name: "Neon Hex", steps: [0, 3, 7, 10] }
    ],
    waves: ["sawtooth", "triangle"],
    melodyWave: "triangle"
  },
  jungle: {
    label: "Jungle Nebulosa",
    palette: ["#8ef45c", "#ffd85c", "#4bffb5"],
    pulseNotes: [164.81, 185, 207.65, 233.08, 261.63, 293.66],
    melodyRoots: [174.61, 196, 220],
    scales: [
      { name: "Tribo Liquid", steps: [0, 3, 5, 7, 10] },
      { name: "Bass Runner", steps: [0, 5, 7, 12] }
    ],
    waves: ["square", "sawtooth"],
    melodyWave: "square"
  },
  hyperpop: {
    label: "Hyperpop Prisma",
    palette: ["#ff71f7", "#80f9ff", "#ffd84d"],
    pulseNotes: [246.94, 261.63, 293.66, 329.63, 369.99, 415.3, 466.16],
    melodyRoots: [261.63, 293.66, 329.63, 392],
    scales: [
      { name: "Pixel Dream", steps: [0, 4, 7, 11] },
      { name: "Candy Run", steps: [0, 2, 4, 5, 7, 9] }
    ],
    waves: ["triangle", "sine"],
    melodyWave: "sine"
  }
};

const questConfig = [
  {
    id: "grow",
    label: "Germine 10 pulsos",
    goal: 10,
    metric: () => state.stats.totalSeeds
  },
  {
    id: "combo",
    label: "Dispare 4 combos",
    goal: 4,
    metric: () => state.stats.combos
  },
  {
    id: "melody",
    label: "Mantenha 3 melodias ativas",
    goal: 3,
    metric: () => state.lanes.length
  },
  {
    id: "drop",
    label: "Lance 1 drop",
    goal: 1,
    metric: () => state.stats.drops
  },
  {
    id: "aurora",
    label: "Provoque 1 tempestade Aurora",
    goal: 1,
    metric: () => state.stats.storms
  }
];

const state = {
  pulses: [],
  bpm: 96,
  beat: 0,
  melodyStep: 0,
  polyrhythm: 16,
  glitch: 5,
  swing: 0,
  humanize: 8,
  kit: "synthwave",
  fx: { reverb: false, delay: false, crush: false },
  lanes: [],
  beatTimer: null,
  autoLoop: null,
  events: {
    aurora: { active: false, remaining: 0, cooldown: 0 }
  },
  stats: {
    hype: 0,
    streak: 0,
    combos: 0,
    totalSeeds: 0,
    autoSeconds: 0,
    melodyScore: 0,
    drops: 0,
    storms: 0
  },
  feed: []
};

const audio = {
  ctx: null,
  master: null
};

const FEED_LIMIT = 6;
const MAX_PULSES = 44;
const MAX_LANES = 4;

init();

function init() {
  wireEvents();
  initAether();
  startAnimation();
  restartBeatTimer();
  startStreakDecay();
  renderQuests();
  setKit(state.kit);
  setPolyrhythm(state.polyrhythm);
  setGlitch(state.glitch);
  setSwing(state.swing);
  setHumanize(state.humanize);
  addLane();
  addLane();
  pushFeed("Abra o palco, escolha um kit e comece o beat garden.");
}

function wireEvents() {
  refs.spawn.addEventListener("click", () => spawnPulse());
  refs.clear.addEventListener("click", clearStage);
  refs.auto.addEventListener("click", toggleAuto);
  refs.audio.addEventListener("click", activateAudio);
  refs.drop.addEventListener("click", triggerDrop);
  refs.addLane.addEventListener("click", addLane);
  refs.randomizeLanes.addEventListener("click", randomizeLanes);
  refs.laneList.addEventListener("click", handleLaneInteraction);

  refs.bpm.addEventListener("input", (event) => {
    state.bpm = Number(event.target.value);
    refs.bpmReadout.textContent = `${state.bpm} BPM`;
    restartBeatTimer();
  });

  refs.poly.addEventListener("input", (event) => setPolyrhythm(Number(event.target.value)));
  refs.glitch.addEventListener("input", (event) => setGlitch(Number(event.target.value)));
  refs.swing.addEventListener("input", (event) => setSwing(Number(event.target.value)));
  refs.humanize.addEventListener("input", (event) => setHumanize(Number(event.target.value)));

  refs.field.addEventListener("click", (event) => {
    if (event.target !== refs.field) return;
    const rect = refs.field.getBoundingClientRect();
    spawnPulse({
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height
    });
  });

  refs.shuffleBeats.addEventListener("click", () => {
    state.pulses.forEach((pulse) => {
      pulse.beatStep = Math.floor(Math.random() * 8);
      updatePulseLabel(pulse);
    });
    pushFeed("Todas as etapas foram remixadas.");
  });

  refs.kitButtons.forEach((button) => {
    button.addEventListener("click", () => setKit(button.dataset.kit));
  });

  Object.entries(refs.fx).forEach(([name, input]) => {
    input.addEventListener("change", () => toggleFx(name, input.checked));
  });

  window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      spawnPulse();
    }
  });
}

function activateAudio() {
  ensureAudio();
  if (audio.ctx) {
    refs.audio.dataset.state = "active";
    refs.audio.textContent = "Áudio ativo";
  }
}

function setKit(kitName) {
  if (!kits[kitName]) return;
  state.kit = kitName;
  const kit = kits[kitName];
  applyPalette(kit.palette);
  refs.kitButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.kit === kitName);
  });

  state.pulses.forEach((pulse) => {
    pulse.wave = randomItem(kit.waves);
    pulse.freq = randomItem(kit.pulseNotes) * randomBetween(0.9, 1.18);
    updatePulseVisual(pulse, kit);
  });

  state.lanes.forEach((lane, index) => {
    const data = buildLaneNotes(kit, state.polyrhythm);
    lane.notes = data.notes;
    lane.scaleName = data.scaleName;
    lane.wave = kit.melodyWave;
    lane.name = `Melodia ${index + 1}`;
  });
  renderLanes();
  pushFeed(`Kit ${kit.label} ativado.`);
}

function applyPalette(palette) {
  const root = document.documentElement;
  root.style.setProperty("--accent", palette[0]);
  root.style.setProperty("--accent-2", palette[1]);
  root.style.setProperty("--accent-3", palette[2]);
}

function toggleFx(name, active) {
  state.fx[name] = active;
  pushFeed(`${name.toUpperCase()} ${active ? "ligado" : "desligado"}.`);
}

function setPolyrhythm(value) {
  state.polyrhythm = value;
  refs.poly.value = String(value);
  refs.polyReadout.textContent = `${value} passos`;
  state.lanes.forEach((lane) => resizeLanePattern(lane, value));
  renderLanes();
}

function setGlitch(value) {
  state.glitch = value;
  refs.glitch.value = String(value);
  refs.glitchReadout.textContent = `${value}%`;
}

function setSwing(value) {
  state.swing = value;
  refs.swing.value = String(value);
  refs.swingReadout.textContent = `${value.toString().padStart(2, "0")}%`;
}

function setHumanize(value) {
  state.humanize = value;
  refs.humanize.value = String(value);
  refs.humanizeReadout.textContent = `${value.toString().padStart(2, "0")}%`;
}

function spawnPulse(pos = {}) {
  ensureAudio();
  const pulse = createPulse(pos);
  refs.field.appendChild(pulse.node);
  state.pulses.push(pulse);
  if (state.pulses.length > MAX_PULSES) {
    const removed = state.pulses.shift();
    removed.node.remove();
  }
  state.stats.totalSeeds += 1;
  bumpStreak(6);
  incrementHype(2);
  updateStatsUI();
  renderQuests();
  pushFeed(`Pulso ${pulse.id} assumiu a etapa ${pulse.beatStep + 1} (${kits[state.kit].label}).`);
}

function createPulse(pos = {}) {
  const kit = kits[state.kit];
  const hue = Math.floor(Math.random() * 360);
  const beatStep = Math.floor(Math.random() * 8);
  const pulse = {
    id: generateId(),
    hue,
    beatStep,
    freq: randomItem(kit.pulseNotes) * randomBetween(0.9, 1.18),
    wave: randomItem(kit.waves),
    x: pos.x ?? Math.random(),
    y: pos.y ?? Math.random(),
    vx: randomBetween(-0.04, 0.04),
    vy: randomBetween(-0.04, 0.04),
    size: randomBetween(0.8, 1.25),
    dragging: false,
    node: refs.template.content.firstElementChild.cloneNode(true)
  };

  updatePulseVisual(pulse, kit);
  pulse.node.setAttribute(
    "aria-label",
    `Pulso ${pulse.id} na etapa ${pulse.beatStep + 1}`
  );
  pulse.node.addEventListener("click", (event) => {
    event.stopPropagation();
    bumpStreak(4);
    incrementHype(1);
    state.stats.melodyScore = clamp(state.stats.melodyScore + 2, 0, 150);
    updateStatsUI();
    pushFeed(`Você remixou ${pulse.id}; etapa ${pulse.beatStep + 1}.`);
  });

  enableDragging(pulse);
  return pulse;
}

function updatePulseVisual(pulse, kit) {
  const colors = kit?.palette ?? kits[state.kit].palette;
  const core = pulse.node.querySelector(".pulse-core");
  const ring = pulse.node.querySelector(".pulse-ring");
  core.style.background = `radial-gradient(circle, #fff, ${colors[0]})`;
  core.style.boxShadow = `0 0 24px ${colors[1]}55`;
  ring.style.background = `radial-gradient(circle, ${colors[2]}55, transparent 70%)`;
  updatePulseLabel(pulse);
}

function updatePulseLabel(pulse) {
  const label = pulse.node.querySelector(".pulse-label");
  label.textContent = `E${pulse.beatStep + 1}`;
}

function enableDragging(pulse) {
  const node = pulse.node;
  node.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    ensureAudio();
    node.setPointerCapture(event.pointerId);
    pulse.dragging = true;
    updateCoordsFromPointer(event, pulse);
  });
  node.addEventListener("pointermove", (event) => {
    if (!pulse.dragging) return;
    updateCoordsFromPointer(event, pulse);
  });
  node.addEventListener("pointerup", (event) => {
    if (node.hasPointerCapture(event.pointerId)) {
      node.releasePointerCapture(event.pointerId);
    }
    pulse.dragging = false;
  });
  node.addEventListener("pointercancel", () => {
    pulse.dragging = false;
  });
}

function updateCoordsFromPointer(event, pulse) {
  const rect = refs.field.getBoundingClientRect();
  pulse.x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
  pulse.y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
}

function startAnimation() {
  const loop = () => {
    const width = refs.field.clientWidth || 1;
    const height = refs.field.clientHeight || 1;
    state.pulses.forEach((pulse) => {
      if (!pulse.dragging) {
        pulse.x = wrap(pulse.x + pulse.vx * 0.5, 0, 1);
        pulse.y = wrap(pulse.y + pulse.vy * 0.5, 0, 1);
      }
      const x = pulse.x * width;
      const y = pulse.y * height;
      pulse.node.style.transform = `translate(${x}px, ${y}px) scale(${pulse.size})`;
    });
    requestAnimationFrame(loop);
  };
  loop();
}

function restartBeatTimer() {
  if (state.beatTimer) clearInterval(state.beatTimer);
  const interval = ((60 / state.bpm) * 1000) / 2;
  state.beatTimer = setInterval(() => stepBeat(interval), interval);
}

function stepBeat(intervalMs) {
  state.beat = (state.beat + 1) % 8;
  state.melodyStep = (state.melodyStep + 1) % state.polyrhythm;
  const active = [];
  const swingPhase = state.beat % 2 ? "late" : null;
  state.pulses.forEach((pulse) => {
    const hit = pulse.beatStep === state.beat;
    pulse.node.classList.toggle("is-hot", hit);
    if (hit) {
      active.push(pulse);
      playNote({ freq: pulse.freq, wave: pulse.wave, feel: { swingPhase, humanize: true } });
    }
  });
  if (active.length >= 3) {
    registerCombo(active.length);
  }
  triggerMelodyStep();
  maybeGlitch();
  handleAuroraBeat();
  if (state.autoLoop) {
    state.stats.autoSeconds += intervalMs / 1000;
  }
  updateStatsUI();
  renderQuests();
}

function triggerMelodyStep() {
  if (!state.lanes.length) return;
  let hits = 0;
  const kit = kits[state.kit];
  const swingPhase = state.melodyStep % 2 ? "late" : null;
  state.lanes.forEach((lane) => {
    if (!lane.pattern[state.melodyStep]) return;
    hits += 1;
    const freq = lane.notes[state.melodyStep];
    playNote({
      freq,
      wave: lane.wave || kit.melodyWave,
      gain: 0.2,
      duration: 0.45,
      feel: { swingPhase, humanize: true }
    });
  });
  if (hits) {
    state.stats.melodyScore = clamp(state.stats.melodyScore + hits * 3, 0, 150);
    updateStatsUI();
  }
}

function maybeGlitch() {
  if (Math.random() * 100 > state.glitch) return;
  if (!state.lanes.length || Math.random() > 0.5) {
    spawnPulse();
    pushFeed("Glitch liberou um pulso fantasma.");
    return;
  }
  const lane = randomItem(state.lanes);
  const index = Math.floor(Math.random() * state.polyrhythm);
  lane.pattern[index] = !lane.pattern[index];
  renderLanes();
  pushFeed(`Glitch remixou ${lane.name} passo ${index + 1}.`);
}

function handleAuroraBeat() {
  const aurora = state.events.aurora;
  if (aurora.active) {
    aurora.remaining -= 1;
    spawnPulse();
    if (!state.lanes.length) {
      addLane();
    } else {
      const lane = randomItem(state.lanes);
      igniteLaneStep(lane);
      renderLanes();
    }
    incrementHype(3);
    bumpStreak(2);
    state.stats.melodyScore = clamp(state.stats.melodyScore + 5, 0, 200);
    if (aurora.remaining <= 0) {
      endAuroraStorm();
    }
    return;
  }
  if (aurora.cooldown > 0) {
    aurora.cooldown = Math.max(0, aurora.cooldown - 1);
    if (aurora.cooldown > 0) return;
  }
  if (state.lanes.length && state.stats.hype >= 95 && state.stats.streak >= 60) {
    startAuroraStorm();
  }
}

function startAuroraStorm() {
  const aurora = state.events.aurora;
  aurora.active = true;
  aurora.remaining = 12;
  aurora.cooldown = 0;
  state.stats.storms += 1;
  pushFeed("Tempestade Aurora abriu um portal harmônico!");
  if (!state.lanes.length) {
    addLane();
  }
  state.stats.melodyScore = clamp(state.stats.melodyScore + 15, 0, 200);
  renderQuests();
  updateStatsUI();
}

function endAuroraStorm() {
  const aurora = state.events.aurora;
  aurora.active = false;
  aurora.cooldown = 24;
  pushFeed("Aurora se dissipou, resta só o brilho.");
}

function registerCombo(size) {
  state.stats.combos += 1;
  incrementHype(6 + size);
  bumpStreak(6);
  pushFeed(`Combo ${size}x na etapa ${state.beat + 1}!`);
}

function toggleAuto() {
  if (state.autoLoop) {
    clearInterval(state.autoLoop);
    state.autoLoop = null;
    refs.auto.setAttribute("aria-pressed", "false");
  } else {
    state.autoLoop = setInterval(() => {
      if (Math.random() > 0.35) spawnPulse();
      if (state.lanes.length && Math.random() > 0.5) {
        const lane = randomItem(state.lanes);
        const index = Math.floor(Math.random() * state.polyrhythm);
        lane.pattern[index] = !lane.pattern[index];
        renderLanes();
      }
    }, 3200);
    refs.auto.setAttribute("aria-pressed", "true");
  }
  updateStatsUI();
}

function clearStage() {
  state.pulses.forEach((pulse) => pulse.node.remove());
  state.pulses = [];
  state.stats.hype = 0;
  state.stats.streak = 0;
  updateStatsUI();
  pushFeed("Palco resetado. Recomece a sessão.");
}

function triggerDrop() {
  ensureAudio();
  for (let i = 0; i < 3; i += 1) {
    spawnPulse();
  }
  randomizeLanes();
  incrementHype(25);
  bumpStreak(18);
  state.stats.melodyScore = clamp(state.stats.melodyScore + 25, 0, 180);
  state.stats.drops += 1;
  state.events.aurora.cooldown = Math.max(0, state.events.aurora.cooldown - 6);
  updateStatsUI();
  renderQuests();
  pushFeed("DROP lançado! Hype e melodias explodiram.");
}

function incrementHype(amount) {
  state.stats.hype = clamp(state.stats.hype + amount, 0, 130);
}

function bumpStreak(amount) {
  state.stats.streak = clamp(state.stats.streak + amount, 0, 100);
}

function startStreakDecay() {
  setInterval(() => {
    state.stats.streak = Math.max(0, state.stats.streak - 1);
    state.stats.melodyScore = Math.max(0, state.stats.melodyScore - 0.5);
    updateStatsUI();
  }, 1200);
}

function updateStatsUI() {
  refs.pulseCount.textContent = state.pulses.length.toString().padStart(2, "0");
  refs.hypeValue.textContent = Math.round(state.stats.hype).toString().padStart(2, "0");
  refs.hypeBar.style.width = `${Math.min(state.stats.hype, 100)}%`;
  refs.streakValue.textContent = Math.round(state.stats.streak).toString().padStart(2, "0");
  refs.streakBar.style.width = `${state.stats.streak}%`;
  refs.laneCount.textContent = state.lanes.length.toString().padStart(2, "0");
  refs.melodyBar.style.width = `${Math.min(state.stats.melodyScore, 100)}%`;
  refs.modeLabel.textContent = state.autoLoop ? "Fluxo livre" : "Manual";
  const aurora = state.events.aurora;
  refs.auroraState.textContent = aurora.active
    ? "Tempestade"
    : aurora.cooldown > 0
      ? "Recarga"
      : "Dormindo";
}

function renderQuests() {
  refs.questList.innerHTML = "";
  questConfig.forEach((quest) => {
    const progress = Math.min(quest.metric(), quest.goal);
    const percent = (progress / quest.goal) * 100;
    const li = document.createElement("li");
    li.className = "quest-card";
    li.dataset.complete = String(progress >= quest.goal);
    li.innerHTML = `
      <strong>${quest.label}</strong>
      <p>${progress}/${quest.goal}</p>
      <div class="quest-progress"><span style="width: ${percent}%"></span></div>
    `;
    refs.questList.appendChild(li);
  });
}

function addLane() {
  if (state.lanes.length >= MAX_LANES) {
    pushFeed("Limite de melodias atingido.");
    return;
  }
  const lane = createLane();
  state.lanes.push(lane);
  renderLanes();
  updateStatsUI();
  pushFeed(`${lane.name} entrou no sequenciador.`);
}

function createLane() {
  const kit = kits[state.kit];
  const data = buildLaneNotes(kit, state.polyrhythm);
  const pattern = Array.from({ length: state.polyrhythm }, () => Math.random() < 0.35);
  if (!pattern.some(Boolean)) {
    pattern[Math.floor(Math.random() * pattern.length)] = true;
  }
  return {
    id: generateId(),
    name: `Melodia ${state.lanes.length + 1}`,
    notes: data.notes,
    scaleName: data.scaleName,
    wave: kit.melodyWave,
    pattern
  };
}

function buildLaneNotes(kit, length) {
  const scale = randomItem(kit.scales);
  const root = randomItem(kit.melodyRoots);
  const notes = Array.from({ length }, (_, index) => {
    const semitone = scale.steps[index % scale.steps.length];
    return root * Math.pow(2, semitone / 12);
  });
  return { notes, scaleName: scale.name };
}

function resizeLanePattern(lane, length) {
  if (lane.pattern.length === length) return;
  const newPattern = Array.from({ length }, (_, idx) => lane.pattern[idx % lane.pattern.length]);
  lane.pattern = newPattern;
  const kit = kits[state.kit];
  const data = buildLaneNotes(kit, length);
  lane.notes = data.notes;
  lane.scaleName = data.scaleName;
}

function renderLanes() {
  refs.laneList.innerHTML = "";
  state.lanes.forEach((lane) => {
    const article = document.createElement("article");
    article.className = "lane";
    article.dataset.id = lane.id;
    const steps = lane.pattern
      .map(
        (active, index) => `
          <button class="lane-step" data-lane="${lane.id}" data-index="${index}" aria-pressed="${active}">
            ${(index + 1).toString().padStart(2, "0")}
          </button>
        `
      )
      .join("");
    article.innerHTML = `
      <header>
        <strong>${lane.name}</strong>
        <span>${lane.scaleName}</span>
      </header>
      <div class="lane-steps">
        ${steps}
      </div>
    `;
    refs.laneList.appendChild(article);
  });
  refs.laneEmpty.style.display = state.lanes.length ? "none" : "block";
}

function handleLaneInteraction(event) {
  const button = event.target.closest(".lane-step");
  if (!button) return;
  const lane = state.lanes.find((item) => item.id === button.dataset.lane);
  if (!lane) return;
  const index = Number(button.dataset.index);
  lane.pattern[index] = !lane.pattern[index];
  button.setAttribute("aria-pressed", String(lane.pattern[index]));
}

function randomizeLanes() {
  state.lanes.forEach((lane) => {
    lane.pattern = Array.from({ length: state.polyrhythm }, () => Math.random() < 0.4);
    const data = buildLaneNotes(kits[state.kit], state.polyrhythm);
    lane.notes = data.notes;
    lane.scaleName = data.scaleName;
  });
  renderLanes();
  pushFeed("Melodias embaralhadas.");
}

function igniteLaneStep(lane) {
  const index = Math.floor(Math.random() * state.polyrhythm);
  lane.pattern[index] = true;
  return index;
}

function pushFeed(text) {
  state.feed.unshift({ text, time: new Date().toLocaleTimeString("pt-BR", { minute: "2-digit", second: "2-digit" }) });
  state.feed = state.feed.slice(0, FEED_LIMIT);
  refs.feedList.innerHTML = "";
  state.feed.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `[${entry.time}] ${entry.text}`;
    refs.feedList.appendChild(li);
  });
}

function ensureAudio() {
  if (!window.AudioContext) return;
  if (!audio.ctx) {
    audio.ctx = new AudioContext();
    audio.master = audio.ctx.createGain();
    audio.master.gain.value = 0.25;
    audio.master.connect(audio.ctx.destination);
  }
  if (audio.ctx.state === "suspended") {
    audio.ctx.resume();
  }
}

function playNote({ freq, wave, duration = 0.35, gain = 0.25, startOffset = 0, detune = 0, feel = {}, flags = {} }) {
  if (!audio.ctx) return;
  const ctx = audio.ctx;
  let offset = startOffset;
  let finalFreq = freq;

  if (feel.swingPhase === "late" && state.swing > 0 && !flags.swingReplica) {
    offset += getSwingDelay();
  }

  if (feel.humanize && state.humanize > 0 && !flags.humanizeReplica) {
    const timingDrift = (state.humanize / 100) * 0.08;
    offset += randomBetween(0, timingDrift);
    const centsSpan = (state.humanize / 100) * 60;
    const detuneCents = randomBetween(-centsSpan, centsSpan);
    finalFreq *= Math.pow(2, detuneCents / 1200);
  }

  offset = Math.max(0, offset);
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = wave;
  osc.frequency.value = finalFreq;
  osc.detune.value = detune;
  if (state.fx.crush && !flags.crushReplica) {
    const curve = new Float32Array(6);
    for (let i = 0; i < curve.length; i += 1) {
      curve[i] = finalFreq + (i % 2 === 0 ? 18 : -18);
    }
    osc.frequency.setValueCurveAtTime(curve, ctx.currentTime + offset, duration);
  }
  amp.gain.setValueAtTime(0, ctx.currentTime + offset);
  amp.gain.linearRampToValueAtTime(gain, ctx.currentTime + offset + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + duration);
  osc.connect(amp).connect(audio.master);
  osc.start(ctx.currentTime + offset);
  osc.stop(ctx.currentTime + offset + duration + 0.1);

  if (state.fx.delay && !flags.delayReplica) {
    playNote({
      freq: finalFreq * 0.98,
      wave,
      duration: duration * 0.8,
      gain: gain * 0.45,
      startOffset: offset + 0.18,
      feel: { humanize: false },
      flags: { delayReplica: true, swingReplica: true, humanizeReplica: true }
    });
  }
  if (state.fx.reverb && !flags.reverbReplica) {
    playNote({
      freq: finalFreq * 0.5,
      wave: "sine",
      duration: duration * 1.4,
      gain: gain * 0.35,
      startOffset: offset + 0.03,
      detune: 20,
      feel: { humanize: false },
      flags: { reverbReplica: true, swingReplica: true, humanizeReplica: true }
    });
  }
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getSwingDelay() {
  const stepSeconds = (60 / state.bpm) / 2;
  return (state.swing / 100) * stepSeconds * 0.75;
}

function wrap(value, min, max) {
  const range = max - min;
  let result = ((value - min) % range + range) % range + min;
  if (!Number.isFinite(result)) result = min;
  return result;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function generateId() {
  return `PX${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function initAether() {
  const canvas = document.getElementById("aether");
  const ctx = canvas.getContext("2d");
  const dots = Array.from({ length: 80 }, () => makeDot());

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(draw);

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function makeDot() {
    return {
      x: Math.random(),
      y: Math.random(),
      speed: 0.0003 + Math.random() * 0.0008,
      size: 0.5 + Math.random() * 1.4
    };
  }

  function draw(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach((dot) => {
      const x = dot.x * canvas.width;
      const y = ((dot.y + timestamp * dot.speed) % 1) * canvas.height;
      ctx.fillStyle = "rgba(122, 160, 255, 0.22)";
      ctx.beginPath();
      ctx.arc(x, y, dot.size, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
}
