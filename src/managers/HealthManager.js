export class HealthManager {
  constructor(maxHp = 100) {
    this.maxHp = maxHp;
    this.hp = maxHp;
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  isDead() {
    return this.hp <= 0;
  }

  getPercent() {
    return this.hp / this.maxHp;
  }
}
