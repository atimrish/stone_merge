import {useEffect, useRef} from "react";
import * as s from "./TimerProgressBar.css";
import {CELL_UPDATE_TIMER_DURATION} from "../../config";
import {useGameContext} from "../../model/gameContext";
import {ClockIcon} from "@src/shared/ui/icons/ClockIcon";

export const TimerProgressBar = () => {
	const {cells, pushRowAtBottom, gameOver, startTime, paused, started, boardBlockedRef} = useGameContext();

	const progressRef = useRef<HTMLDivElement>(null);
	const startTimeRef = useRef(performance.now());
	const pauseDiffRef = useRef(0);

	useEffect(() => {
		if (!gameOver && !paused && started) {
			let lastAnimatedFrame: number;

			const animate = (currentTime: number) => {
				if (currentTime <= startTimeRef.current + CELL_UPDATE_TIMER_DURATION) {
					const percent = 100 - ((currentTime - startTimeRef.current) / CELL_UPDATE_TIMER_DURATION) * 100;

					const remainedTime = startTimeRef.current + CELL_UPDATE_TIMER_DURATION - currentTime;

					if (remainedTime <= 180) {
						boardBlockedRef.current = true;
					}

					if (progressRef.current) {
						let progressColor: string;

						if (percent > 67) {
							progressColor = "#43AA8B";
						} else if (percent > 34) {
							progressColor = "#ffbd5f";
						} else {
							progressColor = "#FF6B6B";
						}

						progressRef.current.style.width = percent + "%";
						progressRef.current.style.backgroundColor = progressColor;
					}

					lastAnimatedFrame = requestAnimationFrame(animate);
				} else {
					//конец таймера: выставляем новый ряд снизу
					pushRowAtBottom();
					startTimeRef.current = performance.now();
				}
			};

			lastAnimatedFrame = requestAnimationFrame(animate);

			return () => {
				cancelAnimationFrame(lastAnimatedFrame);
			};
		}
	}, [cells, gameOver, paused, started]);

	useEffect(() => {
		if (paused && started) {
			pauseDiffRef.current = performance.now() - startTimeRef.current;
		} else {
			startTimeRef.current = performance.now() - pauseDiffRef.current;
		}
	}, [paused, started]);

	useEffect(() => {
		if (started) {
			startTimeRef.current = performance.now();
		}
	}, [startTime, started]);

	return (
		<div className={s.main_container}>
			<ClockIcon />

			<div className={s.progress_container}>
				<div ref={progressRef} className={s.inner_progress} />
			</div>
		</div>
	);
};
