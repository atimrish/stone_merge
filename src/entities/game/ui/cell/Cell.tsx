import {keyXY} from "@src/shared/lib/keyXY";
import {requestAnimationTimeout} from "@src/shared/lib/requestAnimationTimeout";
import React, {useEffect, useRef} from "react";
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
	const {
		cells,
		setCells,
		setFallen,
		maxNumber,
		setMaxNumber,
		setScore,
		cellsBlockCoordsRef,
		boardBlockedRef,
		sizesRef,
	} = useGameContext();

	const cellInnerRef = useRef<HTMLDivElement>(null);
	const touchStartRef = useRef<TCoords>({x: 0, y: 0});
	const lastTouchedCellRef = useRef<{now: TCoords; prev: TCoords}>({
		now: {x: -1, y: -1},
		prev: {x: -1, y: -1},
	});

	let isPicked = false;
	const fallPixels = (sizesRef.current.CELL_HEIGHT + sizesRef.current.CELL_GAP) * p.fall;

	const removeEventListeners = () => {
		document.body.removeEventListener("touchmove", onTouchMove);
		document.body.removeEventListener("mousemove", onMouseMove);
		document.body.removeEventListener("touchend", onTouchEnd);
		document.body.removeEventListener("mouseup", onMouseUp);
	};

	const unsetTransform = () => {
		if (cellInnerRef.current) {
			cellInnerRef.current.style.transform = "translate(0px, 0px)";
		}
	};

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
			eventY,
			sizesRef.current.PADDING_CELLS_BLOCK,
			sizesRef.current.ONE_CELL_WIDTH,
			sizesRef.current.ONE_CELL_HEIGHT
		);

		if (
			targetX < 0 ||
			targetX >= sizesRef.current.CELLS_IN_ROW_COUNT ||
			targetY < 0 ||
			targetY >= sizesRef.current.CELLS_IN_COLUMN_COUNT
		) {
			removeEventListeners();
			unsetTransform();
			return;
		}

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
			const prevX = lastTouchedCellRef.current.prev.x === -1 ? p.x : lastTouchedCellRef.current.prev.x;
			const prevY = lastTouchedCellRef.current.prev.y === -1 ? p.y : lastTouchedCellRef.current.prev.y;

			cells[p.y][p.x] = 0;
			cells[prevY][prevX] = p.value;

			const fallenTargetResult = fallTargetColumn(cells, prevX, prevY);
			const operateColumn = p.x === prevX ? fallenTargetResult.newColumn : cells.map((row) => row[p.x]);
			const fallStartResult = fallStartColumn(operateColumn, p.x);

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

		requestAnimationTimeout(() => {
			unsetTransform();
		}, 150);

		removeEventListeners();
	};

	const onCellUp = (eventX: number, eventY: number) => {
		isPicked = false;

		if (!boardBlockedRef.current) {
			const {x: targetX, y: targetY} = getCoordsOnContainer(
				cellsBlockCoordsRef.current.x,
				cellsBlockCoordsRef.current.y,
				eventX,
				eventY,
				sizesRef.current.PADDING_CELLS_BLOCK,
				sizesRef.current.ONE_CELL_WIDTH,
				sizesRef.current.ONE_CELL_HEIGHT
			);

			if (
				targetX >= 0 &&
				targetX < sizesRef.current.CELLS_IN_ROW_COUNT &&
				targetY >= 0 &&
				targetY < sizesRef.current.CELLS_IN_COLUMN_COUNT
			) {
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
			}
		}

		touchStartRef.current.x = 0;
		touchStartRef.current.y = 0;

		unsetTransform();
		removeEventListeners();
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
			if (isPicked) {
				isPicked = false;
				unsetTransform();
			}

			removeEventListeners();
		};
	}, [cells]);

	return (
		<div className={s.cell} data-value={p.value}>
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
