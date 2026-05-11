import { describe, it, expect, beforeEach } from 'vitest';
import { PauseManager } from '../../src/managers/PauseManager.js';

describe('PauseManager', () => {
  let pm;

  beforeEach(() => {
    pm = new PauseManager();
  });

  it('starts unpaused', () => {
    expect(pm.isPaused).toBe(false);
  });

  it('pauses', () => {
    pm.pause();
    expect(pm.isPaused).toBe(true);
  });

  it('resumes', () => {
    pm.pause();
    pm.resume();
    expect(pm.isPaused).toBe(false);
  });

  it('toggle returns true when pausing', () => {
    expect(pm.toggle()).toBe(true);
    expect(pm.isPaused).toBe(true);
  });

  it('toggle returns false when resuming', () => {
    pm.pause();
    expect(pm.toggle()).toBe(false);
    expect(pm.isPaused).toBe(false);
  });

  it('resume is a no-op when already unpaused', () => {
    pm.resume();
    expect(pm.isPaused).toBe(false);
  });

  it('pause is a no-op when already paused', () => {
    pm.pause();
    pm.pause();
    expect(pm.isPaused).toBe(true);
  });
});
