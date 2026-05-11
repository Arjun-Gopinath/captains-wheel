import { Obstacle } from '../entities/Obstacle.js';
import { JOKER_SEGMENT } from '../config/segments.js';
import { getEdgeSpawnPoint } from '../utils/angles.js';
import { pickRandomAngle } from '../utils/spawner.js';
import { BASE_SPEED, BASE_INTERVAL } from '../utils/speedScaler.js';

const JOKER_CHANCE = 0.15;
const JOKER_SPEED_MULT = 1.4;

export class ObstacleManager {
  constructor(scene, cx, cy, width, height) {
    this.scene        = scene;
    this.cx           = cx;
    this.cy           = cy;
    this.width        = width;
    this.height       = height;
    this.obstacles    = [];
    this.timer        = 0;
    this.jokerEnabled = false;
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

    const spawnJoker = this.jokerEnabled && Math.random() < JOKER_CHANCE;
    const segment    = spawnJoker ? JOKER_SEGMENT : segments[Math.floor(Math.random() * segments.length)];
    const finalSpeed = spawnJoker ? speed * JOKER_SPEED_MULT : speed;

    this.obstacles.push(
      new Obstacle(this.scene, x, y, this.cx, this.cy, finalSpeed, segment, { erratic: spawnJoker })
    );
  }
}
