import Phaser from 'phaser';

const SEGMENTS = [
  { label: 'RED',   color: 0xcc2200 },
  { label: 'BLACK', color: 0x111111 },
];

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    const { width, height } = this.scale;
    this.cx = width / 2;
    this.cy = height / 2;
    this.wheelRadius = 160;
    this.wheelAngle = 0;

    this.isDragging = false;
    this.lastPointerAngle = 0;

    this.wheel = this.add.graphics();
    this.drawWheel();

    this.input.on('pointerdown', this.onDown, this);
    this.input.on('pointermove', this.onMove, this);
    this.input.on('pointerup',   this.onUp,   this);
  }

  drawWheel() {
    this.wheel.clear();

    const count = SEGMENTS.length;
    const slice = (Math.PI * 2) / count;

    for (let i = 0; i < count; i++) {
      const start = this.wheelAngle + i * slice;
      const end   = start + slice;

      this.wheel.fillStyle(SEGMENTS[i].color, 1);
      this.wheel.beginPath();
      this.wheel.moveTo(this.cx, this.cy);
      this.wheel.arc(this.cx, this.cy, this.wheelRadius, start, end, false);
      this.wheel.closePath();
      this.wheel.fillPath();
    }

    // Rim
    this.wheel.lineStyle(6, 0x8b5e3c, 1);
    this.wheel.strokeCircle(this.cx, this.cy, this.wheelRadius);

    // Center hub
    this.wheel.fillStyle(0x8b5e3c, 1);
    this.wheel.fillCircle(this.cx, this.cy, 18);
  }

  getPointerAngle(x, y) {
    return Math.atan2(y - this.cy, x - this.cx);
  }

  onDown(pointer) {
    const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.cx, this.cy);
    if (dist <= this.wheelRadius + 30) {
      this.isDragging = true;
      this.lastPointerAngle = this.getPointerAngle(pointer.x, pointer.y);
    }
  }

  onMove(pointer) {
    if (!this.isDragging) return;
    const angle = this.getPointerAngle(pointer.x, pointer.y);
    let delta = angle - this.lastPointerAngle;

    // Wrap delta to avoid jumps when crossing ±π boundary
    if (delta > Math.PI)  delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;

    this.wheelAngle += delta;
    this.lastPointerAngle = angle;
    this.drawWheel();
  }

  onUp() {
    this.isDragging = false;
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#0d2137',
  scene: GameScene,
});
