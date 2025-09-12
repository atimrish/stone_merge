import {COLORS} from "../config/colors";

export const getColorByValue = (value: number): string => {
	if (value === 0) {
		return "";
	}

	const colorKey = (value % 10) as keyof typeof COLORS;
	return COLORS[colorKey];
};
