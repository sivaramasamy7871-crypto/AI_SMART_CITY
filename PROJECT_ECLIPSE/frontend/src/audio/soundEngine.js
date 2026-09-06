class CitySoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.ambientGain = null;
    this.rainGain = null;
    this.sirenOsc = null;
    this.sirenGain = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // 1. Ambient city low-frequency hum & filtered noise
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const ambientNoise = this.ctx.createBufferSource();
      ambientNoise.buffer = noiseBuffer;
      ambientNoise.loop = true;

      const ambientFilter = this.ctx.createBiquadFilter();
      ambientFilter.type = 'lowpass';
      ambientFilter.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

      ambientNoise.connect(ambientFilter);
      ambientFilter.connect(this.ambientGain);
      this.ambientGain.connect(this.masterGain);
      ambientNoise.start();

      // 2. Rain Synthesizer
      const rainBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const rainData = rainBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        rainData[i] = (Math.random() * 2 - 1) * 0.4;
      }
      const rainSource = this.ctx.createBufferSource();
      rainSource.buffer = rainBuffer;
      rainSource.loop = true;

      const rainFilter = this.ctx.createBiquadFilter();
      rainFilter.type = 'bandpass';
      rainFilter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      rainFilter.Q.setValueAtTime(0.8, this.ctx.currentTime);

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

      rainSource.connect(rainFilter);
      rainFilter.connect(this.rainGain);
      this.rainGain.connect(this.masterGain);
      rainSource.start();

      this.isInitialized = true;
    } catch (e) {
      console.warn("Web Audio initialization skipped or not supported:", e);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (!this.isInitialized && !this.isMuted) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.4, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  setWeather(weather) {
    if (!this.rainGain || !this.ctx) return;
    const target = (weather === 'rain') ? 0.35 : (weather === 'storm' ? 0.6 : 0.0);
    this.rainGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.5);
  }

  playClick() {
    if (this.isMuted || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch (e) {}
  }

  playBuildSound() {
    if (this.isMuted || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch (e) {}
  }

  triggerSiren(durationSec = 4) {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';

      const now = this.ctx.currentTime;
      for (let i = 0; i < durationSec; i++) {
        osc.frequency.setValueAtTime(600, now + i);
        osc.frequency.linearRampToValueAtTime(900, now + i + 0.5);
        osc.frequency.linearRampToValueAtTime(600, now + i + 1.0);
      }

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.setTargetAtTime(0.0, now + durationSec, 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + durationSec + 0.3);
    } catch (e) {}
  }
}

export const soundEngine = new CitySoundEngine();
