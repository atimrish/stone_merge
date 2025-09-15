import {describe, expect, test} from "@jest/globals";
import {fallTargetColumn} from "../fall-target-column/fallTargetColumn";
import {fallStartColumn} from "../fall-start-column/fallStartColumn";

describe("Интеграция двух функций падения", () => {
	test("Одна и та же колнка #1", () => {
		const oneColumnCells = [[1], [0], [0], [0], [0], [1], [0], [2]];

		const targetResult = fallTargetColumn(oneColumnCells, 0, 0);
		const startResult = fallStartColumn(targetResult.newColumn, 0);

		expect(targetResult).toEqual({
			fallen: {
				"00": 6,
			},
			newColumn: [0, 0, 0, 0, 0, 1, 0, 2],
		});

		expect(startResult).toEqual({
			fallen: {
				"05": 1,
			},
			maxFallen: 1,
		});
	});

	test("Одна и та же колнка #2", () => {
		///TODO: исправить падение
		const oneColumnCells = [[6], [0], [0], [0], [5], [6], [5], [0]];

		const targetResult = fallTargetColumn(oneColumnCells, 0, 0);
		const startResult = fallStartColumn(targetResult.newColumn, 0);

		expect(targetResult).toEqual({
			fallen: {
				"00": 3,
			},
			newColumn: [0, 0, 0, 0, 5, 6, 5, 0],
		});

		expect(startResult).toEqual({
			fallen: {
				"06": 1,
				"05": 1,
				"04": 1,
			},
			maxFallen: 1,
		});
	});

	test("Падение при столкновении с неравной клеткой в той же колонке", () => {
		const startY = 6;
		const startX = 0;
		const prevY = 6;
		const prevX = 0;

		const startValue = 1;

		const cells = [[0], [0], [0], [0], [2], [3], [1], [1]];

		cells[startY][startX] = 0;
		cells[prevY][prevX] = startValue;

		const fallenTargetResult = fallTargetColumn(cells, prevX, prevY);
		const operateColumn = startX === prevX ? fallenTargetResult.newColumn : cells.map((row) => row[startX]);
		const fallStartResult = fallStartColumn(operateColumn, startX);

		const fallenResult = {
			...fallenTargetResult.fallen,
			...fallStartResult.fallen,
		};

		console.log(fallenResult);

		expect(fallenResult).toEqual({
			"06": 1,
			"05": 1,
			"04": 1,
		});
	});
});
