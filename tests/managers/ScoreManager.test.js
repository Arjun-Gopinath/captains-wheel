import { describe, it, expect, beforeEach } from 'vitest';
import { ScoreManager } from '../../src/managers/ScoreManager.js';

describe('ScoreManager', () => {
  let score;

  beforeEach(() => {
    score = new ScoreManager();
  });

  it('starts at 0 score and 0 combo', () => {
    expect(score.score).toBe(0);
    expect(score.combo).toBe(0);
  });

  it('adds 10 points on the first match (no multiplier)', () => {
    score.addMatch();
    expect(score.score).toBe(10);
  });

  it('increments combo on each match', () => {
    score.addMatch();
    score.addMatch();
    expect(score.combo).toBe(2);
  });

  it('resets combo to 0 on miss', () => {
    score.addMatch();
    score.addMatch();
    score.addMiss();
    expect(score.combo).toBe(0);
  });

  it('does not reduce score on miss', () => {
    score.addMatch();
    score.addMiss();
    expect(score.score).toBe(10);
  });

  describe('getMultiplier', () => {
    it('returns 1 below 5 combo', () => {
      expect(score.getMultiplier()).toBe(1);
    });

    it('returns 1.5 at 5+ combo', () => {
      for (let i = 0; i < 5; i++) score.addMatch();
      expect(score.getMultiplier()).toBe(1.5);
    });

    it('returns 2 at 10+ combo', () => {
      for (let i = 0; i < 10; i++) score.addMatch();
      expect(score.getMultiplier()).toBe(2);
    });

    it('returns 3 at 20+ combo', () => {
      for (let i = 0; i < 20; i++) score.addMatch();
      expect(score.getMultiplier()).toBe(3);
    });
  });

  describe('addMatch heal return', () => {
    it('returns 0 on a non-milestone combo', () => {
      const heal = score.addMatch();
      expect(heal).toBe(0);
    });

    it('returns 5 HP at combo milestone 20', () => {
      for (let i = 0; i < 19; i++) score.addMatch();
      const heal = score.addMatch();
      expect(heal).toBe(5);
    });

    it('returns 15 HP at combo milestone 50', () => {
      for (let i = 0; i < 49; i++) score.addMatch();
      const heal = score.addMatch();
      expect(heal).toBe(15);
    });

    it('returns 30 HP at combo milestone 100', () => {
      for (let i = 0; i < 99; i++) score.addMatch();
      const heal = score.addMatch();
      expect(heal).toBe(30);
    });
  });

  describe('getSegmentCount', () => {
    it('returns 2 at score 0', () => {
      expect(score.getSegmentCount()).toBe(2);
    });

    it('returns 4 at score 100', () => {
      score.score = 100;
      expect(score.getSegmentCount()).toBe(4);
    });

    it('returns 6 at score 300', () => {
      score.score = 300;
      expect(score.getSegmentCount()).toBe(6);
    });

    it('returns 8 at score 600', () => {
      score.score = 600;
      expect(score.getSegmentCount()).toBe(8);
    });
  });
});
