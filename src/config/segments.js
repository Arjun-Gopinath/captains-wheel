export const SEGMENT_STAGES = {
  2: [
    { label: 'RED',   color: 0xcc2200, showLabel: false },
    { label: 'BLACK', color: 0x111111, showLabel: false },
  ],
  4: [
    { label: '♥', color: 0xcc2200, showLabel: true },
    { label: '♦', color: 0xcc2200, showLabel: true },
    { label: '♣', color: 0x111111, showLabel: true },
    { label: '♠', color: 0x111111, showLabel: true },
  ],
  6: [
    { label: '♥ Lo', color: 0xcc2200, showLabel: true },
    { label: '♥ Hi', color: 0xcc2200, showLabel: true },
    { label: '♦',    color: 0xcc2200, showLabel: true },
    { label: '♣',    color: 0x111111, showLabel: true },
    { label: '♠ Lo', color: 0x111111, showLabel: true },
    { label: '♠ Hi', color: 0x111111, showLabel: true },
  ],
  8: [
    { label: '♥ Lo', color: 0xcc2200 },
    { label: '♥ Hi', color: 0xcc2200 },
    { label: '♦ Lo', color: 0xcc2200 },
    { label: '♦ Hi', color: 0xcc2200 },
    { label: '♣ Lo', color: 0x111111 },
    { label: '♣ Hi', color: 0x111111 },
    { label: '♠ Lo', color: 0x111111 },
    { label: '♠ Hi', color: 0x111111 },
  ],
};

export const JOKER_SEGMENT = { label: '★', color: 0xddaa00, wildcard: true };

export function getActiveSegments(count) {
  return SEGMENT_STAGES[count] ?? SEGMENT_STAGES[2];
}
