import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene.js';

new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#0d2137',
  scene: [GameScene],
});
