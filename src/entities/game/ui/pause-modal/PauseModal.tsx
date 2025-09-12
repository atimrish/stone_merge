import {RefreshIcon} from "@src/shared/ui/icons/RefreshIcon";
import * as s from "./PauseModal.css";
import { PlayIcon } from "@src/shared/ui/icons/PlayIcon";
import { useGameContext } from "../../model/gameContext";

export const PauseModal = () => {
    const {startNewGame, setPaused} = useGameContext()

	return (
		<div className={s.modal}>
			<div className={s.modal__title}>Пауза</div>

			<div className={s.modal__button_container}>
                <button className={s.modal__button} onClick={() => setPaused(false)}>
                    <PlayIcon/>
                </button>

				<button className={s.modal__button} onClick={() => startNewGame()}>
					<RefreshIcon />
				</button>
			</div>
		</div>
	);
};
