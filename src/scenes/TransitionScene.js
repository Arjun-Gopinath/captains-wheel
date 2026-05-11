import Phaser from 'phaser';
import { STAGE_INFO } from '../config/stageInfo.js';

export class TransitionScene extends Phaser.Scene {
  constructor() {
    super('TransitionScene');
  }

  init(data) {
    this._segmentCount = data.segmentCount;
  }

  create() {
    const { width, height } = this.scale;
    const cx   = width  / 2;
    const cy   = height / 2;
    const info = STAGE_INFO[this._segmentCount];

    if (!info) { this._resume(); return; }

    const panelW = 480;
    const lineH  = 28;
    const panelH = 190 + info.lines.length * lineH;
    const px     = cx - panelW / 2;
    const py     = cy - panelH / 2;

    // Dim overlay
    this.add.graphics()
      .fillStyle(0x000000, 0.72)
      .fillRect(0, 0, width, height);

    // Panel
    this.add.graphics()
      .fillStyle(0x071828, 1)
      .fillRoundedRect(px, py, panelW, panelH, 14)
      .lineStyle(2, 0x4488bb, 1)
      .strokeRoundedRect(px, py, panelW, panelH, 14);

    // "NEW STAGE" chip
    this.add.text(cx, py + 28, 'NEW STAGE', {
      fontSize: '13px', color: '#4488bb',
      fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Stage title
    this.add.text(cx, py + 68, info.title, {
      fontSize: '38px', color: '#ffcc00',
      fontFamily: 'serif', fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 4,
    }).setOrigin(0.5);

    // Description lines
    const linesTop = py + 120;
    info.lines.forEach((line, i) => {
      this.add.text(cx, linesTop + i * lineH, line, {
        fontSize: '15px', color: '#dddddd', fontFamily: 'monospace',
      }).setOrigin(0.5);
    });

    // "Got it!" button
    const btn = this.add.text(cx, py + panelH - 34, '  Got it!  ', {
      fontSize: '18px', color: '#ffffff', fontFamily: 'monospace',
      backgroundColor: '#1a5c3a', padding: { x: 22, y: 7 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setBackgroundColor('#22884a'));
    btn.on('pointerout',  () => btn.setBackgroundColor('#1a5c3a'));
    btn.on('pointerdown', this._resume, this);

    this.input.keyboard.on('keydown-SPACE', this._resume, this);
    this.input.keyboard.on('keydown-ENTER', this._resume, this);
  }

  _resume() {
    this.scene.resume('GameScene');
    this.scene.stop();
  }
}
