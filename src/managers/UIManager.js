const BAR_X      = 16;
const BAR_Y      = 16;
const BAR_W      = 200;
const BAR_H      = 20;
const COMBO_MIN  = 5;

export class UIManager {
  constructor(scene, width) {
    this.scene = scene;

    this.healthBg = scene.add.graphics().setDepth(10);
    this.healthBg.fillStyle(0x333333, 1);
    this.healthBg.fillRect(BAR_X, BAR_Y, BAR_W, BAR_H);

    this.healthFill = scene.add.graphics().setDepth(11);

    this.healthLabel = scene.add.text(BAR_X, BAR_Y - 18, 'HP', {
      fontSize: '14px', color: '#aaaaaa',
    }).setDepth(11);

    this.scoreText = scene.add.text(width - BAR_X, BAR_Y, 'Score: 0', {
      fontSize: '20px', color: '#ffffff', fontFamily: 'monospace',
    }).setOrigin(1, 0).setDepth(11);

    this.highScoreText = scene.add.text(width - BAR_X, BAR_Y + 26, 'Best: 0', {
      fontSize: '14px', color: '#ffcc00', fontFamily: 'monospace',
    }).setOrigin(1, 0).setDepth(11);

    this.comboText = scene.add.text(width / 2, BAR_Y, '', {
      fontSize: '18px', color: '#ffcc00', fontFamily: 'monospace',
    }).setOrigin(0.5, 0).setDepth(11);
  }

  update(health, scorer) {
    const pct   = health.getPercent();
    const color = pct > 0.5 ? 0x44cc44 : pct > 0.25 ? 0xccaa00 : 0xcc2200;

    this.healthFill.clear();
    this.healthFill.fillStyle(color, 1);
    this.healthFill.fillRect(BAR_X, BAR_Y, BAR_W * pct, BAR_H);

    this.scoreText.setText(`Score: ${scorer.score}`);
    this.highScoreText.setText(`Best: ${scorer.highScore}`);

    if (scorer.combo >= COMBO_MIN) {
      const fontSize = scorer.combo >= 20 ? '30px' : scorer.combo >= 10 ? '24px' : '20px';
      this.comboText.setFontSize(fontSize);
      this.comboText.setText(`${scorer.combo}× Combo!`);
    } else {
      this.comboText.setText('');
    }
  }
}
