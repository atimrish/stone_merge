import {keyXY} from "@src/shared/lib/keyXY";
import {useGameContext} from "../../model/gameContext";
import {Cell} from "../cell";
import * as s from "./CellsBlock.css";
import {useEffect, useRef} from "react";
import {ONE_CELL_HEIGHT, ONE_CELL_WIDTH, PADDING_CELLS_BLOCK} from "../../config";

export const CellsBlock = () => {
	const {cells, fallen, cellsBlockRef, cellsBlockCoordsRef} = useGameContext();

	useEffect(() => {
		if (cellsBlockRef.current) {
			const {x, y} = cellsBlockRef.current.getBoundingClientRect();
			cellsBlockCoordsRef.current = {x, y};
		}
	}, []);

	return (
		<div className={s.cells_block} ref={cellsBlockRef}>
			{cells.map((row, y) =>
				row.map((cell, x) => {
					const key = keyXY(x, y);
					return <Cell value={cell} x={x} y={y} key={key} fall={fallen[key] ?? 0} />;
				})
			)}
		</div>
	);
};
