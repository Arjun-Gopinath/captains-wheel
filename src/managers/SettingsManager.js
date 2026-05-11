const KEY = 'captains-wheel:hints';

export class SettingsManager {
  constructor(storage = localStorage) {
    this._storage = storage;
  }

  get hintsEnabled() {
    return this._storage.getItem(KEY) !== 'false';
  }

  toggle() {
    this._storage.setItem(KEY, String(!this.hintsEnabled));
  }
}
