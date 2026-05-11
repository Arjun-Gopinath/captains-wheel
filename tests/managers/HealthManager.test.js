import { describe, it, expect, beforeEach } from 'vitest';
import { HealthManager } from '../../src/managers/HealthManager.js';

describe('HealthManager', () => {
  let health;

  beforeEach(() => {
    health = new HealthManager(100);
  });

  it('starts at max HP', () => {
    expect(health.hp).toBe(100);
  });

  it('takes damage correctly', () => {
    health.takeDamage(10);
    expect(health.hp).toBe(90);
  });

  it('does not go below 0 on over-damage', () => {
    health.takeDamage(200);
    expect(health.hp).toBe(0);
  });

  it('heals correctly', () => {
    health.takeDamage(30);
    health.heal(10);
    expect(health.hp).toBe(80);
  });

  it('does not exceed max HP on over-heal', () => {
    health.heal(50);
    expect(health.hp).toBe(100);
  });

  it('is not dead at full HP', () => {
    expect(health.isDead()).toBe(false);
  });

  it('is dead at 0 HP', () => {
    health.takeDamage(100);
    expect(health.isDead()).toBe(true);
  });

  it('returns correct percentage', () => {
    health.takeDamage(50);
    expect(health.getPercent()).toBe(0.5);
  });
});
