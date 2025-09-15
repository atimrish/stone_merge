export type TCell = number;

export type TCellsRow = TCell[];

export type TCellsTable = TCellsRow[];

export type TFallenCells = Record<string, number>;

export type TLanguage = "ru" | "en";

export type TCoords = {x: number; y: number};

export type TSizes = {
	VMIN: number;
	CELL_HEIGHT: number;
	CELL_GAP: number;
	PADDING_CELLS_BLOCK: number;
	ONE_CELL_WIDTH: number;
	ONE_CELL_HEIGHT: number;
	CELLS_IN_ROW_COUNT: number;
	CELLS_IN_COLUMN_COUNT: number;
};
