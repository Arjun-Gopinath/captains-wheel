import Phaser from 'phaser';
import { Wheel } from '../entities/Wheel.js';
import { ObstacleManager } from '../managers/ObstacleManager.js';
import { HealthManager } from '../managers/HealthManager.js';
import { ScoreManager } from '../managers/ScoreManager.js';
import { PauseManager } from '../managers/PauseManager.js';
import { UIManager } from '../managers/UIManager.js';
import { FloatingText } from '../entities/FloatingText.js';
import { getActiveSegments } from '../config/segments.js';
import { isMatch } from '../utils/matcher.js';
import { computeObstacleSpeed, computeSpawnInterval, BASE_SPEED, BASE_INTERVAL } from '../utils/speedScaler.js';
import { SettingsManager } from '../managers/SettingsManager.js';
import { drawFelt } from '../utils/drawFelt.js';

const COLLISION_RADIUS = 170;
const MISS_DAMAGE      = 10;
const JOKER_SCORE_GATE = 1000;

const STAGE_NAMES = {
  2: 'COLOUR MATCH',
  4: 'SUIT MATCH',
  6: 'FULL SUITS',
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

    drawFelt(this, width, height);

    this.health    = new HealthManager(100);
    this.scorer    = new ScoreManager();
    this.pauser    = new PauseManager();
    this.settings  = new SettingsManager();
    this.game.sound.mute = !this.settings.musicEnabled;
    this.ui        = new UIManager(this, width);

    const segments = getActiveSegments(this.scorer.getSegmentCount());
    this.wheel     = new Wheel(this, cx, cy, 160, segments);
    this.obstacles = new ObstacleManager(this, cx, cy, width, height);
    this.elapsed   = 0;
    this._gameOver = false;

    this._setupPause(width, height);
    this.events.once('shutdown', this._cleanupPause, this);
  }

  update(_time, delta) {
    if (this._gameOver) return;

    if (this.health.isDead()) {
      this._gameOver = true;
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

  _setupPause(width, height) {
    this._pauseKey1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this._pauseKey2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    this._pauseKey1.on('down', this._onPauseKey, this);
    this._pauseKey2.on('down', this._onPauseKey, this);

    const BTN_PW    = 316;
    const BTN_PH    = 34;
    const btnPanelY = height - BTN_PH - 10;
    const btnCY     = btnPanelY + BTN_PH / 2;
    const cx        = width / 2;

    const btnPanel = this.add.graphics().setDepth(11);
    btnPanel.fillStyle(0x050f05, 0.80);
    btnPanel.fillRoundedRect(cx - BTN_PW / 2, btnPanelY, BTN_PW, BTN_PH, 8);
    btnPanel.lineStyle(1.5, 0xc8a84b, 0.6);
    btnPanel.strokeRoundedRect(cx - BTN_PW / 2, btnPanelY, BTN_PW, BTN_PH, 8);

    // Dividers between the three buttons
    btnPanel.lineStyle(1, 0xc8a84b, 0.22);
    for (const divX of [cx - 52, cx + 52]) {
      btnPanel.beginPath();
      btnPanel.moveTo(divX, btnPanelY + 6);
      btnPanel.lineTo(divX, btnPanelY + BTN_PH - 6);
      btnPanel.strokePath();
    }

    this._pauseBtn = this.add.text(cx - 104, btnCY, '❙❙  PAUSE', {
      fontSize: '13px', color: '#cccccc', fontFamily: 'monospace',
    }).setOrigin(0.5).setDepth(12).setInteractive({ useHandCursor: true });

    this._pauseBtn.on('pointerover', () => this._pauseBtn.setColor('#ffdd44'));
    this._pauseBtn.on('pointerout',  () => this._pauseBtn.setColor('#cccccc'));
    this._pauseBtn.on('pointerdown', this._pauseGame, this);

    this._hintsBtn = this.add.text(cx, btnCY, this._hintsBtnLabel(), {
      fontSize: '13px', color: '#cccccc', fontFamily: 'monospace',
    }).setOrigin(0.5).setDepth(12).setInteractive({ useHandCursor: true });

    this._hintsBtn.on('pointerover', () => this._hintsBtn.setColor('#ffdd44'));
    this._hintsBtn.on('pointerout',  () => this._hintsBtn.setColor('#cccccc'));
    this._hintsBtn.on('pointerdown', () => {
      this.settings.toggle();
      this._hintsBtn.setText(this._hintsBtnLabel());
    });

    this._musicBtn = this.add.text(cx + 104, btnCY, this._musicBtnLabel(), {
      fontSize: '13px', color: '#cccccc', fontFamily: 'monospace',
    }).setOrigin(0.5).setDepth(12).setInteractive({ useHandCursor: true });

    this._musicBtn.on('pointerover', () => this._musicBtn.setColor('#ffdd44'));
    this._musicBtn.on('pointerout',  () => this._musicBtn.setColor('#cccccc'));
    this._musicBtn.on('pointerdown', () => {
      this.settings.toggleMusic();
      this.game.sound.mute = !this.settings.musicEnabled;
      this._musicBtn.setText(this._musicBtnLabel());
    });

    this._onVisibilityChange = () => {
      if (document.hidden && !this._gameOver && !this.pauser.isPaused) {
        this._pauseGame();
      }
    };
    document.addEventListener('visibilitychange', this._onVisibilityChange);

    this.events.on('resume', () => {
      this.pauser.resume();
      this._pauseBtn.setText('❙❙  PAUSE');
    });
  }

  _onPauseKey() {
    if (this.pauser.isPaused) return;
    this._pauseGame();
  }

  _pauseGame() {
    if (this._gameOver || this.pauser.isPaused) return;
    this.pauser.pause();
    this._pauseBtn.setText('▶  RESUME');
    this.scene.pause();
    this.scene.launch('PauseScene');
  }

  _cleanupPause() {
    document.removeEventListener('visibilitychange', this._onVisibilityChange);
  }

  _resolveCollisions(segments) {
    const hits = this.obstacles.getObstaclesWithinRadius(COLLISION_RADIUS);

    for (const obs of hits) {
      if (!obs.alive) continue;

      const segmentIndex  = this.wheel.getSegmentFacing(obs.approachAngle);
      const facingSegment = segments[segmentIndex];
      const matched       = isMatch(facingSegment, obs.segment);
      const hitX          = obs.x;
      const hitY          = obs.y;

      if (matched) {
        const scoreBefore = this.scorer.score;
        const heal        = this.scorer.addMatch();
        const gained      = this.scorer.score - scoreBefore;
        this.health.heal(heal);
        this._onMatch(hitX, hitY, heal, gained);
      } else {
        this.scorer.addMiss();
        this.health.takeDamage(MISS_DAMAGE);
        this._onMiss(hitX, hitY);
      }

      this.obstacles.remove(obs);
      if (this._syncWheelSegments(segments)) break;
    }
  }

  _syncWheelSegments(currentSegments) {
    const next = getActiveSegments(this.scorer.getSegmentCount());
    if (next.length !== currentSegments.length) {
      this.obstacles.clear();
      this.wheel.setSegments(next);
      if (this.settings.hintsEnabled) {
        this.scene.pause();
        this.scene.launch('TransitionScene', { segmentCount: next.length });
      } else {
        this._showStageBanner(next.length);
      }
      return true;
    }
    return false;
  }

  _hintsBtnLabel() {
    return this.settings.hintsEnabled ? 'HINTS: ON' : 'HINTS: OFF';
  }

  _musicBtnLabel() {
    return this.settings.musicEnabled ? '♪ ON' : '♪ OFF';
  }

  _onMatch(x, y, heal, gained) {
    this.cameras.main.flash(120, 0, 180, 0, false);
    new FloatingText(this, x, y, `+${gained}`, '#44ff44');
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
    this._cleanupPause();
    this.obstacles.clear();
    this.wheel.destroy();

    const stored = parseInt(localStorage.getItem('captains-wheel:highscore') || '0', 10);
    if (this.scorer.highScore > stored) {
      localStorage.setItem('captains-wheel:highscore', String(this.scorer.highScore));
    }

    this.scene.start('GameOverScene', {
      score:     this.scorer.score,
      highScore: this.scorer.highScore,
    });
  }

}

