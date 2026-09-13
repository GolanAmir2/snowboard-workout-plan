const STORAGE_KEY = "summit-prep-state-v1";
const TRIP_DEFAULT = "2027-02-02";
const APP_VERSION = "v1.5";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    tripDate: TRIP_DEFAULT,
    startDate: todayStr(),
    currentWeek: 1,
    currentDay: "A",
    checked: {},
    daysDone: {},
  };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

let state = loadState();

// Backfill for installs that predate the schedule tracker:
// you started Sep 13 2026, trip Feb 2 2027.
if (!state.startDate) {
  state.startDate = "2026-09-13";
}
if (!state.tripDate || state.tripDate < "2026-09-13") {
  state.tripDate = TRIP_DEFAULT;
}

const el = (id) => document.getElementById(id);
const CHECK_SVG = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#0F1720" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function keyFor(week, day) {
  return `${week}-${day}`;
}

function updateCountdown() {
  el("tripDate").value = state.tripDate;
  const trip = new Date(state.tripDate + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffDays = Math.round((trip - now) / 86400000);
  el("daysLeft").textContent = diffDays >= 0 ? diffDays : 0;
}

function updateProgressStrip() {
  const week = state.currentWeek;
  const phase = getPhaseForWeek(week);
  el("phaseLabel").textContent = `Phase ${PLAN.phases.indexOf(phase) + 1} · ${phase.name}`;
  el("weekLabel").textContent = `Week ${week} of 20`;
  el("trackFill").style.width = `${(week / 20) * 100}%`;
  el("weekSlider").value = week;
}

function renderDayTabs() {
  const week = state.currentWeek;
  const phase = getPhaseForWeek(week);
  const tabs = el("dayTabs");
  tabs.innerHTML = "";
  ["A", "B", "C"].forEach((dayId) => {
    const day = phase.days[dayId];
    const btn = document.createElement("button");
    btn.className = "day-tab" + (dayId === state.currentDay ? " active" : "");
    if (state.daysDone[keyFor(week, dayId)]) btn.classList.add("done");
    btn.innerHTML = `Day ${dayId}<span class="day-tab-title">${day.title}</span>`;
    btn.onclick = () => {
      state.currentDay = dayId;
      editing = false;
      saveState();
      render();
    };
    tabs.appendChild(btn);
  });
}

function getEffectiveExercises(week, dayId, day) {
  const k = keyFor(week, dayId);
  return (state.customWorkouts && state.customWorkouts[k]) || day.exercises;
}

let editing = false;

function renderWorkout() {
  const week = state.currentWeek;
  const dayId = state.currentDay;
  const phase = getPhaseForWeek(week);
  const day = phase.days[dayId];
  const k = keyFor(week, dayId);
  if (!state.checked[k]) state.checked[k] = {};
  if (!state.customWorkouts) state.customWorkouts = {};

  const isDone = !!state.daysDone[k];
  const exercises = getEffectiveExercises(week, dayId, day);
  const isCustom = !!state.customWorkouts[k];

  if (editing) {
    renderEditMode(day, exercises, k);
    return;
  }

  const rows = exercises
    .map((ex, i) => {
      if (ex.detail === "" && ex.name.toLowerCase().startsWith("circuit")) {
        return `<li class="exercise-row header-row"><span class="exercise-name">${ex.name}</span></li>`;
      }
      const checked = !!state.checked[k][i];
      return `
        <li class="exercise-row${checked ? " checked" : ""}" data-idx="${i}">
          <span class="checkbox">${CHECK_SVG}</span>
          <span class="exercise-text">
            <div class="exercise-name">${ex.name}</div>
            ${ex.detail ? `<div class="exercise-detail">${ex.detail}</div>` : ""}
          </span>
          <a class="watch-link" href="${exerciseVideoUrl(ex.name)}" target="_blank" rel="noopener" title="Watch a tutorial on YouTube" onclick="event.stopPropagation()">▶</a>
        </li>`;
    })
    .join("");

  const cooldownRows = (day.cooldown || [])
    .map((id) => {
      const s = STRETCHES[id];
      return `
        <li class="stretch-row">
          <span class="exercise-text">
            <div class="exercise-name">${s.name}</div>
            <div class="exercise-detail">${s.detail}</div>
          </span>
          <a class="watch-link" href="${stretchVideoUrl(id)}" target="_blank" rel="noopener" title="Watch a tutorial on YouTube">▶</a>
        </li>`;
    })
    .join("");

  el("workoutView").innerHTML = `
    <div class="workout-card">
      <div class="workout-card-header">
        <div class="card-title-row">
          <h2>${day.title}</h2>
          <button class="edit-btn" id="editBtn">Edit</button>
        </div>
        ${day.warmup ? `<div class="warmup-line"><b>Warm-up</b> — ${day.warmup}</div>` : ""}
        ${isCustom ? `<div class="custom-note">Customized for this week <button id="revertBtn" class="revert-btn">Reset to plan default</button></div>` : ""}
      </div>
      <ul class="exercise-list">${rows}</ul>
      ${cooldownRows ? `<div class="cooldown-block"><div class="cooldown-heading">Cool-down</div><ul class="stretch-list">${cooldownRows}</ul></div>` : ""}
      <button class="complete-btn${isDone ? " done" : ""}" id="completeBtn">
        ${isDone ? "Workout complete ✓" : "Mark workout complete"}
      </button>
    </div>
  `;

  document.querySelectorAll(".exercise-row[data-idx]").forEach((row) => {
    row.addEventListener("click", () => {
      const idx = row.dataset.idx;
      state.checked[k][idx] = !state.checked[k][idx];
      saveState();
      renderWorkout();
      renderDayTabs();
    });
  });

  el("completeBtn").addEventListener("click", () => {
    state.daysDone[k] = !state.daysDone[k];
    saveState();
    renderWorkout();
    renderDayTabs();
  });

  el("editBtn").addEventListener("click", () => {
    editing = true;
    renderWorkout();
  });

  const revertBtn = el("revertBtn");
  if (revertBtn) {
    revertBtn.addEventListener("click", () => {
      delete state.customWorkouts[k];
      saveState();
      renderWorkout();
    });
  }
}

function renderEditMode(day, exercises, k) {
  const rows = exercises
    .map(
      (ex, i) => `
      <li class="edit-row" data-idx="${i}">
        <div class="edit-fields">
          <input type="text" class="edit-name" value="${ex.name.replace(/"/g, "&quot;")}" placeholder="Exercise name">
          <input type="text" class="edit-detail" value="${(ex.detail || "").replace(/"/g, "&quot;")}" placeholder="e.g. 3 × 12">
        </div>
        <button class="remove-row-btn" data-idx="${i}" title="Remove">✕</button>
      </li>`
    )
    .join("");

  el("workoutView").innerHTML = `
    <div class="workout-card">
      <div class="workout-card-header">
        <div class="card-title-row">
          <h2>${day.title}</h2>
        </div>
        <div class="edit-hint">Edit exercises for this specific week. Other weeks stay on the default plan.</div>
      </div>
      <ul class="edit-list" id="editList">${rows}</ul>
      <button class="add-row-btn" id="addRowBtn">+ Add exercise</button>
      <div class="edit-actions">
        <button class="cancel-btn" id="cancelEditBtn">Cancel</button>
        <button class="complete-btn" id="saveEditBtn">Save changes</button>
      </div>
    </div>
  `;

  el("addRowBtn").addEventListener("click", () => {
    const list = el("editList");
    const idx = list.children.length;
    const li = document.createElement("li");
    li.className = "edit-row";
    li.dataset.idx = idx;
    li.innerHTML = `
      <div class="edit-fields">
        <input type="text" class="edit-name" value="" placeholder="Exercise name">
        <input type="text" class="edit-detail" value="" placeholder="e.g. 3 × 12">
      </div>
      <button class="remove-row-btn" data-idx="${idx}" title="Remove">✕</button>`;
    list.appendChild(li);
    wireRemoveButtons();
  });

  function wireRemoveButtons() {
    document.querySelectorAll(".remove-row-btn").forEach((btn) => {
      btn.onclick = () => btn.closest(".edit-row").remove();
    });
  }
  wireRemoveButtons();

  el("cancelEditBtn").addEventListener("click", () => {
    editing = false;
    renderWorkout();
  });

  el("saveEditBtn").addEventListener("click", () => {
    const newExercises = Array.from(document.querySelectorAll("#editList .edit-row"))
      .map((row) => ({
        name: row.querySelector(".edit-name").value.trim(),
        detail: row.querySelector(".edit-detail").value.trim(),
      }))
      .filter((ex) => ex.name);
    if (!state.customWorkouts) state.customWorkouts = {};
    state.customWorkouts[k] = newExercises;
    saveState();
    editing = false;
    renderWorkout();
  });
}

function renderPhaseNote() {
  const phase = getPhaseForWeek(state.currentWeek);
  el("phaseNote").textContent = phase.blurb;
}

function scheduleInfo() {
  const start = new Date(state.startDate + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const days = Math.max(0, Math.round((now - start) / 86400000));
  const expectedWeek = Math.min(20, Math.floor(days / 7) + 1);
  const expectedSessions = Math.min(60, (expectedWeek - 1) * 3);
  const doneCount = Object.values(state.daysDone || {}).filter(Boolean).length;
  return { days, expectedWeek, expectedSessions, doneCount, diff: doneCount - expectedSessions };
}

function renderSchedule() {
  const s = scheduleInfo();
  const line = el("scheduleLine");
  if (!line) return;
  let status, cls;
  if (s.diff >= 0) {
    status = `On track · ${s.doneCount}/60 workouts`;
    cls = "on-track";
  } else {
    const n = -s.diff;
    status = `${n} workout${n > 1 ? "s" : ""} behind · ${s.doneCount}/60 done`;
    cls = "behind";
  }
  const jump =
    state.currentWeek !== s.expectedWeek
      ? ` <button class="schedule-jump" id="scheduleJump">Go to week ${s.expectedWeek}</button>`
      : "";
  line.className = "schedule-line " + cls;
  line.innerHTML = `<span>${status} · should be week ${s.expectedWeek}</span>${jump}`;
  const j = el("scheduleJump");
  if (j) {
    j.onclick = () => {
      state.currentWeek = s.expectedWeek;
      state.currentDay = "A";
      editing = false;
      saveState();
      render();
    };
  }
}

function render() {
  updateCountdown();
  updateProgressStrip();
  renderSchedule();
  renderDayTabs();
  renderWorkout();
  renderPhaseNote();
  el("versionLine").textContent = APP_VERSION;
}

// ---------- Full plan sheet ----------

function renderSheet() {
  el("sheetBody").innerHTML = PLAN.phases
    .map((phase) => {
      const days = ["A", "B", "C"]
        .map((d) => `<div class="sheet-day"><b>Day ${d}:</b> ${phase.days[d].title}</div>`)
        .join("");
      const weekLabel = phase.range[0] === phase.range[1] ? `Week ${phase.range[0]}` : `Weeks ${phase.range[0]}–${phase.range[1]}`;
      return `
        <div class="sheet-phase">
          <div class="sheet-phase-title">${phase.name}</div>
          <div class="sheet-phase-weeks">${weekLabel}</div>
          <div class="sheet-phase-blurb">${phase.blurb}</div>
          ${days}
        </div>`;
    })
    .join("");
}

function renderStretchGuide() {
  const rows = Object.keys(STRETCHES)
    .map((id) => {
      const s = STRETCHES[id];
      return `
        <li class="stretch-row">
          <span class="exercise-text">
            <div class="exercise-name">${s.name}</div>
            <div class="exercise-detail">${s.detail}</div>
          </span>
          <a class="watch-link" href="${stretchVideoUrl(id)}" target="_blank" rel="noopener" title="Watch a tutorial on YouTube">▶</a>
        </li>`;
    })
    .join("");
  el("sheetBody").innerHTML = `
    <p class="sheet-intro">Every stretch used across the plan, in one place. Good for any day you want extra mobility work, or a rest-day flow.</p>
    <ul class="stretch-list">${rows}</ul>
  `;
  el("sheetTitle").textContent = "Stretching guide";
}

// ---------- Event wiring ----------

el("tripDate").addEventListener("change", (e) => {
  state.tripDate = e.target.value;
  saveState();
  updateCountdown();
});

el("weekSlider").addEventListener("input", (e) => {
  state.currentWeek = parseInt(e.target.value, 10);
  state.currentDay = "A";
  editing = false;
  saveState();
  render();
});

el("weekBack").addEventListener("click", () => {
  if (state.currentWeek > 1) {
    state.currentWeek--;
    state.currentDay = "A";
    editing = false;
    saveState();
    render();
  }
});

el("weekFwd").addEventListener("click", () => {
  if (state.currentWeek < 20) {
    state.currentWeek++;
    state.currentDay = "A";
    editing = false;
    saveState();
    render();
  }
});

el("resetBtn").addEventListener("click", () => {
  if (confirm("Reset all progress? This clears every checked workout.")) {
    localStorage.removeItem(STORAGE_KEY);
    state = loadState();
    render();
  }
});

el("viewAllBtn").addEventListener("click", () => {
  el("sheetTitle").textContent = "Full plan";
  renderSheet();
  el("sheetBackdrop").classList.add("open");
});

el("stretchGuideBtn").addEventListener("click", () => {
  renderStretchGuide();
  el("sheetBackdrop").classList.add("open");
});

el("sheetClose").addEventListener("click", () => {
  el("sheetBackdrop").classList.remove("open");
});

el("sheetBackdrop").addEventListener("click", (e) => {
  if (e.target === el("sheetBackdrop")) el("sheetBackdrop").classList.remove("open");
});

render();
