const CARD_W = 56;
const CARD_H = 76;
const CORNER_R = 8;

export class Obstacle {
  constructor(scene, x, y, targetX, targetY, speed, segment) {
    this.scene = scene;
    this.segment = segment;
    this.alive = true;

    const angle = Math.atan2(targetY - y, targetX - x);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.directionAngle = angle;

    this.x = x;
    this.y = y;

    this.graphics = scene.add.graphics();
    this.label = scene.add.text(x, y, segment.label, {
      fontSize: '28px',
      fontFamily: 'serif',
      color: segment.color === 0xcc2200 ? '#cc2200' : '#eeeeee',
    }).setOrigin(0.5).setDepth(1);

    this._draw();
  }

  update(delta) {
    const dt = delta / 1000;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this._draw();
    this.label.setPosition(this.x, this.y);
  }

  distanceTo(x, y) {
    return Math.hypot(this.x - x, this.y - y);
  }

  destroy() {
    this.graphics.destroy();
    this.label.destroy();
    this.alive = false;
  }

  _draw() {
    this.graphics.clear();

    this.graphics.fillStyle(0xfaf0e6, 1);
    this.graphics.fillRoundedRect(
      this.x - CARD_W / 2, this.y - CARD_H / 2,
      CARD_W, CARD_H, CORNER_R
    );

    this.graphics.lineStyle(3, this.segment.color, 1);
    this.graphics.strokeRoundedRect(
      this.x - CARD_W / 2, this.y - CARD_H / 2,
      CARD_W, CARD_H, CORNER_R
    );
  }
}
