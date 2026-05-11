const CARD_W  = 56;
const CARD_H  = 76;
const CORNER_R = 8;

export class Obstacle {
  constructor(scene, x, y, targetX, targetY, speed, segment, options = {}) {
    this.scene   = scene;
    this.segment = segment;
    this.alive   = true;
    this.elapsed = 0;

    const travelAngle    = Math.atan2(targetY - y, targetX - x);
    this.vx              = Math.cos(travelAngle) * speed;
    this.vy              = Math.sin(travelAngle) * speed;
    this.approachAngle   = Math.atan2(y - targetY, x - targetX);
    this.tilt            = (Math.random() - 0.5) * 0.35;

    this.erratic = options.erratic ?? false;
    if (this.erratic) {
      const spd    = Math.sqrt(this.vx ** 2 + this.vy ** 2);
      this.perpX   = -this.vy / spd;
      this.perpY   =  this.vx / spd;
    }

    this.x = x;
    this.y = y;

    const bgColor   = segment.wildcard ? 0xfff8dc : 0xfaf0e6;
    const textColor = segment.color === 0xcc2200 ? '#cc2200'
                    : segment.wildcard            ? '#ddaa00'
                    : '#111111';

    this.graphics = scene.add.graphics();
    this._bgColor = bgColor;

    this.label = scene.add.text(x, y, segment.label, {
      fontSize:        segment.wildcard ? '32px' : '28px',
      fontFamily:      'serif',
      color:           textColor,
      stroke:          '#ffffff',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(1).setRotation(this.tilt);

    this._draw();
  }

  update(delta) {
    const dt = delta / 1000;
    this.elapsed += dt;

    const wobble = this.erratic ? Math.sin(this.elapsed * 4) * 60 * dt : 0;
    this.x += this.vx * dt + (this.perpX ?? 0) * wobble;
    this.y += this.vy * dt + (this.perpY ?? 0) * wobble;

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

    this.graphics.fillStyle(this._bgColor, 1);
    this.graphics.fillRoundedRect(
      this.x - CARD_W / 2, this.y - CARD_H / 2,
      CARD_W, CARD_H, CORNER_R
    );

    const borderWidth = this.segment.wildcard ? 4 : 3;
    this.graphics.lineStyle(borderWidth, this.segment.color, 1);
    this.graphics.strokeRoundedRect(
      this.x - CARD_W / 2, this.y - CARD_H / 2,
      CARD_W, CARD_H, CORNER_R
    );
  }
}
