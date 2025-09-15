import {keyXY} from "@src/shared/lib/keyXY";
import {randomNumber} from "@src/shared/lib/randomNumber";
import {requestAnimationTimeout} from "@src/shared/lib/requestAnimationTimeout";
import {PropsWithChildren, useEffect, useRef, useState} from "react";
import {LOCAL_STORAGE_KEYS} from "../../config";
import {getStartCells} from "../../lib/getStartCells";
import {GameContext} from "../../model/gameContext";
import {TCellsTable, TCoords, TFallenCells, TLanguage, TSizes} from "../../model/types";
import {getSizes} from "../../lib/getSizes";

const initBestScore = () => {
	const localBestScore = localStorage.getItem(LOCAL_STORAGE_KEYS.BEST_SCORE);
	return localBestScore ? Number(localBestScore) : 0;
};

const initLanguage = (): TLanguage => {
	// const ysdkLanguage = window.ysdk.environment.i18n.lang as TLanguage;
	// const localLanguage = localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) as TLanguage | undefined;
	// return localLanguage ?? ["en", "ru"].includes(ysdkLanguage) ? ysdkLanguage : "ru";

	return 'ru'
};

const initSizes = getSizes();

export const GameProvider = (p: PropsWithChildren) => {
	const [cells, setCells] = useState<TCellsTable>(getStartCells);
	const [fallen, setFallen] = useState<TFallenCells>({});
	const [maxNumber, setMaxNumber] = useState(5);
	const [gameOver, setGameOver] = useState(false);
	const [startTime, setStartTime] = useState(Date.now);
	const [score, setScore] = useState(0);
	const [bestScore, setBestScore] = useState(initBestScore);
	const [paused, setPaused] = useState(false);
	const [language, setLanguage] = useState<TLanguage>(initLanguage);
	const [started, setStarted] = useState(false);
	const [isFirstStarted, setIsFirstStarted] = useState(false);

	const cellsBlockRef = useRef<HTMLDivElement>(null);
	const cellsBlockCoordsRef = useRef<TCoords>({x: 0, y: 0});
	const boardBlockedRef = useRef<boolean>(false);
	const upPhaseRef = useRef(false);
	const sizesRef = useRef<TSizes>(initSizes);

	useEffect(() => {
		const resizeObserver = new ResizeObserver(() => {
			sizesRef.current = getSizes();
		});

		resizeObserver.observe(document.body);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	useEffect(() => {
		//сортировка по убыванию по оси y
		const keys = Object.keys(fallen).sort(upPhaseRef.current ? (a, b) => +a[1] - +b[1] : (a, b) => +b[1] - +a[1]);
		let maxValue = maxNumber;
		let addedScore = 0;

		if (keys.length === 0) return;

		keys.forEach((key) => {
			const x = +key[0];
			const y = +key[1];

			const fallIndex = fallen[key];
			if (fallIndex === 0) return;

			if (cells[y + fallIndex][x] === cells[y][x]) {
				cells[y + fallIndex][x]++;
				cells[y][x] = 0;

				addedScore += cells[y + fallIndex][x];

				if (cells[y + fallIndex][x] > maxValue) {
					maxValue = cells[y + fallIndex][x];
				}
			} else if (cells[y + fallIndex][x] === 0) {
				cells[y + fallIndex][x] = cells[y][x];
				cells[y][x] = 0;
			}
		});

		if (upPhaseRef.current) {
			const newRow = Array.from({length: 6}, () => randomNumber(1, maxNumber));

			for (let x = 0; x < cells[cells.length - 1].length; x++) {
				cells[cells.length - 1][x] = newRow[x];
			}
		}

		requestAnimationTimeout(() => {
			upPhaseRef.current = false;
			boardBlockedRef.current = false;

			setScore((prev) => prev + addedScore);
			setCells([...cells]);
			setFallen({});
			setMaxNumber(maxValue);
		}, 150);
	}, [fallen, cells, maxNumber]);

	useEffect(() => {
		if (score > bestScore) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.BEST_SCORE, score.toString());
			setBestScore(score);
		}
	}, [score]);

	// useEffect(() => {
	// 	//проверка, что был первый запуск
	// 	if (isFirstStarted) {
	// 		if (started && !paused && !gameOver) {
	// 			window.ysdk.features.GameplayAPI.start();
	// 		} else {
	// 			window.ysdk.features.GameplayAPI.stop();
	// 		}
	// 	}
	// }, [started, paused, gameOver, isFirstStarted]);

	const pushRowAtBottom = () => {
		//если верхняя строка пустая
		if (cells[0].every((cell) => cell === 0)) {
			upPhaseRef.current = true;
			const newFallen: TFallenCells = {};

			cells.forEach((row, y) => {
				row.forEach((cell, x) => {
					if (cell !== 0) {
						newFallen[keyXY(x, y)] = -1;
					}
				});
			});
			setFallen(newFallen);
		} else {
			setGameOver(true);
		}
	};

	const startNewGame = () => {
		setCells(getStartCells());
		setFallen({});
		setGameOver(false);
		setMaxNumber(5);
		setStartTime(Date.now());
		setScore(0);
		setPaused(false);
		setStarted(true);
		setIsFirstStarted(true);
		boardBlockedRef.current = false;
	};

	return (
		<GameContext.Provider
			value={{
				cells,
				setCells,
				fallen,
				setFallen,
				maxNumber,
				setMaxNumber,
				gameOver,
				setGameOver,
				startTime,
				setStartTime,
				score,
				setScore,
				bestScore,
				setBestScore,
				paused,
				setPaused,
				language,
				setLanguage,
				started,
				setStarted,
				pushRowAtBottom,
				startNewGame,
				cellsBlockRef,
				cellsBlockCoordsRef,
				boardBlockedRef,
				sizesRef,
			}}>
			{p.children}
		</GameContext.Provider>
	);
};
