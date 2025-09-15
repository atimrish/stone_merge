type TCoords = {
	x: number;
	y: number;
};

export const getCoordsOnContainer = (
	containerX: number,
	containerY: number,
	eventX: number,
	eventY: number,
	PADDING_CELLS_BLOCK: number,
	ONE_CELL_WIDTH: number,
	ONE_CELL_HEIGHT: number
): TCoords => {
	const offsetX = containerX + PADDING_CELLS_BLOCK;
	const offsetY = containerY + PADDING_CELLS_BLOCK;

	const currentPosX = eventX - offsetX;
	const currentPosY = eventY - offsetY;

	return {
		x: Math.floor(currentPosX / ONE_CELL_WIDTH),
		y: Math.floor(currentPosY / ONE_CELL_HEIGHT),
	};
};
