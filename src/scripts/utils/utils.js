/**
 * Utilitary funtion that returns an array of number in the given range, inclusively.
 *
 * @param {number} start The starting number
 * @param {number} stop The end number
 * @param {number} interval The interval used in the range
 * @returns {number[]} The array with a sequence of numbers within the given range
 *
 */

export function rangeInterval(start, stop, interval) {
  const res = [];

  for (let i = start; i <= stop; i += interval) {
    res.push(i);
  }

  return res;
}

export const TEXT_COLORS = {
  secondaryColor: "#5f697d",
  lightGray: "#ddd",
  radarAxes: "#aaa",
  radarSegments: "#ddd",
};
