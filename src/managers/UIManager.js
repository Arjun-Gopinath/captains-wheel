// Left panel (HP + COMBO)
const LP_X   = 10;
const LP_Y   = 10;
const LP_W   = 238;
const LP_H   = 62;
const BAR_X  = 58;   // bars start here; room for left-side labels
const BAR_W  = 168;
const HP_Y   = 22;
const HP_H   = 16;
const CMB_Y  = HP_Y + HP_H + 8;   // 46
const CMB_H  = 10;

// Right panel (Score)
const RP_W   = 158;
const RP_H   = LP_H;

// Shared panel style
const PANEL_BG  = 0x050f05;
const PANEL_A   = 0.80;
const BORDER    = 0xc8a84b;
const BORDER_W  = 1.5;
const BR        = 8;   // border radius

// Combo milestones
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

function drawPanel(gfx, x, y, w, h) {
  gfx.fillStyle(PANEL_BG, PANEL_A);
  gfx.fillRoundedRect(x, y, w, h, BR);
  gfx.lineStyle(BORDER_W, BORDER, 0.6);
  gfx.strokeRoundedRect(x, y, w, h, BR);
}

export class UIManager {
  constructor(scene, width) {
    const RP_X  = width - RP_W - LP_X;
    const RP_CX = RP_X + RP_W / 2;

    // ── Left panel ──────────────────────────────────────────
    const leftGfx = scene.add.graphics().setDepth(9);
    drawPanel(leftGfx, LP_X, LP_Y, LP_W, LP_H);

    // HP bar
    this.healthBg = scene.add.graphics().setDepth(10);
    this.healthBg.fillStyle(0x1a1a1a, 1);
    this.healthBg.fillRect(BAR_X, HP_Y, BAR_W, HP_H);

    this.healthFill = scene.add.graphics().setDepth(11);

    scene.add.text(BAR_X - 6, HP_Y + HP_H / 2, 'HP', {
      fontSize: '12px', color: '#c8a84b',
      fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(1, 0.5).setDepth(11);

    // COMBO bar
    this.comboBg = scene.add.graphics().setDepth(10);
    this.comboBg.fillStyle(0x1a1a1a, 1);
    this.comboBg.fillRect(BAR_X, CMB_Y, BAR_W, CMB_H);

    this.comboFill = scene.add.graphics().setDepth(11);

    scene.add.text(BAR_X - 6, CMB_Y + CMB_H / 2, 'COMBO', {
      fontSize: '9px', color: '#c8a84b',
      fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(1, 0.5).setDepth(11);

    this.comboCount = scene.add.text(BAR_X + BAR_W / 2, CMB_Y + CMB_H / 2, '', {
      fontSize: '9px', color: '#ffffff', fontFamily: 'monospace',
    }).setOrigin(0.5).setDepth(12);

    // ── Right panel ─────────────────────────────────────────
    const rightGfx = scene.add.graphics().setDepth(9);
    drawPanel(rightGfx, RP_X, RP_Y, RP_W, RP_H);

    scene.add.text(RP_CX, RP_Y + 10, 'SCORE', {
      fontSize: '10px', color: '#c8a84b',
      fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5, 0).setDepth(11);

    this.scoreText = scene.add.text(RP_CX, RP_Y + 22, '0', {
      fontSize: '26px', color: '#ffdd44',
      fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5, 0).setDepth(11);

    this.highScoreText = scene.add.text(RP_CX, RP_Y + 50, 'BEST  0', {
      fontSize: '10px', color: '#888888', fontFamily: 'monospace',
    }).setOrigin(0.5, 0).setDepth(11);
  }

  update(health, scorer) {
    const pct     = health.getPercent();
    const hpColor = pct > 0.5 ? 0x44cc44 : pct > 0.25 ? 0xccaa00 : 0xcc2200;

    this.healthFill.clear();
    this.healthFill.fillStyle(hpColor, 1);
    this.healthFill.fillRect(BAR_X, HP_Y, BAR_W * pct, HP_H);

    this.comboFill.clear();
    if (scorer.combo > 0) {
      this.comboFill.fillStyle(comboColor(scorer.combo), 1);
      this.comboFill.fillRect(BAR_X, CMB_Y, BAR_W * comboPct(scorer.combo), CMB_H);
    }
    this.comboCount.setText(scorer.combo > 1 ? `×${scorer.combo}` : '');

    this.scoreText.setText(scorer.score.toString());
    this.highScoreText.setText(`BEST  ${scorer.highScore}`);
  }
}
