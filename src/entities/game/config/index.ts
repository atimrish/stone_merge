export const CELL_HEIGHT = Math.min(window.innerWidth, window.innerHeight) * (window.innerWidth <= 560 ? 0.15 : 0.08);
export const CELL_GAP = 4;
export const CELL_UPDATE_TIMER_DURATION = 15_000

export const LOCAL_STORAGE_KEYS = {
    BEST_SCORE: 'stone_merge_best_score',
    LANGUAGE: 'stone_merge_language'
}