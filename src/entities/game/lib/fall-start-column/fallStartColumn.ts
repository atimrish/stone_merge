import {keyXY} from "@src/shared/lib/keyXY";
import {TCell, TFallenCells} from "@src/entities/game/model/types";

type TFallenStartColumnResult = {
	fallen: TFallenCells,
	maxFallen: number
}

/**
 * Метод работает с изначальной колонкой, а не с целевой и не занимается стаками
 * @param column 
 * @param x 
 * @returns 
 */
export const fallStartColumn = (column: TCell[], x: number): TFallenStartColumnResult => {
	let fallIndex = 0;
	let maxFallen = 0;
	const fallen: TFallenCells = {};

	for (let y = column.length - 1; y >= 0; y--) {
		if (column[y] === 0) {
			fallIndex++;
		} else if (fallIndex > 0) {
			fallen[keyXY(x, y)] = fallIndex;
			maxFallen = fallIndex
		}
	}

	return {fallen, maxFallen};
};
