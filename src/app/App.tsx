import {GameContainer} from "@src/entities/game/ui/game-container";
import {GameProvider} from "@src/entities/game/ui/game-provider/GameProvider";
import {StrictMode} from "react";

export const App = () => {
	return (
		<StrictMode>
			<GameProvider>
				<GameContainer />
			</GameProvider>
		</StrictMode>
	);
};
