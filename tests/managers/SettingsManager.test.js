import { describe, it, expect } from 'vitest';
import { SettingsManager } from '../../src/managers/SettingsManager.js';

function fakeStorage() {
  const store = {};
  return {
    getItem: (k)    => store[k] ?? null,
    setItem: (k, v) => { store[k] = v; },
  };
}

describe('SettingsManager', () => {
  it('defaults hints to enabled when storage has no value', () => {
    const s = new SettingsManager(fakeStorage());
    expect(s.hintsEnabled).toBe(true);
  });

  it('returns false after one toggle', () => {
    const s = new SettingsManager(fakeStorage());
    s.toggle();
    expect(s.hintsEnabled).toBe(false);
  });

  it('returns true after two toggles', () => {
    const s = new SettingsManager(fakeStorage());
    s.toggle();
    s.toggle();
    expect(s.hintsEnabled).toBe(true);
  });

  it('persists the setting across instances sharing the same storage', () => {
    const storage = fakeStorage();
    const s1 = new SettingsManager(storage);
    s1.toggle();
    const s2 = new SettingsManager(storage);
    expect(s2.hintsEnabled).toBe(false);
  });

  it('reads an explicit stored "true" as enabled', () => {
    const storage = fakeStorage();
    storage.setItem('captains-wheel:hints', 'true');
    expect(new SettingsManager(storage).hintsEnabled).toBe(true);
  });

  it('reads an explicit stored "false" as disabled', () => {
    const storage = fakeStorage();
    storage.setItem('captains-wheel:hints', 'false');
    expect(new SettingsManager(storage).hintsEnabled).toBe(false);
  });
});

describe('SettingsManager — music', () => {
  it('defaults music to enabled', () => {
    expect(new SettingsManager(fakeStorage()).musicEnabled).toBe(true);
  });

  it('disables music after one toggleMusic', () => {
    const s = new SettingsManager(fakeStorage());
    s.toggleMusic();
    expect(s.musicEnabled).toBe(false);
  });

  it('re-enables music after two toggleMusic calls', () => {
    const s = new SettingsManager(fakeStorage());
    s.toggleMusic();
    s.toggleMusic();
    expect(s.musicEnabled).toBe(true);
  });

  it('persists music setting across instances', () => {
    const storage = fakeStorage();
    new SettingsManager(storage).toggleMusic();
    expect(new SettingsManager(storage).musicEnabled).toBe(false);
  });
});
