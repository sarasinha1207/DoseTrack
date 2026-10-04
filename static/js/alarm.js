/**
 * DoseGuard AI - Alarm & Cognitive Verification System
 * Generates continuous Web Audio alerts and requires 2 arithmetic math puzzles
 * to verify user alertness before the alarm can be dismissed.
 * Strictly no emojis.
 */

const DoseGuardAlarm = {
  audioContext: null,
  alarmInterval: null,
  currentPuzzles: { p1: null, p2: null },
  pendingMedicationId: null,
  onAlarmDismissedCallback: null,

  init(dismissCallback) {
    this.onAlarmDismissedCallback = dismissCallback;
    this.setupListeners();
  },

  setupListeners() {
    const btnDismiss = document.getElementById("btn-verify-alarm-math");
    if (btnDismiss) {
      btnDismiss.addEventListener("click", () => {
        this.verifyMathPuzzle();
      });
    }

    const input1 = document.getElementById("input-math-ans-1");
    const input2 = document.getElementById("input-math-ans-2");

    if (input1) {
      input1.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          if (input2) input2.focus();
        }
      });
    }

    if (input2) {
      input2.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          this.verifyMathPuzzle();
        }
      });
    }
  },

  trigger(medName, medTime, medId = null) {
    this.pendingMedicationId = medId;

    // Generate 2 arithmetic problems
    const a1 = Math.floor(Math.random() * 40) + 12;
    const b1 = Math.floor(Math.random() * 40) + 11;
    const ans1 = a1 + b1;

    const a2 = Math.floor(Math.random() * 6) + 4;
    const b2 = Math.floor(Math.random() * 7) + 3;
    const ans2 = a2 * b2;

    this.currentPuzzles = {
      p1: { prompt: `${a1} + ${b1}`, answer: ans1 },
      p2: { prompt: `${a2} x ${b2}`, answer: ans2 }
    };

    const promptEl1 = document.getElementById("math-prompt-1");
    const promptEl2 = document.getElementById("math-prompt-2");
    const inputEl1 = document.getElementById("input-math-ans-1");
    const inputEl2 = document.getElementById("input-math-ans-2");
    const errEl = document.getElementById("alarm-error-notice");
    const labelEl = document.getElementById("alarm-med-label");

    if (promptEl1) promptEl1.textContent = `${a1} + ${b1} = ?`;
    if (promptEl2) promptEl2.textContent = `${a2} x ${b2} = ?`;
    if (inputEl1) inputEl1.value = "";
    if (inputEl2) inputEl2.value = "";
    if (errEl) errEl.style.display = "none";
    if (labelEl) labelEl.textContent = `${medName} (${medTime})`;

    const modal = document.getElementById("modal-alarm-challenge");
    if (modal) modal.classList.add("active");

    if (inputEl1) inputEl1.focus();

    this.startAudio();
  },

  startAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }

      if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }

      this.playChime();
      if (this.alarmInterval) clearInterval(this.alarmInterval);
      this.alarmInterval = setInterval(() => {
        this.playChime();
      }, 1250);

    } catch (err) {
      console.error("AudioContext initialization error", err);
    }
  },

  playChime() {
    if (!this.audioContext) return;
    try {
      const ctx = this.audioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch (err) {
      console.error("Chime generation error", err);
    }
  },

  stopAudio() {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
  },

  verifyMathPuzzle() {
    const input1 = document.getElementById("input-math-ans-1");
    const input2 = document.getElementById("input-math-ans-2");
    const errEl = document.getElementById("alarm-error-notice");

    const ans1 = parseInt(input1 ? input1.value.trim() : "", 10);
    const ans2 = parseInt(input2 ? input2.value.trim() : "", 10);

    const expected1 = this.currentPuzzles.p1 ? this.currentPuzzles.p1.answer : null;
    const expected2 = this.currentPuzzles.p2 ? this.currentPuzzles.p2.answer : null;

    if (ans1 === expected1 && ans2 === expected2) {
      this.stopAudio();
      const modal = document.getElementById("modal-alarm-challenge");
      if (modal) modal.classList.remove("active");

      const medId = this.pendingMedicationId;
      this.pendingMedicationId = null;

      if (typeof this.onAlarmDismissedCallback === "function") {
        this.onAlarmDismissedCallback(medId);
      }
    } else {
      if (errEl) {
        errEl.textContent = "Incorrect answer. Solve both arithmetic puzzles accurately to dismiss the alarm.";
        errEl.style.display = "block";
      }
      if (input1) input1.focus();
    }
  }
};
