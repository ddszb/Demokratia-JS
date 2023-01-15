export const truncateText = (text: string) => text.replace(/(.{10})..+/, '$1…');

export const roundToFixed = (input: number, digits: number) => {
	const rounded = Math.pow(10, digits);
	return (Math.round(input * rounded) / rounded).toFixed(digits);
};
