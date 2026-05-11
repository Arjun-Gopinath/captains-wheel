const HINTS_KEY = 'captains-wheel:hints';
const MUSIC_KEY = 'captains-wheel:music';

export class SettingsManager {
  constructor(storage = localStorage) {
    this._storage = storage;
  }

  get hintsEnabled() {
    return this._storage.getItem(HINTS_KEY) !== 'false';
  }

  toggle() {
    this._storage.setItem(HINTS_KEY, String(!this.hintsEnabled));
  }

  get musicEnabled() {
    return this._storage.getItem(MUSIC_KEY) !== 'false';
  }

  toggleMusic() {
    this._storage.setItem(MUSIC_KEY, String(!this.musicEnabled));
  }
}
