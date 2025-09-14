import {keyXY} from "@src/shared/lib/keyXY";
import React, {useEffect, useRef} from "react";
import {CELL_GAP, CELL_HEIGHT, CELLS_IN_COLUMN_COUNT, CELLS_IN_ROW_COUNT} from "../../config";
import {fallStartColumn} from "../../lib/fall-start-column/fallStartColumn";
import {fallTargetColumn} from "../../lib/fall-target-column/fallTargetColumn";
import {getColorByValue} from "../../lib/getColorByValue";
import {getCoordsOnContainer} from "../../lib/getCoordsOnContainer";
import {useGameContext} from "../../model/gameContext";
import {TCoords} from "../../model/types";
import * as s from "./Cell.css";

type CellProps = {
	value: number;
	x: number;
	y: number;
	fall: number;
};

export const Cell = (p: CellProps) => {
	const {cells, setCells, setFallen, maxNumber, setMaxNumber, setScore, cellsBlockCoordsRef, boardBlockedRef} =
		useGameContext();

	const cellInnerRef = useRef<HTMLDivElement>(null);
	const touchStartRef = useRef<TCoords>({x: 0, y: 0});
	const lastTouchedCellRef = useRef<{now: TCoords; prev: TCoords}>({
		now: {x: -1, y: -1},
		prev: {x: -1, y: -1},
	});

	let isPicked = false;

	const fallPixels = (CELL_HEIGHT + CELL_GAP) * p.fall;

	const onCellMove = (eventX: number, eventY: number) => {
		isPicked = true;

		if (cellInnerRef.current) {
			const x = eventX - touchStartRef.current.x;
			const y = eventY - touchStartRef.current.y;
			cellInnerRef.current.style.transform = `translate(${x}px, ${y}px)`;
		}

		if (boardBlockedRef.current) return;

		const {x: targetX, y: targetY} = getCoordsOnContainer(
			cellsBlockCoordsRef.current.x,
			cellsBlockCoordsRef.current.y,
			eventX,
			eventY
		);

		if (targetX < 0 || targetX >= CELLS_IN_ROW_COUNT || targetY < 0 || targetY >= CELLS_IN_COLUMN_COUNT) return;

		const value = cells[targetY][targetX];

		//храним прошлую точку, где мы были
		if (lastTouchedCellRef.current.now.x !== targetX || lastTouchedCellRef.current.now.y !== targetY) {
			lastTouchedCellRef.current.prev.x = lastTouchedCellRef.current.now.x;
			lastTouchedCellRef.current.prev.y = lastTouchedCellRef.current.now.y;
			lastTouchedCellRef.current.now.x = targetX;
			lastTouchedCellRef.current.now.y = targetY;
		}

		//проверка на пустую клетку или ту же самую

		if (value === 0 || (targetX === p.x && targetY === p.y)) return;

		let fallenResult;
		let maxValue = -1;
		let addedScore = 0;

		if (value === p.value) {
			cells[targetY][targetX]++;
			cells[p.y][p.x] = 0;
			addedScore += cells[targetY][targetX];

			if (cells[targetY][targetX] > maxNumber) {
				maxValue = cells[targetY][targetX];
			}

			const startColumn = cells.map((row) => row[p.x]);
			fallenResult = fallStartColumn(startColumn, p.x).fallen;
		} else {
			//стукаемся о другую клетку с значением
			const prevX = lastTouchedCellRef.current.prev.x;
			const prevY = lastTouchedCellRef.current.prev.y;

			cells[p.y][p.x] = 0;
			cells[prevY][prevX] = p.value;

			const startColumn = cells.map((row) => row[p.x]);

			const fallenTargetResult = fallTargetColumn(cells, prevX, prevY);
			const fallStartResult = fallStartColumn(startColumn, p.x);

			fallenResult = {
				...fallenTargetResult.fallen,
				...fallStartResult.fallen,
			};
		}

		if (maxValue > 0) {
			setMaxNumber(maxValue);
		}
		setScore((prev) => prev + addedScore);
		setFallen(fallenResult);
		setCells([...cells]);

		//очищаем обработчики событий
		document.body.removeEventListener("touchmove", onTouchMove);
		document.body.removeEventListener("touchend", onTouchEnd);
		document.body.removeEventListener("mousemove", onMouseMove);
		document.body.removeEventListener("mouseup", onMouseUp);
	};

	const onCellUp = (eventX: number, eventY: number) => {
		isPicked = false;

		if (boardBlockedRef.current) return;

		const {x: targetX, y: targetY} = getCoordsOnContainer(
			cellsBlockCoordsRef.current.x,
			cellsBlockCoordsRef.current.y,
			eventX,
			eventY
		);

		if (targetX < 0 || targetX >= CELLS_IN_ROW_COUNT || targetY < 0 || targetY >= CELLS_IN_COLUMN_COUNT) return;

		if (cells[targetY][targetX] === 0) {
			//очищаем точку из которой брали и ставив в целевую точку
			cells[p.y][p.x] = 0;
			cells[targetY][targetX] = p.value;

			let fallenResult = fallTargetColumn(cells, targetX, targetY);
			let startFallenCells;

			if (p.x === targetX) {
				startFallenCells = fallStartColumn(fallenResult.newColumn, p.x);
				fallenResult.fallen[keyXY(targetX, targetY)] += startFallenCells.maxFallen;
			} else {
				const startColumn = cells.map((row) => row[p.x]);
				startFallenCells = fallStartColumn(startColumn, p.x);
			}

			fallenResult.fallen = {...fallenResult.fallen, ...startFallenCells.fallen};

			setFallen(fallenResult.fallen);
			setCells([...cells]);
		}

		if (cellInnerRef.current) {
			cellInnerRef.current.style.transform = "translate(0px, 0px)";
		}

		touchStartRef.current.x = 0;
		touchStartRef.current.y = 0;

		document.body.removeEventListener("touchmove", onTouchMove);
		document.body.removeEventListener("touchend", onTouchEnd);
		document.body.removeEventListener("mousemove", onMouseMove);
		document.body.removeEventListener("mouseup", onMouseUp);
	};

	const onMouseUp = (e: MouseEvent) => {
		onCellUp(e.clientX, e.clientY);
	};

	const onMouseMove = (e: MouseEvent) => {
		onCellMove(e.clientX, e.clientY);
	};

	const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		isPicked = true;
		touchStartRef.current.x = e.clientX;
		touchStartRef.current.y = e.clientY;

		document.body.addEventListener("mousemove", onMouseMove);
		document.body.addEventListener("mouseup", onMouseUp);
	};

	const onTouchEnd = (e: TouchEvent) => {
		onCellUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
	};

	const onTouchMove = (e: TouchEvent) => {
		onCellMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
	};

	const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
		isPicked = true;
		touchStartRef.current.x = e.changedTouches[0].clientX;
		touchStartRef.current.y = e.changedTouches[0].clientY;

		document.body.addEventListener("touchmove", onTouchMove);
		document.body.addEventListener("touchend", onTouchEnd);
	};

	useEffect(() => {
		return () => {
			if (isPicked && cellInnerRef.current) {
				isPicked = false;
				cellInnerRef.current.style.transform = "translate(0px, 0px)";
			}

			document.body.removeEventListener("mousemove", onMouseMove);
			document.body.removeEventListener("mouseup", onMouseUp);
			document.body.removeEventListener("touchmove", onTouchMove);
			document.body.removeEventListener("touchend", onTouchEnd);
		};
	}, [cells]);

	return (
		<div className={s.cell} data-value={p.value} data-x={p.x} data-y={p.y} data-droppable="true">
			<div
				className={s.cell_inner}
				ref={cellInnerRef}
				style={{
					backgroundColor: getColorByValue(p.value),
					transform: `translate(0px, ${fallPixels}px)`,
					transitionDuration: p.fall !== 0 ? "150ms" : "",
				}}
				onMouseDown={onMouseDown}
				onTouchStart={onTouchStart}>
				{p.value}
			</div>
		</div>
	);
};
