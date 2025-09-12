import {describe, expect, test} from "@jest/globals";
import {TCell} from "../../model/types";
import {fallStartColumn} from "./fallStartColumn";

describe("fallStartColumn", () => {
	test("падение одного блока", () => {
		const column: TCell[] = [1, 0, 0, 0, 0, 0, 0, 2];
		const result = fallStartColumn(column, 0);

		expect(result).toEqual({
			fallen: {
				"00": 6,
			},
			maxFallen: 6,
		});
	});

	test("падение нескольких блоков #1", () => {
		const column: TCell[] = [2, 0, 0, 0, 0, 1, 0, 2];
		const result = fallStartColumn(column, 0);

		expect(result).toEqual({
			fallen: {
				"05": 1,
				"00": 5,
			},
			maxFallen: 5,
		});
	});

	test("падение нескольких блоков #2", () => {
		const column: TCell[] = [2, 0, 0, 4, 3, 1, 0, 2];
		const result = fallStartColumn(column, 0);

		expect(result).toEqual({
			fallen: {
				"05": 1,
				"04": 1,
				"03": 1,
				"00": 3,
			},
			maxFallen: 3,
		});
	});
});
