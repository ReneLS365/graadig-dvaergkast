/*
  v14 GameState scaffold.
  Next Codex task: move runtime globals from src/game/parts into this controlled container.
*/
export function createInitialGameState() {
  return {
    app: { version: 'v14-core-refactor', mode: 'menu', currentSeed: 0, currentMode: 'daily' },
    viewport: { width: 0, height: 0, dpr: 1 },
    run: { score: 0, banked: 0, livePot: 0, multiplier: 1, distance: 0, survived: false, peak: 1, skips: 0 },
    player: { y: 0, vy: 0, hp: 1, inputDown: false },
    world: { track: [], gates: [], coins: [], hazards: [], weaponCrates: [] },
    ui: { activeTab: 'campaign', hudDirty: true }
  };
}
export function resetRunState(gameState) {
  gameState.run = { score: 0, banked: 0, livePot: 0, multiplier: 1, distance: 0, survived: false, peak: 1, skips: 0 };
  gameState.world = { track: [], gates: [], coins: [], hazards: [], weaponCrates: [] };
  gameState.ui.hudDirty = true;
  return gameState;
}
