import { Obstacle } from '../entities/Obstacle.js';
import { getEdgeSpawnPoint } from '../utils/angles.js';

const SPAWN_INTERVAL = 2000;
const BASE_SPEED     = 120;
const SPAWN_ANGLE    = 0; // right side only for now (step 2)

export class ObstacleManager {
  constructor(scene, cx, cy, width, height) {
    this.scene    = scene;
    this.cx       = cx;
    this.cy       = cy;
    this.width    = width;
    this.height   = height;
    this.obstacles = [];
    this.timer    = 0;
  }

  update(delta, segments) {
    this.timer += delta;

    if (this.timer >= SPAWN_INTERVAL) {
      this.timer = 0;
      this._spawn(segments);
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

  _spawn(segments) {
    const { x, y } = getEdgeSpawnPoint(SPAWN_ANGLE, this.cx, this.cy, this.width, this.height);
    const segment  = segments[Math.floor(Math.random() * segments.length)];
    this.obstacles.push(
      new Obstacle(this.scene, x, y, this.cx, this.cy, BASE_SPEED, segment)
    );
  }
}
