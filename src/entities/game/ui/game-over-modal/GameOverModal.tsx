import { RefreshIcon } from "@src/shared/ui/icons/RefreshIcon";
import {useGameContext} from "../../model/gameContext";
import * as s from "./GameOverModal.css";

export const GameOverModal = () => {
	const {startNewGame} = useGameContext();

	return (
		<div className={s.modal}>
			<div className={s.modal__title}>Игра окончена</div>

			<button className={s.modal__button} onClick={() => startNewGame()}>
				<RefreshIcon/>
			</button>
		</div>
	);
};
