import { Obstacle } from '../entities/Obstacle.js';
import { getEdgeSpawnPoint } from '../utils/angles.js';
import { pickRandomAngle } from '../utils/spawner.js';
import { BASE_SPEED, BASE_INTERVAL } from '../utils/speedScaler.js';

export class ObstacleManager {
  constructor(scene, cx, cy, width, height) {
    this.scene     = scene;
    this.cx        = cx;
    this.cy        = cy;
    this.width     = width;
    this.height    = height;
    this.obstacles = [];
    this.timer     = 0;
  }

  update(delta, segments, speed = BASE_SPEED, spawnInterval = BASE_INTERVAL) {
    this.timer += delta;

    if (this.timer >= spawnInterval) {
      this.timer = 0;
      this._spawn(segments, speed);
    }

    for (const obs of this.obstacles) {
      obs.update(delta);
    }
  }

  getObstaclesWithinRadius(radius) {
    return this.obstacles.filter(obs => obs.distanceTo(this.cx, this.cy) <= radius);
  }

  remove(obstacle) {
    obstacle.destroy();
    this.obstacles = this.obstacles.filter(o => o !== obstacle);
  }

  clear() {
    for (const obs of this.obstacles) obs.destroy();
    this.obstacles = [];
  }

  _spawn(segments, speed) {
    const angle    = pickRandomAngle();
    const { x, y } = getEdgeSpawnPoint(angle, this.cx, this.cy, this.width, this.height);
    const segment  = segments[Math.floor(Math.random() * segments.length)];
    this.obstacles.push(
      new Obstacle(this.scene, x, y, this.cx, this.cy, speed, segment)
    );
  }
}
