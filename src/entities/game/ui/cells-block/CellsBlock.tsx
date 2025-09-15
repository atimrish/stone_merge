import {keyXY} from "@src/shared/lib/keyXY";
import {useEffect} from "react";
import {useGameContext} from "../../model/gameContext";
import {Cell} from "../cell";
import * as s from "./CellsBlock.css";

export const CellsBlock = () => {
	const {cells, fallen, cellsBlockRef, cellsBlockCoordsRef, startTime} = useGameContext();

	useEffect(() => {
		if (cellsBlockRef.current) {
			const {x, y} = cellsBlockRef.current.getBoundingClientRect();
			cellsBlockCoordsRef.current = {x, y};
		}
	}, [startTime]);

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
