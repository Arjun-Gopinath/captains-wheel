const TRACKS = [
  { key: 'bgm-slow', minScore: 0 },
  { key: 'bgm-mid',  minScore: 300 },
  { key: 'bgm-fast', minScore: 600 },
];

export class AudioManager {
  constructor(soundManager) {
    this._sound = soundManager;
  }

  sync(score) {
    const wanted = [...TRACKS].reverse().find(t => score >= t.minScore).key;
    if (this._sound.get(wanted)?.isPlaying) return;
    this._switchTo(wanted);
  }

  stop() {
    for (const { key } of TRACKS) {
      this._sound.get(key)?.stop();
    }
  }

  _switchTo(key) {
    for (const { key: k } of TRACKS) {
      if (k !== key) this._sound.get(k)?.stop();
    }
    const next = this._sound.get(key);
    if (next && !next.isPlaying) next.play();
  }
}
