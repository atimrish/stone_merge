import {RefreshIcon} from "@src/shared/ui/icons/RefreshIcon";
import * as s from "./PauseModal.css";
import {PlayIcon} from "@src/shared/ui/icons/PlayIcon";
import {useGameContext} from "../../model/gameContext";
import {TLanguage} from "../../model/types";
import {i18n} from "../../config/i18n";
import {LOCAL_STORAGE_KEYS} from "../../config";
import {HomeIcon} from "@src/shared/ui/icons/HomeIcon";

export const PauseModal = () => {
	const {startNewGame, setPaused, setLanguage, language, setStarted} = useGameContext();

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

				<select
					className={s.modal__select}
					value={language}
					onChange={(e) => {
						localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, e.target.value);
						setLanguage(e.target.value as TLanguage);
					}}>
					<option value="ru">🇷🇺</option>
					<option value="en">🇬🇧</option>
				</select>

				<button
					className={s.modal__button}
					onClick={() => {
						setPaused(false);
						setStarted(false);
					}}>
					<HomeIcon />
				</button>
			</div>
		</div>
	);
};
