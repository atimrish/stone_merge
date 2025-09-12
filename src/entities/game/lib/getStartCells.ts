import {randomNumber} from "@src/shared/lib/randomNumber";
import {TCellsTable} from "../model/types";

export const getStartCells = (): TCellsTable => {
	const cells = Array.from({length: 6}, () => Array.from({length: 6}, () => 0));

	for (let i = 0; i < 2; i++) {
		cells.push(Array.from({length: 6}, () => randomNumber(1, 5)));
	}

	return cells;
};
