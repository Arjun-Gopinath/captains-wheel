export class PauseManager {
  constructor() {
    this._paused = false;
  }

  get isPaused() {
    return this._paused;
  }

  pause() {
    this._paused = true;
  }

  resume() {
    this._paused = false;
  }

  toggle() {
    this._paused = !this._paused;
    return this._paused;
  }
}
