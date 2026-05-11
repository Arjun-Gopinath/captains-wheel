import Phaser from 'phaser';
import { Wheel } from '../entities/Wheel.js';
import { ObstacleManager } from '../managers/ObstacleManager.js';
import { HealthManager } from '../managers/HealthManager.js';
import { ScoreManager } from '../managers/ScoreManager.js';
import { UIManager } from '../managers/UIManager.js';
import { FloatingText } from '../entities/FloatingText.js';
import { getActiveSegments } from '../config/segments.js';
import { isMatch } from '../utils/matcher.js';
import { computeObstacleSpeed, computeSpawnInterval, BASE_SPEED, BASE_INTERVAL } from '../utils/speedScaler.js';

const COLLISION_RADIUS  = 170;
const MISS_DAMAGE       = 10;
const JOKER_SCORE_GATE  = 1000;

const STAGE_NAMES = {
  2: 'COLOUR MATCH',
  4: 'SUIT MATCH',
  6: 'RANK MATCH',
  8: 'MASTER MATCH',
};

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    this._drawOcean(width, height);

    this.health    = new HealthManager(100);
    this.scorer    = new ScoreManager();
    this.ui        = new UIManager(this, width);

    const segments = getActiveSegments(this.scorer.getSegmentCount());
    this.wheel     = new Wheel(this, cx, cy, 160, segments);
    this.obstacles = new ObstacleManager(this, cx, cy, width, height);
    this.elapsed   = 0;
  }

  update(_time, delta) {
    if (this.health.isDead()) {
      this._triggerGameOver();
      return;
    }

    this.elapsed += delta / 1000;
    this.obstacles.jokerEnabled = this.scorer.score >= JOKER_SCORE_GATE;

    const segments      = getActiveSegments(this.scorer.getSegmentCount());
    const speed         = computeObstacleSpeed(BASE_SPEED, this.scorer.score, this.elapsed);
    const spawnInterval = computeSpawnInterval(BASE_INTERVAL, this.scorer.score, this.elapsed);

    this.obstacles.update(delta, segments, speed, spawnInterval);
    this._resolveCollisions(segments);
    this.ui.update(this.health, this.scorer);
  }

  _resolveCollisions(segments) {
    const hits = this.obstacles.getObstaclesWithinRadius(COLLISION_RADIUS);

    for (const obs of hits) {
      const segmentIndex  = this.wheel.getSegmentFacing(obs.approachAngle);
      const facingSegment = segments[segmentIndex];
      const matched       = isMatch(facingSegment, obs.segment);
      const hitX          = obs.x;
      const hitY          = obs.y;

      if (matched) {
        const heal = this.scorer.addMatch();
        this.health.heal(heal);
        this._onMatch(hitX, hitY, heal);
      } else {
        this.scorer.addMiss();
        this.health.takeDamage(MISS_DAMAGE);
        this._onMiss(hitX, hitY);
      }

      this.obstacles.remove(obs);
      this._syncWheelSegments(segments);
    }
  }

  _syncWheelSegments(currentSegments) {
    const next = getActiveSegments(this.scorer.getSegmentCount());
    if (next.length !== currentSegments.length) {
      this.obstacles.clear();
      this.wheel.setSegments(next);
      this._showStageBanner(next.length);
    }
  }

  _onMatch(x, y, heal) {
    this.cameras.main.flash(120, 0, 180, 0, false);
    new FloatingText(this, x, y, `+${this.scorer.combo >= 5 ? this.scorer.score % 100 || 10 : 10}`, '#44ff44');
    if (heal > 0) new FloatingText(this, x, y - 40, `+${heal} HP`, '#88ffcc');
  }

  _onMiss(x, y) {
    this.cameras.main.flash(200, 200, 0, 0, false);
    this.cameras.main.shake(250, 0.008);
    new FloatingText(this, x, y, `-${MISS_DAMAGE} HP`, '#ff4444');
  }

  _showStageBanner(segmentCount) {
    const { width, height } = this.scale;
    const label = STAGE_NAMES[segmentCount] ?? `${segmentCount} SEGMENTS`;

    const text = this.add.text(width / 2, height / 2 - 170, label, {
      fontSize:        '38px',
      color:           '#ffcc00',
      fontFamily:      'serif',
      fontStyle:       'bold',
      stroke:          '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5).setDepth(20);

    this.tweens.add({
      targets:  text,
      y:        height / 2 - 230,
      alpha:    0,
      duration: 2000,
      ease:     'Power2',
      onComplete: () => text.destroy(),
    });
  }

  _triggerGameOver() {
    this.obstacles.clear();
    this.wheel.destroy();
    this.scene.start('GameOverScene', {
      score:     this.scorer.score,
      highScore: this.scorer.highScore,
    });
  }

  _drawOcean(width, height) {
    const bg = this.add.graphics().setDepth(-2);

    bg.fillStyle(0x0a1e36, 1);
    bg.fillRect(0, 0, width, height);

    for (let row = 0; row < 8; row++) {
      const y   = (height / 8) * row + height / 16;
      const alpha = 0.06 + row * 0.03;
      bg.lineStyle(1.5, 0x4488bb, alpha);
      bg.beginPath();
      for (let x = 0; x <= width; x += 8) {
        const waveY = y + Math.sin(x * 0.04 + row) * 6;
        x === 0 ? bg.moveTo(x, waveY) : bg.lineTo(x, waveY);
      }
      bg.strokePath();
    }
  }
}
