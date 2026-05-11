import Phaser from 'phaser';
import { getPointerAngle, getSegmentIndexFacing, normalizeAngle } from '../utils/angles.js';

const RIM_COLOR = 0x8b5e3c;
const HUB_RADIUS = 18;
const HIT_MARGIN = 30;

export class Wheel {
  constructor(scene, x, y, radius, segments) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.segments = segments;
    this.angle = 0;

    this.graphics = scene.add.graphics();
    this.isDragging = false;
    this.lastPointerAngle = 0;

    this.draw();
    this._registerInput();
  }

  setSegments(segments) {
    this.segments = segments;
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
    }

    this.graphics.lineStyle(6, RIM_COLOR, 1);
    this.graphics.strokeCircle(this.x, this.y, this.radius);

    this.graphics.fillStyle(RIM_COLOR, 1);
    this.graphics.fillCircle(this.x, this.y, HUB_RADIUS);
  }

  destroy() {
    this._removeInput();
    this.graphics.destroy();
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
