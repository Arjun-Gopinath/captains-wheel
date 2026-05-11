import Phaser from 'phaser';
import { drawFelt } from '../utils/drawFelt.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data.score     ?? 0;
    this.highScore  = data.highScore ?? 0;
  }

  create() {
    const { width, height } = this.scale;
    const cx = width  / 2;
    const cy = height / 2;

    drawFelt(this, width, height);

    // Panel
    const PW = 360;
    const PH = 240;
    const px = cx - PW / 2;
    const py = cy - PH / 2;

    const panel = this.add.graphics();
    panel.fillStyle(0x050f05, 0.88);
    panel.fillRoundedRect(px, py, PW, PH, 14);
    panel.lineStyle(2, 0xc8a84b, 0.65);
    panel.strokeRoundedRect(px, py, PW, PH, 14);

    this.add.text(cx, py + 40, 'GAME OVER', {
      fontSize:        '46px',
      color:           '#cc2200',
      fontFamily:      'serif',
      fontStyle:       'bold',
      stroke:          '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(cx, py + 110, this.finalScore.toString(), {
      fontSize: '36px', color: '#ffdd44',
      fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(cx, py + 152, `BEST  ${this.highScore}`, {
      fontSize: '14px', color: '#888888', fontFamily: 'monospace',
    }).setOrigin(0.5);

    const restart = this.add.text(cx, py + PH + 32, 'Click or press SPACE to return', {
      fontSize: '15px', color: '#aaaaaa', fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.tweens.add({
      targets:  restart,
      alpha:    0.25,
      duration: 700,
      yoyo:     true,
      repeat:   -1,
    });

    this.input.once('pointerdown', () => this.scene.start('MenuScene'));
    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('MenuScene'));
  }
}
