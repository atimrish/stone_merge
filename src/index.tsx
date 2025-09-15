import {createRoot} from "react-dom/client";
import {App} from "@src/app/App";
import "./index.css";

// YaGames.init().then((ysdk) => {
// 	window.ysdk = ysdk;
// 	ysdk.features.LoadingAPI.ready();
// 	const rootElem = document.getElementById("root")!;
// 	const root = createRoot(rootElem);
// 	root.render(<App />);
// });

const rootElem = document.getElementById("root")!;
const root = createRoot(rootElem);
root.render(<App />);
