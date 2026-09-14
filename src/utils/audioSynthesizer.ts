// Audio synthesizer using native browser Web Audio API

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmInterval: number | null = null;
  private isBgmPlaying = false;
  private isMuted = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isBgmPlaying) {
      this.stopBgm();
    }
  }

  public getIsMuted() {
    return this.isMuted;
  }

  // Web shooter "THWIP" sound
  public playThwip() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(3200, now + 0.12);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.15);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // ignore
    }
  }

  // Target hit / Pop sound
  public playPop() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // ignore
    }
  }

  // Card match / success chime
  public playChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const now = ctx.currentTime + idx * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
      });
    } catch {
      // ignore
    }
  }

  // Candle blown sound (gentle wind puff)
  public playBlow() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.2));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.4);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch {
      // ignore
    }
  }

  // Fanfare victory
  public playVictory() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const melody = [
        { f: 523.25, d: 0.15 }, // C5
        { f: 659.25, d: 0.15 }, // E5
        { f: 783.99, d: 0.2 },  // G5
        { f: 1046.5, d: 0.4 },  // C6
      ];
      let t = ctx.currentTime;
      melody.forEach(m => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(m.f, t);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + m.d);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + m.d);
        t += m.d * 0.9;
      });
    } catch {
      // ignore
    }
  }

  // Sweet music-box "Happy Birthday" melody synthesizer
  public startBirthdayBGM() {
    if (this.isBgmPlaying || this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isBgmPlaying = true;

    // Happy Birthday notes (in Hz) and durations (in beats)
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25, D5 = 587.33;
    const song = [
      { n: C4, b: 0.75 }, { n: C4, b: 0.25 }, { n: D4, b: 1.0 }, { n: C4, b: 1.0 }, { n: F4, b: 1.0 }, { n: E4, b: 2.0 },
      { n: C4, b: 0.75 }, { n: C4, b: 0.25 }, { n: D4, b: 1.0 }, { n: C4, b: 1.0 }, { n: G4, b: 1.0 }, { n: F4, b: 2.0 },
      { n: C4, b: 0.75 }, { n: C4, b: 0.25 }, { n: C5, b: 1.0 }, { n: A4, b: 1.0 }, { n: F4, b: 1.0 }, { n: E4, b: 1.0 }, { n: D4, b: 2.0 },
      { n: B4, b: 0.75 }, { n: B4, b: 0.25 }, { n: A4, b: 1.0 }, { n: F4, b: 1.0 }, { n: G4, b: 1.0 }, { n: F4, b: 2.5 }
    ];

    const beatDuration = 0.45; // seconds per beat

    const playLoop = () => {
      if (!this.isBgmPlaying || this.isMuted) return;
      const context = this.getContext();
      if (!context) return;

      let currentTime = context.currentTime + 0.1;

      song.forEach(note => {
        const osc = context.createOscillator();
        const gain = context.createGain();

        osc.type = 'triangle'; // sweet music-box / vibraphone tone
        osc.frequency.setValueAtTime(note.n * 1.0, currentTime);

        // Bell/marimba envelope
        gain.gain.setValueAtTime(0.001, currentTime);
        gain.gain.linearRampToValueAtTime(0.18, currentTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, currentTime + note.b * beatDuration * 0.95);

        osc.connect(gain);
        gain.connect(context.destination);

        osc.start(currentTime);
        osc.stop(currentTime + note.b * beatDuration);

        currentTime += note.b * beatDuration;
      });

      // schedule next loop
      const totalTime = song.reduce((acc, curr) => acc + curr.b * beatDuration, 0) + 1.2;
      this.bgmInterval = window.setTimeout(() => {
        if (this.isBgmPlaying) {
          playLoop();
        }
      }, totalTime * 1000);
    };

    playLoop();
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearTimeout(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public getIsBgmPlaying() {
    return this.isBgmPlaying;
  }
}

export const soundEngine = new SoundEngine();
