import {PlayIcon} from "@src/shared/ui/icons/PlayIcon";
import * as s from "./StartScreen.css";
import {useGameContext} from "../../model/gameContext";
import {LOCAL_STORAGE_KEYS} from "../../config";
import {TLanguage} from "../../model/types";
import { i18n } from "../../config/i18n";

export const StartScreen = () => {
	const {startNewGame, setLanguage, language} = useGameContext();

	return (
		<div className={s.container}>
			<div className={s.title}>{i18n[language].title}</div>

            <div className={s.buttons_block}>
                <button className={s.button} onClick={() => startNewGame()}>
				<PlayIcon />
			</button>

			<select
				className={s.select}
                value={language}
				onChange={(e) => {
					localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, e.target.value);
					setLanguage(e.target.value as TLanguage);
				}}>
				<option value="ru">🇷🇺</option>
				<option value="en">🇬🇧</option>
			</select>
            </div>

			
		</div>
	);
};
