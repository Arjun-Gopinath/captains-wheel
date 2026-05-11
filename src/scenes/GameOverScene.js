import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data.score ?? 0;
    this.highScore  = data.highScore ?? 0;
  }

  create() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    this.add.text(cx, cy - 80, 'GAME OVER', {
      fontSize: '48px', color: '#cc2200', fontFamily: 'serif',
    }).setOrigin(0.5);

    this.add.text(cx, cy, `Score: ${this.finalScore}`, {
      fontSize: '28px', color: '#ffffff', fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.add.text(cx, cy + 44, `Best: ${this.highScore}`, {
      fontSize: '22px', color: '#ffcc00', fontFamily: 'monospace',
    }).setOrigin(0.5);

    const restart = this.add.text(cx, cy + 120, '[ Click to Play Again ]', {
      fontSize: '20px', color: '#aaaaaa', fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: restart,
      alpha: 0.2,
      duration: 700,
      yoyo: true,
      repeat: -1,
    });

    this.input.once('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}
