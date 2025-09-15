import {GameContainer} from "@src/entities/game/ui/game-container";
import {GameProvider} from "@src/entities/game/ui/game-provider/GameProvider";
import {StrictMode, useEffect} from "react";

export const App = () => {
	useEffect(() => {
		const preventContextMenuEvent = (e: MouseEvent) => {
			e.preventDefault();
		};

		document.body.addEventListener("contextmenu", preventContextMenuEvent);

		return () => {
			document.body.removeEventListener("contextmenu", preventContextMenuEvent);
		};
	}, []);

	return (
		<StrictMode>
			<GameProvider>
				<GameContainer />
			</GameProvider>
		</StrictMode>
	);
};
