import {useGameContext} from "../../model/gameContext";
import {CellsBlock} from "../cells-block";
import {GameOverModal} from "../game-over-modal";
import {PauseModal} from "../pause-modal";
import {Scoreboard} from "../scoreboard";
import {StartScreen} from "../start-screen";
import {TimerProgressBar} from "../timer-progress-bar";
import * as s from "./GameContainer.css";

export const GameContainer = () => {
	const {gameOver, paused, started} = useGameContext();

	return (
		<div className={s.container}>
			{started ? (
				<>
					<Scoreboard />
					<TimerProgressBar />
					<CellsBlock />
				</>
			) : (
				<StartScreen />
			)}

			{paused && <PauseModal />}
			{gameOver && <GameOverModal />}
		</div>
	);
};
