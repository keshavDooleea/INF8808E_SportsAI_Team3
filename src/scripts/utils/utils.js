/**
 * Utilitary funtion that returns an array of number in the given range, inclusively.
 *
 * @param {number} start The starting number
 * @param {number} stop The end number
 * @returns {number[]} The array with a sequence of numbers within the given range
 *
 */

export function rangeInterval(start, stop) {
  const res = [];

  for (let i = start; i <= stop; i += 100) {
    res.push(i);
  }

  return res;
}
