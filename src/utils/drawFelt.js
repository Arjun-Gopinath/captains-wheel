export function drawFelt(scene, width, height) {
  const bg = scene.add.graphics().setDepth(-2);

  bg.fillStyle(0x1a5c2e, 1);
  bg.fillRect(0, 0, width, height);

  for (let i = -height; i < width + height; i += 10) {
    bg.lineStyle(1, 0x2d7a42, 0.09);
    bg.beginPath();
    bg.moveTo(i,          0);
    bg.lineTo(i + height, height);
    bg.strokePath();

    bg.lineStyle(1, 0x2d7a42, 0.09);
    bg.beginPath();
    bg.moveTo(i + height, 0);
    bg.lineTo(i,          height);
    bg.strokePath();
  }

  const vig = 70;
  bg.fillStyle(0x000000, 0.28);
  bg.fillRect(0,           0,           vig,   height);
  bg.fillRect(width - vig, 0,           vig,   height);
  bg.fillRect(0,           0,           width, vig);
  bg.fillRect(0,           height - vig, width, vig);

  bg.lineStyle(4,   0xc8a84b, 0.55);
  bg.strokeRoundedRect(18, 18, width - 36, height - 36, 24);
  bg.lineStyle(1.5, 0xc8a84b, 0.28);
  bg.strokeRoundedRect(25, 25, width - 50, height - 50, 20);

  const corners = [
    { sym: '♠', x: 56,         y: 56 },
    { sym: '♥', x: width - 56, y: 56 },
    { sym: '♣', x: 56,         y: height - 56 },
    { sym: '♦', x: width - 56, y: height - 56 },
  ];
  for (const { sym, x, y } of corners) {
    scene.add.text(x, y, sym, {
      fontSize: '54px', color: '#ffffff', fontFamily: 'serif',
    }).setOrigin(0.5).setDepth(-1).setAlpha(0.07);
  }
}
