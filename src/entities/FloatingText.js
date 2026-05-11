export class FloatingText {
  constructor(scene, x, y, text, color = '#ffffff') {
    const obj = scene.add.text(x, y, text, {
      fontSize:        '26px',
      fontFamily:      'monospace',
      fontStyle:       'bold',
      color,
      stroke:          '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(20);

    scene.tweens.add({
      targets:  obj,
      y:        y - 70,
      alpha:    0,
      scaleX:   1.4,
      scaleY:   1.4,
      duration: 900,
      ease:     'Power2',
      onComplete: () => obj.destroy(),
    });
  }
}
