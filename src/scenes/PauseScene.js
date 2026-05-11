import Phaser from 'phaser';

const COUNTDOWN = ['3', '2', '1', 'GO!'];

export class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  create() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    this._counting = false;

    this._overlay = this.add.graphics();
    this._overlay.fillStyle(0x000000, 0.65);
    this._overlay.fillRect(0, 0, width, height);

    this._pausedText = this.add.text(cx, cy - 50, 'PAUSED', {
      fontSize:        '52px',
      color:           '#ffffff',
      fontFamily:      'serif',
      fontStyle:       'bold',
      stroke:          '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this._hint = this.add.text(cx, cy + 24, 'Press P, ESC or click to resume', {
      fontSize:   '18px',
      color:      '#aaaaaa',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this._hintTween = this.tweens.add({
      targets:  this._hint,
      alpha:    0.3,
      duration: 800,
      yoyo:     true,
      repeat:   -1,
    });

    this.input.keyboard.on('keydown-P',     this._startResume, this);
    this.input.keyboard.on('keydown-ESC',   this._startResume, this);
    this.input.keyboard.on('keydown-SPACE', this._startResume, this);
    this.input.once('pointerdown',          this._startResume, this);
  }

  _startResume() {
    if (this._counting) return;
    this._counting = true;

    this.input.keyboard.off('keydown-P',     this._startResume, this);
    this.input.keyboard.off('keydown-ESC',   this._startResume, this);
    this.input.keyboard.off('keydown-SPACE', this._startResume, this);

    this._hintTween.stop();
    this._pausedText.setVisible(false);
    this._hint.setVisible(false);

    this._runCountdown(0);
  }

  _runCountdown(index) {
    if (index >= COUNTDOWN.length) {
      this.scene.resume('GameScene');
      this.scene.stop();
      return;
    }

    const { width, height } = this.scale;
    const label  = COUNTDOWN[index];
    const isGo   = label === 'GO!';

    const text = this.add.text(width / 2, height / 2, label, {
      fontSize:        isGo ? '64px' : '72px',
      color:           isGo ? '#44ff44' : '#ffffff',
      fontFamily:      'serif',
      fontStyle:       'bold',
      stroke:          '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5).setScale(1.4);

    this.tweens.add({
      targets:  text,
      scaleX:   0.6,
      scaleY:   0.6,
      alpha:    0,
      duration: isGo ? 600 : 850,
      ease:     'Power2',
      onComplete: () => {
        text.destroy();
        this._runCountdown(index + 1);
      },
    });
  }
}
