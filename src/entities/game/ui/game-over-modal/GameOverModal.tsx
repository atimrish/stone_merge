import { RefreshIcon } from "@src/shared/ui/icons/RefreshIcon";
import {useGameContext} from "../../model/gameContext";
import * as s from "./GameOverModal.css";
import { i18n } from "../../config/i18n";

export const GameOverModal = () => {
	const {startNewGame, language} = useGameContext();

	return (
		<div className={s.modal}>
			<div className={s.modal__title}>{i18n[language].gameOver}</div>

			<button className={s.modal__button} onClick={() => startNewGame()}>
				<RefreshIcon/>
			</button>
		</div>
	);
};
