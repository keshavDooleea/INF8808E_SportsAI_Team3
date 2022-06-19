// 'Canadian English' language format
const LOCALES = "en-CA";

/**
 * Extracts the month in numeric from a date
 * Ex: For the date '2021-09-28', the function returns '9'
 *
 * @param {string} The date (in string) to convert
 * @returns {string} the month of the date in numeric
 */
export function getMonthInNumeric(date) {
  return new Date(date).toLocaleString(LOCALES, {
    month: "numeric",
  });
}

/**
 * Extracts the month and year from a date
 * Example: For the date '2021-09-28', the function returns 'September 2021'
 *
 * @param {string} The date (in string) to convert
 * @returns {string} the month of the date in numeric
 */
export function getMonthYear(date) {
  return new Date(date).toLocaleString(LOCALES, {
    year: "numeric",
    month: "long",
  });
}
