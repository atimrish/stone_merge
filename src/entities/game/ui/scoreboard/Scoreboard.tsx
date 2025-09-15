import {animateNumber} from "@src/shared/lib/animateNumber";
import {CrownIcon} from "@src/shared/ui/icons/CrownIcon";
import {PauseIcon} from "@src/shared/ui/icons/PauseIcon";
import {useEffect, useRef} from "react";
import {useGameContext} from "../../model/gameContext";
import * as s from "./Scoreboard.css";

export const Scoreboard = () => {
	const {score, bestScore, setPaused} = useGameContext();

	const prevScore = useRef(score);
	const prevBestScore = useRef(bestScore);
	const scoreElemRef = useRef<HTMLDivElement>(null);
	const bestScoreElemRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (scoreElemRef.current) {
			animateNumber(prevScore.current, score, 1000, scoreElemRef.current);
		}

		prevScore.current = score;
	}, [score]);

	useEffect(() => {
		if (bestScoreElemRef.current) {
			animateNumber(prevBestScore.current, bestScore, 1000, bestScoreElemRef.current);
		}

		prevBestScore.current = bestScore;
	}, [bestScore]);

	return (
		<div className={s.scoreboard}>
			<div className={s.top_panel}>
				<div className={s.best_score}>
					<CrownIcon />
					<div ref={bestScoreElemRef}>{bestScore}</div>
				</div>

				<div className={s.right_block}>
					<button
						className={s.scoreboard_button}
						onClick={() => {
							// window.ysdk.adv.showFullscreenAdv();
							setPaused(true);
						}}>
						<PauseIcon />
					</button>
				</div>
			</div>
			<div className={s.score} ref={scoreElemRef}>
				{score}
			</div>
		</div>
	);
};
