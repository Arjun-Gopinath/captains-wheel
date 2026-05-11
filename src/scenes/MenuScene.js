import Phaser from 'phaser';
import { drawFelt } from '../utils/drawFelt.js';
import { SettingsManager } from '../managers/SettingsManager.js';

// Decorative wheel constants (mirror Wheel.js proportions)
const WHEEL_R  = 130;
const RIM_W    = 22;
const TRACK_W  = 10;
const SEG_GAP  = 4;
const HUB_R    = 18;
const SEG_R    = WHEEL_R - RIM_W - TRACK_W - SEG_GAP;   // 94
const LABEL_R  = SEG_R * 0.62;

const SPIN_SPEED = 0.00016;   // radians per ms  ≈ slow drift

const SEGMENTS = [
  { color: 0xcc2200, label: '♥' },
  { color: 0xcc2200, label: '♦' },
  { color: 0x111111, label: '♣' },
  { color: 0x111111, label: '♠' },
];

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  preload() {
    this.load.audio('bgm-slow', 'assets/bgm-slow.mp3');
    this.load.audio('bgm-mid',  'assets/bgm-mid.mp3');
    this.load.audio('bgm-fast', 'assets/bgm-fast.mp3');
  }

  create() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    drawFelt(this, width, height);

    // ── Spinning decorative wheel ──────────────────────────
    this._cx    = cx;
    this._cy    = cy;
    this._angle = 0;
    this._wheelGfx = this.add.graphics().setDepth(1);

    this._labels = SEGMENTS.map(seg =>
      this.add.text(0, 0, seg.label, {
        fontSize:        '26px',
        color:           '#ffffff',
        fontFamily:      'serif',
        fontStyle:       'bold',
        stroke:          '#000000',
        strokeThickness: 3,
      }).setOrigin(0.5).setDepth(2)
    );

    // ── Title ──────────────────────────────────────────────
    this.add.text(cx, 46, 'THE WHEEL', {
      fontSize:        '62px',
      color:           '#ffdd44',
      fontFamily:      'serif',
      fontStyle:       'bold',
      stroke:          '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5, 0).setDepth(3);

    this.add.text(cx, 124, 'Match the suit  ·  Beat the house', {
      fontSize:   '15px',
      color:      '#c8a84b',
      fontFamily: 'monospace',
    }).setOrigin(0.5, 0).setDepth(3);

    // ── PLAY button ────────────────────────────────────────
    const BTN_W   = 190;
    const BTN_H   = 46;
    const btnPanX = cx - BTN_W / 2;
    const btnPanY = height - 112;

    const btnPanel = this.add.graphics().setDepth(3);
    btnPanel.fillStyle(0x050f05, 0.82);
    btnPanel.fillRoundedRect(btnPanX, btnPanY, BTN_W, BTN_H, 10);
    btnPanel.lineStyle(2, 0xc8a84b, 0.7);
    btnPanel.strokeRoundedRect(btnPanX, btnPanY, BTN_W, BTN_H, 10);

    const playBtn = this.add.text(cx, btnPanY + BTN_H / 2, '▶   PLAY', {
      fontSize:   '20px',
      color:      '#ffffff',
      fontFamily: 'monospace',
      fontStyle:  'bold',
    }).setOrigin(0.5).setDepth(4).setInteractive({ useHandCursor: true });

    playBtn.on('pointerover', () => playBtn.setStyle({ color: '#ffdd44' }));
    playBtn.on('pointerout',  () => playBtn.setStyle({ color: '#ffffff' }));
    playBtn.on('pointerdown', () => this.scene.start('GameScene'));

    this.tweens.add({
      targets:  playBtn,
      scaleX:   1.05,
      scaleY:   1.05,
      duration: 900,
      yoyo:     true,
      repeat:   -1,
      ease:     'Sine.easeInOut',
    });

    this.input.keyboard.on('keydown-SPACE', () => this.scene.start('GameScene'));
    this.input.keyboard.on('keydown-ENTER', () => this.scene.start('GameScene'));

    // ── High score chip ────────────────────────────────────
    const hs = typeof localStorage !== 'undefined'
      ? parseInt(localStorage.getItem('captains-wheel:highscore') || '0', 10)
      : 0;
    if (hs > 0) {
      this.add.text(cx, height - 52, `BEST  ${hs}`, {
        fontSize:   '13px',
        color:      '#888888',
        fontFamily: 'monospace',
      }).setOrigin(0.5).setDepth(3);
    }

    // ── Music ──────────────────────────────────────────────
    const settings = new SettingsManager();
    this.game.sound.mute = !settings.musicEnabled;

    for (const key of ['bgm-slow', 'bgm-mid', 'bgm-fast']) {
      if (this.cache.audio.exists(key) && !this.sound.get(key)) {
        this.sound.add(key, { loop: true, volume: 0.35 });
      }
    }
    // Stop any track that may be lingering from a previous game, restart slow
    for (const key of ['bgm-mid', 'bgm-fast']) this.sound.get(key)?.stop();
    const slow = this.sound.get('bgm-slow');
    if (slow && !slow.isPlaying) slow.play();
  }

  update(_time, delta) {
    this._angle += delta * SPIN_SPEED;
    this._drawWheel();
    this._positionLabels();
  }

  _drawWheel() {
    const gfx   = this._wheelGfx;
    const cx    = this._cx;
    const cy    = this._cy;
    const count = SEGMENTS.length;
    const slice = (Math.PI * 2) / count;

    gfx.clear();

    // Segments
    for (let i = 0; i < count; i++) {
      const start = this._angle + i * slice;
      gfx.fillStyle(SEGMENTS[i].color, 1);
      gfx.beginPath();
      gfx.moveTo(cx, cy);
      gfx.arc(cx, cy, SEG_R, start, start + slice, false);
      gfx.closePath();
      gfx.fillPath();
    }

    // Gold frets
    gfx.lineStyle(2, 0xd4af37, 0.9);
    for (let i = 0; i < count; i++) {
      const a = this._angle + i * slice;
      gfx.beginPath();
      gfx.moveTo(cx + HUB_R * Math.cos(a), cy + HUB_R * Math.sin(a));
      gfx.lineTo(cx + SEG_R * Math.cos(a), cy + SEG_R * Math.sin(a));
      gfx.strokePath();
    }
    gfx.fillStyle(0xd4af37, 1);
    for (let i = 0; i < count; i++) {
      const a = this._angle + i * slice;
      gfx.fillCircle(cx + SEG_R * Math.cos(a), cy + SEG_R * Math.sin(a), 4);
    }

    // Separator ring
    gfx.lineStyle(2, 0x000000, 0.7);
    gfx.strokeCircle(cx, cy, SEG_R + SEG_GAP / 2);

    // Ball track
    const trackMidR = WHEEL_R - RIM_W - TRACK_W / 2;
    gfx.lineStyle(TRACK_W, 0x0d0d1a, 1);
    gfx.strokeCircle(cx, cy, trackMidR);
    gfx.lineStyle(1.5, 0x44447a, 0.45);
    gfx.strokeCircle(cx, cy, trackMidR - TRACK_W / 2 + 2);

    // Wooden rim
    const rimMidR = WHEEL_R - RIM_W / 2;
    gfx.lineStyle(RIM_W, 0x5c3317, 1);
    gfx.strokeCircle(cx, cy, rimMidR);
    gfx.lineStyle(3, 0x9b6e4a, 0.55);
    gfx.strokeCircle(cx, cy, WHEEL_R - 2);
    gfx.lineStyle(3, 0x2d1a0a, 0.65);
    gfx.strokeCircle(cx, cy, WHEEL_R - RIM_W + 2);

    // Hub
    gfx.fillStyle(0xd4af37, 1);
    gfx.fillCircle(cx, cy, HUB_R + 6);
    gfx.fillStyle(0x0d0d1a, 1);
    gfx.fillCircle(cx, cy, HUB_R + 2);
    gfx.fillStyle(0xd4af37, 1);
    gfx.fillCircle(cx, cy, HUB_R - 1);
    gfx.fillStyle(0xffe97c, 1);
    gfx.fillCircle(cx, cy, 5);
  }

  _positionLabels() {
    const count = SEGMENTS.length;
    const slice = (Math.PI * 2) / count;
    for (let i = 0; i < count; i++) {
      const mid = this._angle + i * slice + slice / 2;
      this._labels[i].setPosition(
        this._cx + LABEL_R * Math.cos(mid),
        this._cy + LABEL_R * Math.sin(mid)
      );
    }
  }
}
