export const VMIN = Math.min(window.innerWidth, window.innerHeight) * 0.01;
export const CELL_HEIGHT = VMIN * (window.innerWidth <= 560 ? 15 : 8);
export const CELL_GAP = 4;
export const PADDING_CELLS_BLOCK = 2 * VMIN;
export const ONE_CELL_WIDTH = (6 * CELL_HEIGHT + 5 * CELL_GAP) / 6;
export const ONE_CELL_HEIGHT = (8 * CELL_HEIGHT + 7 * CELL_GAP) / 8;
export const CELLS_IN_ROW_COUNT = 6;
export const CELLS_IN_COLUMN_COUNT = 8;

export const CELL_UPDATE_TIMER_DURATION = 15_000;

export const LOCAL_STORAGE_KEYS = {
	BEST_SCORE: "stone_merge_best_score",
	LANGUAGE: "stone_merge_language",
};
