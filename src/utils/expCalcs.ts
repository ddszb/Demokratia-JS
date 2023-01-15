const TOTAL_RANKS = 15;
const FIRST_RANK_EXP = 190;
const STEP_FACTOR = 110;

/**
 * Calculates exp earned from a movie score
 * @param movieScore
 * @returns
 */
export const calculateExp = (movieScore: number) => {
  let exp = 0;
  if (movieScore == 100) {
    exp += 100;
  }
  exp += movieScore * Math.floor(movieScore / 20);
  return exp;
};

/**
 * Gets a list of ranges of exp needed for each of the ranks possible
 * @returns
 */
export const getRanges = () => {
  const ranges: number[] = [];
  for (var i = 1; i <= TOTAL_RANKS; i++) {
    let apTerm = FIRST_RANK_EXP + (i - 1) * STEP_FACTOR;
    let sumTerm = ((FIRST_RANK_EXP + apTerm) * (i - 1)) / 2;
    ranges.push(apTerm + sumTerm);
  }
  return ranges;
};

/**
 * Calculates the current rank based on total exp
 * @param exp
 * @returns
 */
export const calculateRank = (exp: number) => {
  const ranges = getRanges();
  let rank = 1;
  for (rank; rank < TOTAL_RANKS; rank++) {
    if (exp < ranges[rank]) return rank;
  }
  return TOTAL_RANKS;
};

/**
 * Calculates exp needed for next rank
 * @param exp
 * @returns
 */
export const calcExpToNextRank = (exp: number) => {
  const ranges = getRanges();
  let rank = 1;
  for (rank; rank < TOTAL_RANKS; rank++) {
    if (exp < ranges[rank]) break;
  }
  return ranges[rank] - exp;
};
