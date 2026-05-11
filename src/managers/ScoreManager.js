const COMBO_HEALS = [
  { threshold: 100, heal: 10 },
  { threshold: 50, heal: 5 },
  { threshold: 20, heal: 2 },
];

const MULTIPLIER_THRESHOLDS = [
  { combo: 20, multiplier: 3 },
  { combo: 10, multiplier: 2 },
  { combo: 5, multiplier: 1.5 },
];

export class ScoreManager {
  constructor() {
    this.score = 0;
    this.combo = 0;
    this.highScore = 0;
  }

  addMatch() {
    this.combo += 1;
    this.score += 10 * this.getMultiplier();
    if (this.score > this.highScore) this.highScore = this.score;
    return this._getComboHeal();
  }

  addMiss() {
    this.combo = 0;
  }

  getMultiplier() {
    const match = MULTIPLIER_THRESHOLDS.find((t) => this.combo >= t.combo);
    return match ? match.multiplier : 1;
  }

  getSegmentCount() {
    if (this.score >= 600) return 8;
    if (this.score >= 300) return 6;
    if (this.score >= 100) return 4;
    return 2;
  }

  _getComboHeal() {
    const match = COMBO_HEALS.find((t) => this.combo === t.threshold);
    return match ? match.heal : 0;
  }
}
