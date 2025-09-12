import {RefreshIcon} from "@src/shared/ui/icons/RefreshIcon";
import * as s from "./PauseModal.css";
import {PlayIcon} from "@src/shared/ui/icons/PlayIcon";
import {useGameContext} from "../../model/gameContext";
import {TLanguage} from "../../model/types";
import {i18n} from "../../config/i18n";

export const PauseModal = () => {
	const {startNewGame, setPaused, setLanguage, language} = useGameContext();

	return (
		<div className={s.modal}>
			<div className={s.modal__title}>{i18n[language].pause}</div>

			<div className={s.modal__button_container}>
				<button className={s.modal__button} onClick={() => setPaused(false)}>
					<PlayIcon />
				</button>

				<button className={s.modal__button} onClick={() => startNewGame()}>
					<RefreshIcon />
				</button>

				<select className={s.modal__select} onChange={(e) => setLanguage(e.target.value as TLanguage)}>
					<option value="ru">🇷🇺</option>
					<option value="en">🇬🇧</option>
				</select>
			</div>
		</div>
	);
};
