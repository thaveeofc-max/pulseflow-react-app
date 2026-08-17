// Web Audio API Synthesizer for UI sound effects & ambient noise
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.ambientNodes = null;
    this.isAmbientPlaying = false;
    this.ambientType = 'rain';
    this.ambientVolume = 0.25;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Pleasant Task Complete chime
  playComplete() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
      osc1.frequency.exponentialRampToValueAtTime(1174.66, now + 0.28); // D6

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(293.66, now); // D4
      osc2.frequency.exponentialRampToValueAtTime(587.33, now + 0.28);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  // Timer complete alert bell
  playTimerBell() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
      
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.12;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.8);
      });
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  // Subtle button click pop
  playClick() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  // Toggle ambient focus noise
  toggleAmbient(type = 'rain', volume = 0.2) {
    this.init();
    if (this.isAmbientPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient(type, volume);
      return true;
    }
  }

  startAmbient(type = 'rain', volume = 0.2) {
    try {
      this.stopAmbient();
      this.init();
      this.ambientType = type;
      this.ambientVolume = volume;

      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        // Pink / brownian noise generator
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter based on ambient type
      const filter = this.ctx.createBiquadFilter();
      if (type === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.value = 800;
      } else if (type === 'waves') {
        filter.type = 'bandpass';
        filter.frequency.value = 450;
        filter.Q.value = 1.5;
      } else {
        filter.type = 'lowpass';
        filter.frequency.value = 400;
      }

      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(this.ambientVolume, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      whiteNoise.start();
      this.ambientNodes = { whiteNoise, gainNode, filter };
      this.isAmbientPlaying = true;
      return true;
    } catch (e) {
      console.debug('Ambient error:', e);
      return false;
    }
  }

  setAmbientVolume(volume) {
    this.ambientVolume = volume;
    if (this.ambientNodes && this.ambientNodes.gainNode) {
      this.ambientNodes.gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    }
  }

  stopAmbient() {
    if (this.ambientNodes) {
      try {
        this.ambientNodes.whiteNoise.stop();
        this.ambientNodes.whiteNoise.disconnect();
      } catch (e) {}
      this.ambientNodes = null;
    }
    this.isAmbientPlaying = false;
  }
}

export const sound = new SoundEngine();
