import Phaser from 'phaser';
import { getPointerAngle, getSegmentIndexFacing } from '../utils/angles.js';

const FRET_COLOR  = 0xd4af37;  // gold dividers
const RIM_COLOR   = 0x5c3317;  // dark mahogany
const RIM_LIGHT   = 0x9b6e4a;  // wood outer highlight
const RIM_DARK    = 0x2d1a0a;  // wood inner shadow
const TRACK_COLOR = 0x0d0d1a;  // near-black ball track
const HUB_GOLD    = 0xd4af37;
const HUB_DARK    = 0x0d0d1a;
const HUB_BRIGHT  = 0xffe97c;

const HUB_R      = 20;
const RIM_W      = 24;   // wooden rim thickness
const TRACK_W    = 10;   // ball-track thickness
const SEG_GAP    = 4;    // gap between track and segment area
const HIT_MARGIN = 30;

export class Wheel {
  constructor(scene, x, y, radius, segments) {
    this.scene    = scene;
    this.x        = x;
    this.y        = y;
    this.radius   = radius;
    this.segments = segments;
    this.angle    = 0;

    this.graphics         = scene.add.graphics();
    this._labelObjects    = [];
    this.isDragging       = false;
    this.lastPointerAngle = 0;

    this._initLabels();
    this.draw();
    this._registerInput();
  }

  setSegments(segments) {
    this.segments = segments;
    this._initLabels();
    this.draw();
  }

  getSegmentFacing(directionAngle) {
    return getSegmentIndexFacing(directionAngle, this.angle, this.segments.length);
  }

  draw() {
    this.graphics.clear();

    const count  = this.segments.length;
    const slice  = (Math.PI * 2) / count;
    const segR   = this.radius - RIM_W - TRACK_W - SEG_GAP;
    const labelR = segR * 0.62;

    // --- Colored segments ---
    for (let i = 0; i < count; i++) {
      const start = this.angle + i * slice;

      this.graphics.fillStyle(this.segments[i].color, 1);
      this.graphics.beginPath();
      this.graphics.moveTo(this.x, this.y);
      this.graphics.arc(this.x, this.y, segR, start, start + slice, false);
      this.graphics.closePath();
      this.graphics.fillPath();

      const mid = start + slice / 2;
      if (this._labelObjects[i]) {
        this._labelObjects[i].setPosition(
          this.x + labelR * Math.cos(mid),
          this.y + labelR * Math.sin(mid)
        );
      }
    }

    // --- Gold frets (one per boundary) ---
    this.graphics.lineStyle(2, FRET_COLOR, 0.9);
    for (let i = 0; i < count; i++) {
      const a = this.angle + i * slice;
      this.graphics.beginPath();
      this.graphics.moveTo(
        this.x + HUB_R      * Math.cos(a),
        this.y + HUB_R      * Math.sin(a)
      );
      this.graphics.lineTo(
        this.x + segR * Math.cos(a),
        this.y + segR * Math.sin(a)
      );
      this.graphics.strokePath();
    }

    // Gold pin dots at outer tip of each fret
    this.graphics.fillStyle(FRET_COLOR, 1);
    for (let i = 0; i < count; i++) {
      const a = this.angle + i * slice;
      this.graphics.fillCircle(
        this.x + segR * Math.cos(a),
        this.y + segR * Math.sin(a),
        4
      );
    }

    // --- Thin separator ring ---
    this.graphics.lineStyle(2, 0x000000, 0.7);
    this.graphics.strokeCircle(this.x, this.y, segR + SEG_GAP / 2);

    // --- Ball track ---
    const trackMidR = this.radius - RIM_W - TRACK_W / 2;
    this.graphics.lineStyle(TRACK_W, TRACK_COLOR, 1);
    this.graphics.strokeCircle(this.x, this.y, trackMidR);
    // Subtle inner sheen
    this.graphics.lineStyle(1.5, 0x44447a, 0.45);
    this.graphics.strokeCircle(this.x, this.y, trackMidR - TRACK_W / 2 + 2);

    // --- Wooden rim ---
    const rimMidR = this.radius - RIM_W / 2;
    this.graphics.lineStyle(RIM_W, RIM_COLOR, 1);
    this.graphics.strokeCircle(this.x, this.y, rimMidR);
    this.graphics.lineStyle(3, RIM_LIGHT, 0.55);
    this.graphics.strokeCircle(this.x, this.y, this.radius - 2);
    this.graphics.lineStyle(3, RIM_DARK,  0.65);
    this.graphics.strokeCircle(this.x, this.y, this.radius - RIM_W + 2);

    // --- Gold bullseye hub ---
    this.graphics.fillStyle(HUB_GOLD,   1);
    this.graphics.fillCircle(this.x, this.y, HUB_R + 6);
    this.graphics.fillStyle(HUB_DARK,   1);
    this.graphics.fillCircle(this.x, this.y, HUB_R + 2);
    this.graphics.fillStyle(HUB_GOLD,   1);
    this.graphics.fillCircle(this.x, this.y, HUB_R - 1);
    this.graphics.fillStyle(HUB_BRIGHT, 1);
    this.graphics.fillCircle(this.x, this.y, 5);
  }

  destroy() {
    this._removeInput();
    for (const t of this._labelObjects) if (t) t.destroy();
    this.graphics.destroy();
  }

  _initLabels() {
    for (const t of this._labelObjects) if (t) t.destroy();
    this._labelObjects = this.segments.map(seg =>
      seg.showLabel
        ? this.scene.add.text(0, 0, seg.label, {
            fontSize:        '22px',
            color:           '#ffffff',
            fontFamily:      'serif',
            fontStyle:       'bold',
            stroke:          '#000000',
            strokeThickness: 3,
          }).setOrigin(0.5).setDepth(5)
        : null
    );
  }

  _registerInput() {
    this.scene.input.on('pointerdown', this._onDown, this);
    this.scene.input.on('pointermove', this._onMove, this);
    this.scene.input.on('pointerup',   this._onUp,   this);
  }

  _removeInput() {
    this.scene.input.off('pointerdown', this._onDown, this);
    this.scene.input.off('pointermove', this._onMove, this);
    this.scene.input.off('pointerup',   this._onUp,   this);
  }

  _onDown(pointer) {
    const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.x, this.y);
    if (dist <= this.radius + HIT_MARGIN) {
      this.isDragging       = true;
      this.lastPointerAngle = getPointerAngle(pointer.x, pointer.y, this.x, this.y);
    }
  }

  _onMove(pointer) {
    if (!this.isDragging) return;

    const current = getPointerAngle(pointer.x, pointer.y, this.x, this.y);
    let delta = current - this.lastPointerAngle;

    if (delta >  Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;

    this.angle += delta;
    this.lastPointerAngle = current;
    this.draw();
  }

  _onUp() {
    this.isDragging = false;
  }
}
