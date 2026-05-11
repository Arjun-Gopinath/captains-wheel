const BAR_X        = 16;
const BAR_Y        = 16;
const BAR_W        = 200;
const BAR_H        = 20;
const COMBO_BAR_Y  = BAR_Y + BAR_H + 8;
const COMBO_BAR_H  = 12;

const COMBO_THRESHOLDS = [20, 50, 100];

function comboPct(combo) {
  const nextT = COMBO_THRESHOLDS.find(t => combo < t);
  if (nextT === undefined) return 1;
  const idx   = COMBO_THRESHOLDS.indexOf(nextT);
  const prevT = idx > 0 ? COMBO_THRESHOLDS[idx - 1] : 0;
  return (combo - prevT) / (nextT - prevT);
}

function comboColor(combo) {
  if (combo >= 50) return 0xff8800;
  if (combo >= 20) return 0xffcc00;
  return 0x4488ff;
}

export class UIManager {
  constructor(scene, width) {
    this.scene = scene;

    // Health bar
    this.healthBg = scene.add.graphics().setDepth(10);
    this.healthBg.fillStyle(0x333333, 1);
    this.healthBg.fillRect(BAR_X, BAR_Y, BAR_W, BAR_H);

    this.healthFill = scene.add.graphics().setDepth(11);

    this.healthLabel = scene.add.text(BAR_X + BAR_W + 8, BAR_Y + 2, 'HP', {
      fontSize: '14px', color: '#aaaaaa', fontFamily: 'monospace',
    }).setDepth(11);

    // Combo bar
    this.comboBg = scene.add.graphics().setDepth(10);
    this.comboBg.fillStyle(0x333333, 1);
    this.comboBg.fillRect(BAR_X, COMBO_BAR_Y, BAR_W, COMBO_BAR_H);

    this.comboFill = scene.add.graphics().setDepth(11);

    this.comboLabel = scene.add.text(BAR_X + BAR_W + 8, COMBO_BAR_Y + 1, 'COMBO', {
      fontSize: '11px', color: '#aaaaaa', fontFamily: 'monospace',
    }).setDepth(11);

    this.comboCount = scene.add.text(BAR_X + BAR_W / 2, COMBO_BAR_Y + COMBO_BAR_H / 2, '', {
      fontSize: '11px', color: '#ffffff', fontFamily: 'monospace',
    }).setOrigin(0.5).setDepth(12);

    // Score / high score
    this.scoreText = scene.add.text(width - BAR_X, BAR_Y, 'Score: 0', {
      fontSize: '20px', color: '#ffffff', fontFamily: 'monospace',
    }).setOrigin(1, 0).setDepth(11);

    this.highScoreText = scene.add.text(width - BAR_X, BAR_Y + 26, 'Best: 0', {
      fontSize: '14px', color: '#ffcc00', fontFamily: 'monospace',
    }).setOrigin(1, 0).setDepth(11);
  }

  update(health, scorer) {
    const pct      = health.getPercent();
    const hpColor  = pct > 0.5 ? 0x44cc44 : pct > 0.25 ? 0xccaa00 : 0xcc2200;

    this.healthFill.clear();
    this.healthFill.fillStyle(hpColor, 1);
    this.healthFill.fillRect(BAR_X, BAR_Y, BAR_W * pct, BAR_H);

    this.comboFill.clear();
    if (scorer.combo > 0) {
      this.comboFill.fillStyle(comboColor(scorer.combo), 1);
      this.comboFill.fillRect(BAR_X, COMBO_BAR_Y, BAR_W * comboPct(scorer.combo), COMBO_BAR_H);
    }
    this.comboCount.setText(scorer.combo > 1 ? `×${scorer.combo}` : '');

    this.scoreText.setText(`Score: ${scorer.score}`);
    this.highScoreText.setText(`Best: ${scorer.highScore}`);
  }
}
