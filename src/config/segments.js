export const SEGMENT_STAGES = {
  2: [
    { label: 'RED',   color: 0xcc2200 },
    { label: 'BLACK', color: 0x111111 },
  ],
  4: [
    { label: '♥', color: 0xcc2200 },
    { label: '♦', color: 0xcc2200 },
    { label: '♣', color: 0x111111 },
    { label: '♠', color: 0x111111 },
  ],
  6: [
    { label: '♥ Lo', color: 0xcc2200 },
    { label: '♥ Hi', color: 0xcc2200 },
    { label: '♦',    color: 0xcc2200 },
    { label: '♣',    color: 0x111111 },
    { label: '♠ Lo', color: 0x111111 },
    { label: '♠ Hi', color: 0x111111 },
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

export function getActiveSegments(count) {
  return SEGMENT_STAGES[count] ?? SEGMENT_STAGES[2];
}
