import Phaser from 'phaser';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { TransitionScene } from './scenes/TransitionScene.js';

new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#0d3b1a',
  scale: {
    mode:       Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [MenuScene, GameScene, GameOverScene, PauseScene, TransitionScene],
});
