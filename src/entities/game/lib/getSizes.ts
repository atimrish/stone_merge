import {TSizes} from "../model/types";

export const getSizes = (): TSizes => {
	const VMIN = Math.min(window.innerWidth, window.innerHeight) * 0.01;
	const CELL_HEIGHT = VMIN * (window.innerHeight <= 700 ? 12 : window.innerWidth <= 560 ? 15 : 8);
	const CELL_GAP = 4;
	const PADDING_CELLS_BLOCK = 2 * VMIN;
	const ONE_CELL_WIDTH = (6 * CELL_HEIGHT + 5 * CELL_GAP) / 6;
	const ONE_CELL_HEIGHT = (8 * CELL_HEIGHT + 7 * CELL_GAP) / 8;
	const CELLS_IN_ROW_COUNT = 6;
	const CELLS_IN_COLUMN_COUNT = 8;

	return {
		VMIN,
		CELL_GAP,
		CELL_HEIGHT,
		CELLS_IN_COLUMN_COUNT,
		CELLS_IN_ROW_COUNT,
		ONE_CELL_HEIGHT,
		ONE_CELL_WIDTH,
		PADDING_CELLS_BLOCK,
	};
};
