import Phaser from 'phaser';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  create() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.65);
    overlay.fillRect(0, 0, width, height);

    this.add.text(cx, cy - 50, 'PAUSED', {
      fontSize:        '52px',
      color:           '#ffffff',
      fontFamily:      'serif',
      fontStyle:       'bold',
      stroke:          '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    const hint = this.add.text(cx, cy + 24, 'Press P, ESC or click to resume', {
      fontSize:   '18px',
      color:      '#aaaaaa',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.tweens.add({
      targets:  hint,
      alpha:    0.3,
      duration: 800,
      yoyo:     true,
      repeat:   -1,
    });

    this.input.keyboard.on('keydown-P',      this._resume, this);
    this.input.keyboard.on('keydown-ESC',    this._resume, this);
    this.input.keyboard.on('keydown-SPACE',  this._resume, this);
    this.input.once('pointerdown',           this._resume, this);
  }

  _resume() {
    this.scene.resume('GameScene');
    this.scene.stop();
  }
}
