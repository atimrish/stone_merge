import {SDK} from "ysdk";

declare global {
	interface Window {
		ysdk: SDK;
	}

	declare module "*.css";
}
