export const truncateText = (text: string, size?: number) =>
  text.substring(0, size || 10) + (text.length > size ? '…' : '');

export const roundToFixed = (input: number, digits: number) => {
  const rounded = Math.pow(10, digits);
  return (Math.round(input * rounded) / rounded).toFixed(digits);
};
