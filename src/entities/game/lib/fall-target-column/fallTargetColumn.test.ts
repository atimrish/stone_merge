import {describe, expect, test} from "@jest/globals";
import {TCellsTable} from "../../model/types";
import {fallTargetColumn} from "./fallTargetColumn";

describe("fallTargetColumn", () => {
	test("падение со стаком", () => {
		const cellsOneColumn: TCellsTable = [[1], [0], [0], [0], [0], [0], [1], [2]];

		const result = fallTargetColumn(cellsOneColumn, 0, 0);

		expect(result).toEqual({
			fallen: {
				"00": 6,
			},
			newColumn: [0, 0, 0, 0, 0, 0, 1, 2],
		});
	});

    test("падение без стаков", () => {
		const cellsOneColumn: TCellsTable = [[1], [0], [0], [0], [0], [0], [2], [2]];

		const result = fallTargetColumn(cellsOneColumn, 0, 0);

		expect(result).toEqual({
			fallen: {
				"00": 5,
			},
			newColumn: [0, 0, 0, 0, 0, 0, 2, 2],
		});
	});
});
