import Phaser from 'phaser';
import { getPointerAngle, getSegmentIndexFacing } from '../utils/angles.js';

const RIM_COLOR  = 0x8b5e3c;
const HUB_RADIUS = 18;
const HIT_MARGIN = 30;
const LABEL_R    = 0.62;

export class Wheel {
  constructor(scene, x, y, radius, segments) {
    this.scene    = scene;
    this.x        = x;
    this.y        = y;
    this.radius   = radius;
    this.segments = segments;
    this.angle    = 0;

    this.graphics       = scene.add.graphics();
    this._labelObjects  = [];
    this.isDragging     = false;
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

    const count = this.segments.length;
    const slice = (Math.PI * 2) / count;

    for (let i = 0; i < count; i++) {
      const start = this.angle + i * slice;

      this.graphics.fillStyle(this.segments[i].color, 1);
      this.graphics.beginPath();
      this.graphics.moveTo(this.x, this.y);
      this.graphics.arc(this.x, this.y, this.radius, start, start + slice, false);
      this.graphics.closePath();
      this.graphics.fillPath();

      const midAngle = start + slice / 2;
      const labelDist = this.radius * LABEL_R;
      if (this._labelObjects[i]) {
        this._labelObjects[i].setPosition(
          this.x + labelDist * Math.cos(midAngle),
          this.y + labelDist * Math.sin(midAngle)
        );
      }
    }

    // Spokes — one per segment boundary
    const spokeCount = this.segments.length;
    this.graphics.lineStyle(4, RIM_COLOR, 0.85);
    for (let i = 0; i < spokeCount; i++) {
      const a = this.angle + i * ((Math.PI * 2) / spokeCount);
      this.graphics.beginPath();
      this.graphics.moveTo(
        this.x + HUB_RADIUS * Math.cos(a),
        this.y + HUB_RADIUS * Math.sin(a)
      );
      this.graphics.lineTo(
        this.x + this.radius * Math.cos(a),
        this.y + this.radius * Math.sin(a)
      );
      this.graphics.strokePath();
    }

    this.graphics.lineStyle(6, RIM_COLOR, 1);
    this.graphics.strokeCircle(this.x, this.y, this.radius);

    this.graphics.fillStyle(RIM_COLOR, 1);
    this.graphics.fillCircle(this.x, this.y, HUB_RADIUS);
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
      this.isDragging = true;
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
