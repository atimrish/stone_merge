import {createContext, RefObject, useContext} from "react";
import {TCellsTable, TCoords, TFallenCells, TLanguage} from "./types";

interface IGameContext {
	cells: TCellsTable;
	setCells: React.Dispatch<React.SetStateAction<TCellsTable>>;

	fallen: TFallenCells;
	setFallen: React.Dispatch<React.SetStateAction<TFallenCells>>;

	maxNumber: number;
	setMaxNumber: React.Dispatch<React.SetStateAction<number>>;

	gameOver: boolean;
	setGameOver: React.Dispatch<React.SetStateAction<boolean>>;

	startTime: number;
	setStartTime: React.Dispatch<React.SetStateAction<number>>;

	score: number;
	setScore: React.Dispatch<React.SetStateAction<number>>;

	bestScore: number;
	setBestScore: React.Dispatch<React.SetStateAction<number>>;

	paused: boolean;
	setPaused: React.Dispatch<React.SetStateAction<boolean>>;

	language: TLanguage;
	setLanguage: React.Dispatch<React.SetStateAction<TLanguage>>;

	started: boolean;
	setStarted: React.Dispatch<React.SetStateAction<boolean>>;

	cellsBlockRef: RefObject<HTMLDivElement | null>;
	cellsBlockCoordsRef: RefObject<TCoords>;
	boardBlockedRef: RefObject<boolean>;

	pushRowAtBottom: () => void;
	startNewGame: () => void;
}

export const GameContext = createContext<IGameContext | undefined>(undefined);

export const useGameContext = (): IGameContext => {
	const context = useContext(GameContext);

	if (context === undefined) {
		throw new Error("Game context is undefined");
	}

	return context;
};
