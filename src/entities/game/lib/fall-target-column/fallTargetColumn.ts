import {keyXY} from "@src/shared/lib/keyXY";
import {TCell, TCellsTable, TFallenCells} from "@src/entities/game/model/types";

type TFallTargetColumnResult = {
	fallen: TFallenCells;
	newColumn: TCell[];
};

export const fallTargetColumn = (cells: TCellsTable, x: number, y: number): TFallTargetColumnResult => {
	const newColumn = cells.map((row) => row[x]);
	const startCell = newColumn[y];
	newColumn[y] = 0;
	let fallIndex = 0;
	let isStacked = false;

	for (let fallY = y + 1; fallY < newColumn.length; fallY++) {
		if (newColumn[fallY] === 0) {
			fallIndex++;
		} else if (startCell === newColumn[fallY] && !isStacked) {
			isStacked = true;
			fallIndex++;
		} else {
			break;
		}
	}

	const fallen = {[keyXY(x, y)]: fallIndex};

	return {fallen, newColumn};
};
